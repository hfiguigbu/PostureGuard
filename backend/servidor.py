import json
import os
import threading

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
# FLASK
# =====================================================

app = Flask(__name__)


# =====================================================
# FUNCIÓN PARA CONECTARSE A MYSQL
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
# MQTT - CUANDO SE CONECTA
# =====================================================

def cuando_se_conecta(client, userdata, flags, rc):

    if rc == 0:

        print("Conectado al broker MQTT")

        client.subscribe(MQTT_TOPIC)

        print("Suscripto al tópico:")
        print(MQTT_TOPIC)

    else:

        print("Error al conectar a MQTT:", rc)


# =====================================================
# MQTT - CUANDO LLEGA UN MENSAJE
# =====================================================

def cuando_llega_mensaje(client, userdata, msg):

    print("\n------------------------------")
    print("Nuevo mensaje MQTT recibido")

    try:

        mensaje = msg.payload.decode("utf-8")

        print("Payload:", mensaje)

        datos = json.loads(mensaje)

        pitch = datos["pitch"]
        estado = datos["estado_postura"]

        print("Pitch:", pitch)
        print("Estado:", estado)

        # Conectar a MySQL
        conexion = conectar_mysql()

        cursor = conexion.cursor()

        # INSERT
        sql = """
        INSERT INTO Registro_Postura
        (id_usuario, angulo_inclinacion, estado_postura, duracion, fecha)
        VALUES (%s, %s, %s, %s, NOW())
        """

        valores = (
            ID_USUARIO,
            pitch,
            estado,
            0
        )

        cursor.execute(sql, valores)

        conexion.commit()

        print("Lectura guardada correctamente en MySQL")

        cursor.close()
        conexion.close()

    except Exception as error:

        print("Error:", error)


# =====================================================
# ENDPOINT 1
# LECTURAS DE LOS SENSORES
# =====================================================

@app.route("/api/lecturas_sensores", methods=["GET"])
def lecturas_sensores():

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
        ORDER BY r.fecha DESC
        """

        cursor.execute(sql)

        resultados = cursor.fetchall()

        cursor.close()
        conexion.close()

        return jsonify(resultados)

    except Exception as error:

        return jsonify({
            "error": str(error)
        }), 500


# =====================================================
# ENDPOINT 2
# CANTIDAD DE REGISTROS POR USUARIO
# =====================================================

@app.route("/api/resumen_usuarios", methods=["GET"])
def resumen_usuarios():

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

        cursor.close()
        conexion.close()

        return jsonify(resultados)

    except Exception as error:

        return jsonify({
            "error": str(error)
        }), 500


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

# MQTT funciona en segundo plano
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