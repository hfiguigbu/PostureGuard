
import json
import os
import time

import paho.mqtt.client as mqtt
import mysql.connector

from dotenv import load_dotenv
from flask import Flask, jsonify

load_dotenv()

# =====================================================
# CONFIGURACIÓN MQTT
# =====================================================

MQTT_BROKER = "broker.hivemq.com"
MQTT_PORT = 1883
MQTT_TOPIC = "postureguard/grupo6/postura"

# =====================================================
# CONFIGURACIÓN MYSQL
# =====================================================

DB_HOST = "localhost"
DB_USER = "root"
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_NAME = "postura_db"

ID_USUARIO = 21

# =====================================================
# CONFIGURACIÓN DEL MONITOREO
# =====================================================

# Tiempo máximo permitido de buena postura
# sin reiniciar el período de mala postura.
TOLERANCIA_BUENA = 5

# Si no llegan lecturas durante más de 6 segundos,
# se considera interrumpido el seguimiento.
MAX_INTERVALO_LECTURAS = 6

# =====================================================
# ESTADO TEMPORAL EN MEMORIA
# =====================================================

seguimiento = {}

def obtener_seguimiento(id_usuario):

    if id_usuario not in seguimiento:

        seguimiento[id_usuario] = {
            "duracion": 0.0,
            "ultimo_estado": None,
            "ultimo_mensaje": None,
            "inicio_buena": None,
            "alerta_enviada": False
        }

    return seguimiento[id_usuario]


# =====================================================
# FLASK
# =====================================================

app = Flask(__name__)


# =====================================================
# CONEXIÓN MYSQL
# =====================================================

def conectar_mysql():

    conexion = mysql.connector.connect(
        host=DB_HOST,
        user=DB_USER,
        password=DB_PASSWORD,
        database=DB_NAME
    )

    cursor = conexion.cursor()
    cursor.execute("SET SESSION time_zone = '-03:00'")
    cursor.close()

    return conexion


# =====================================================
# PROCESAMIENTO DE POSTURA
# =====================================================

def procesar_postura(pitch, estado):

    conexion = None
    cursor = None

    try:

        if estado not in ("buena", "mala"):
            raise ValueError("Estado de postura no válido")

        conexion = conectar_mysql()
        cursor = conexion.cursor(dictionary=True)

        # Obtener fecha y hora desde MySQL.
        cursor.execute("SELECT NOW() AS ahora")
        ahora = cursor.fetchone()["ahora"]

        # Obtener el umbral configurado para el usuario.
        cursor.execute(
            """
            SELECT tiempo_max_mala_postura
            FROM Usuario
            WHERE id_usuario = %s
            """,
            (ID_USUARIO,)
        )

        usuario = cursor.fetchone()

        if usuario is None:
            raise ValueError(
                f"No existe el usuario {ID_USUARIO}"
            )

        tiempo_maximo = usuario["tiempo_max_mala_postura"]

        if tiempo_maximo <= 0:
            raise ValueError(
                "El tiempo máximo de mala postura debe ser mayor que cero"
            )

        # Obtener el seguimiento en memoria.
        estado_actual = obtener_seguimiento(ID_USUARIO)

        ahora_monotonic = time.monotonic()

        ultimo_estado = estado_actual["ultimo_estado"]
        ultimo_mensaje = estado_actual["ultimo_mensaje"]

        duracion = estado_actual["duracion"]
        inicio_buena = estado_actual["inicio_buena"]
        alerta_enviada = estado_actual["alerta_enviada"]

        # -------------------------------------------------
        # DETECTAR INTERRUPCIÓN DE COMUNICACIÓN
        # -------------------------------------------------

        if ultimo_mensaje is not None:

            intervalo = ahora_monotonic - ultimo_mensaje

            if intervalo > MAX_INTERVALO_LECTURAS:

                duracion = 0.0
                inicio_buena = None
                alerta_enviada = False
                ultimo_estado = None

        # -------------------------------------------------
        # PROCESAR POSTURA MALA
        # -------------------------------------------------

        if estado == "mala":

            if ultimo_estado == "mala":

                # Sumar el tiempo transcurrido desde la
                # última lectura mala.
                intervalo = ahora_monotonic - ultimo_mensaje

                duracion += intervalo

            elif ultimo_estado == "buena":

                # Volvió a mala después de un período bueno.
                tiempo_buena = (
                    ahora_monotonic - inicio_buena
                    if inicio_buena is not None
                    else TOLERANCIA_BUENA + 1
                )

                if tiempo_buena > TOLERANCIA_BUENA:

                    # Superó la tolerancia: período nuevo.
                    duracion = 0.0
                    alerta_enviada = False

                # Si no superó la tolerancia, conserva
                # la duración acumulada.

                inicio_buena = None

            else:

                # Primera lectura mala de un período nuevo.
                duracion = 0.0
                inicio_buena = None
                alerta_enviada = False

        # -------------------------------------------------
        # PROCESAR POSTURA BUENA
        # -------------------------------------------------

        elif estado == "buena":

            if ultimo_estado == "mala":

                # Contabilizar el tiempo desde la última
                # lectura mala hasta esta lectura buena.
                intervalo = ahora_monotonic - ultimo_mensaje
                duracion += intervalo

                # Comienza el período de tolerancia.
                inicio_buena = ahora_monotonic

            elif ultimo_estado == "buena":

                # Comprobar si superó el tiempo permitido.
                if inicio_buena is not None:

                    tiempo_buena = (
                        ahora_monotonic - inicio_buena
                    )

                    if tiempo_buena > TOLERANCIA_BUENA:

                        duracion = 0.0
                        alerta_enviada = False
                        inicio_buena = None

        # -------------------------------------------------
        # GENERAR ALERTA
        # -------------------------------------------------

        if (
            estado == "mala"
            and duracion >= tiempo_maximo
            and not alerta_enviada
        ):

            cursor.execute(
                """
                INSERT INTO Alerta
                (id_usuario, mensaje, fecha)
                VALUES (%s, %s, NOW())
                """,
                (
                    ID_USUARIO,
                    "Se detectó una mala postura prolongada. "
                    "Se recomienda corregir la postura."
                )
            )

            alerta_enviada = True

            print("¡ALERTA DE MALA POSTURA GENERADA!")

        # -------------------------------------------------
        # GUARDAR LECTURA HISTÓRICA
        # -------------------------------------------------

        cursor.execute(
            """
            INSERT INTO Registro_Postura
            (
                id_usuario,
                angulo_inclinacion,
                estado_postura,
                duracion,
                fecha
            )
            VALUES (%s, %s, %s, %s, NOW())
            """,
            (
                ID_USUARIO,
                pitch,
                estado,
                int(duracion)
            )
        )

        conexion.commit()

        # Actualizar el seguimiento en memoria
        # solamente después de guardar correctamente.
        estado_actual["duracion"] = duracion
        estado_actual["ultimo_estado"] = estado
        estado_actual["ultimo_mensaje"] = ahora_monotonic
        estado_actual["inicio_buena"] = inicio_buena
        estado_actual["alerta_enviada"] = alerta_enviada

        print("\n------------------------------")
        print("Lectura guardada correctamente")
        print("Ángulo:", pitch)
        print("Estado:", estado)
        print("Duración acumulada:", int(duracion), "segundos")
        print("Umbral:", tiempo_maximo, "segundos")

    except Exception as error:

        if conexion:
            conexion.rollback()

        print("Error al procesar postura:", error)

    finally:

        if cursor:
            cursor.close()

        if conexion and conexion.is_connected():
            conexion.close()


# =====================================================
# MQTT - CUANDO SE CONECTA
# =====================================================

def cuando_se_conecta(client, userdata, flags, rc):

    if rc == 0:

        print("Conectado al broker MQTT")
        client.subscribe(MQTT_TOPIC)

        print("Suscripto al tópico:", MQTT_TOPIC)

    else:

        print("Error al conectar a MQTT:", rc)


# =====================================================
# MQTT - CUANDO LLEGA UN MENSAJE
# =====================================================

def cuando_llega_mensaje(client, userdata, msg):

    try:

        mensaje = msg.payload.decode("utf-8")
        datos = json.loads(mensaje)

        pitch = float(datos["pitch"])
        estado = datos["estado_postura"]

        print("\nNuevo mensaje MQTT recibido")
        print("Payload:", mensaje)

        procesar_postura(pitch, estado)

    except Exception as error:

        print("Error al recibir mensaje MQTT:", error)


# =====================================================
# ENDPOINT 1 - LECTURAS DE LOS SENSORES
# =====================================================

@app.route("/api/lecturas_sensores", methods=["GET"])
def lecturas_sensores():

    conexion = None
    cursor = None

    try:

        conexion = conectar_mysql()
        cursor = conexion.cursor(dictionary=True)

        sql = """
        SELECT
            u.nombre,
            r.fecha,
            r.estado_postura,
            r.angulo_inclinacion,
            r.duracion
        FROM Usuario u
        INNER JOIN Registro_Postura r
            ON u.id_usuario = r.id_usuario
        WHERE u.id_usuario = %s
        ORDER BY r.fecha DESC
        """

        cursor.execute(sql, (ID_USUARIO,))
        resultados = cursor.fetchall()

        return jsonify(resultados)

    except Exception as error:

        return jsonify({"error": str(error)}), 500

    finally:

        if cursor:
            cursor.close()

        if conexion and conexion.is_connected():
            conexion.close()


# =====================================================
# ENDPOINT 2 - RESUMEN DE USUARIOS
# =====================================================

@app.route("/api/resumen_usuarios", methods=["GET"])
def resumen_usuarios():

    conexion = None
    cursor = None

    try:

        conexion = conectar_mysql()
        cursor = conexion.cursor(dictionary=True)

        sql = """
        SELECT
            u.id_usuario,
            u.nombre,
            COUNT(r.id_registro) AS cantidad_registros
        FROM Usuario u
        LEFT JOIN Registro_Postura r
            ON u.id_usuario = r.id_usuario
        GROUP BY
            u.id_usuario,
            u.nombre
        ORDER BY cantidad_registros DESC
        """

        cursor.execute(sql)
        resultados = cursor.fetchall()

        return jsonify(resultados)

    except Exception as error:

        return jsonify({"error": str(error)}), 500

    finally:

        if cursor:
            cursor.close()

        if conexion and conexion.is_connected():
            conexion.close()


# =====================================================
# ENDPOINT 3 - ALERTAS
# =====================================================

@app.route("/api/alertas", methods=["GET"])
def alertas():

    conexion = None
    cursor = None

    try:

        conexion = conectar_mysql()
        cursor = conexion.cursor(dictionary=True)

        sql = """
        SELECT
            id_alerta,
            id_usuario,
            mensaje,
            fecha
        FROM Alerta
        WHERE id_usuario = %s
        ORDER BY fecha DESC
        """

        cursor.execute(sql, (ID_USUARIO,))
        resultados = cursor.fetchall()

        return jsonify(resultados)

    except Exception as error:

        return jsonify({"error": str(error)}), 500

    finally:

        if cursor:
            cursor.close()

        if conexion and conexion.is_connected():
            conexion.close()


# =====================================================
# INICIAR MQTT
# =====================================================

cliente = mqtt.Client()

cliente.on_connect = cuando_se_conecta
cliente.on_message = cuando_llega_mensaje

print("Conectando al broker MQTT...")

cliente.connect(
    MQTT_BROKER,
    MQTT_PORT,
    60
)

cliente.loop_start()


# =====================================================
# INICIAR API REST
# =====================================================

print("Servidor API iniciado")
print("API disponible en http://localhost:5000")

app.run(
    host="0.0.0.0",
    port=5000,
    debug=False
)