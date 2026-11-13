const API_BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/+$/, '')
const NODE_RED_BASE_URL = import.meta.env.VITE_NODE_RED_URL?.replace(/\/+$/, '')

function getEndpointUrl(endpoint) {
  if (!API_BASE_URL) {
    throw new Error('Configurá VITE_API_URL en frontend/.env para conectar con Flask.')
  }

  const baseUrl = import.meta.env.DEV ? '' : API_BASE_URL
  return `${baseUrl}/api/${endpoint}`
}

function getNodeRedReadingsUrl() {
  if (import.meta.env.DEV) return '/node-red/api/posturas'
  if (!NODE_RED_BASE_URL) {
    throw new Error('Configurá VITE_NODE_RED_URL en frontend/.env para conectar con Node-RED.')
  }

  return `${NODE_RED_BASE_URL}/api/posturas`
}

async function fetchArray(endpoint, signal, { url = getEndpointUrl(endpoint), server = 'Flask' } = {}) {
  let response

  try {
    response = await fetch(url, {
      headers: { Accept: 'application/json' },
      signal,
    })
  } catch (error) {
    if (error.name === 'AbortError') throw error
    throw new Error(`No se pudo conectar con ${server}. Verificá que esté encendido y accesible por Hamachi.`)
  }

  if (!response.ok) {
    throw new Error(`El servidor respondió con HTTP ${response.status} al consultar ${endpoint}.`)
  }

  let result
  try {
    result = await response.json()
  } catch {
    throw new Error(`El endpoint ${endpoint} no devolvió una respuesta JSON válida.`)
  }

  if (!Array.isArray(result)) {
    throw new Error(`El endpoint ${endpoint} no devolvió una lista de registros.`)
  }

  return result
}

function parseTimestamp(value) {
  if (typeof value !== 'string' || !value.trim()) return null

  const isMysqlTimestamp = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}(?:\.\d+)?$/.test(value)
  const normalized = isMysqlTimestamp ? value.replace(' ', 'T') : value
  const date = new Date(normalized)
  return Number.isNaN(date.getTime()) ? null : date.toISOString()
}

function toFiniteNumber(value) {
  if (value === null || value === undefined || value === '') return null
  const number = Number(value)
  return Number.isFinite(number) ? number : null
}

function mapReading(reading, index) {
  if (!reading || typeof reading !== 'object') {
    throw new Error('La respuesta de posturas contiene un registro inválido.')
  }

  const timestamp = parseTimestamp(reading.fecha)
  const angle = toFiniteNumber(reading.angulo_inclinacion)
  const duration = toFiniteNumber(reading.duracion)
  if (
    !timestamp
    || angle === null
    || (reading.estado_postura !== null && typeof reading.estado_postura !== 'string')
    || (reading.duracion !== undefined && (duration === null || duration < 0))
  ) {
    throw new Error('La respuesta de posturas no contiene fecha, ángulo, estado o duración válidos.')
  }

  return {
    id: reading.id_registro ?? `${timestamp}-${index}`,
    userId: reading.id_usuario ?? null,
    timestamp,
    angle,
    duration,
    status: reading.estado_postura?.trim() ?? '',
    name: typeof reading.nombre === 'string' ? reading.nombre : '',
  }
}

function mapUserSummary(summary) {
  if (!summary || typeof summary !== 'object') {
    throw new Error('La respuesta de resumen_usuarios contiene un registro inválido.')
  }

  const totalRecords = toFiniteNumber(summary.cantidad_registros)
  if (totalRecords === null) {
    throw new Error('La respuesta de resumen_usuarios no contiene una cantidad de registros válida.')
  }

  return {
    id: summary.id_usuario,
    name: typeof summary.nombre === 'string' ? summary.nombre : '',
    totalRecords,
  }
}

function mapAlert(alert, index) {
  if (!alert || typeof alert !== 'object' || typeof alert.mensaje !== 'string') {
    throw new Error('La respuesta de alertas contiene un registro inválido.')
  }

  const timestamp = parseTimestamp(alert.fecha)
  if (!timestamp) {
    throw new Error('La respuesta de alertas no contiene una fecha válida.')
  }

  return {
    id: alert.id_alerta ?? `${timestamp}-${index}`,
    userId: alert.id_usuario ?? null,
    message: alert.mensaje,
    timestamp,
  }
}

const api = {
  async getDashboardData({ signal } = {}) {
    const [readings, userSummaries, alerts] = await Promise.all([
      fetchArray('posturas', signal, { url: getNodeRedReadingsUrl(), server: 'Node-RED' }),
      fetchArray('resumen_usuarios', signal),
      fetchArray('alertas', signal),
    ])

    return {
      readings: readings.map(mapReading),
      userSummaries: userSummaries.map(mapUserSummary),
      alerts: alerts.map(mapAlert),
    }
  },
}

export default api
