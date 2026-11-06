const API_BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/+$/, '')

function getEndpointUrl(endpoint) {
  if (!API_BASE_URL) {
    throw new Error('Configurá VITE_API_URL en frontend/.env para conectar con Flask.')
  }

  const baseUrl = import.meta.env.DEV ? '' : API_BASE_URL
  return `${baseUrl}/api/${endpoint}`
}

async function fetchArray(endpoint, signal) {
  let response

  try {
    response = await fetch(getEndpointUrl(endpoint), {
      headers: { Accept: 'application/json' },
      signal,
    })
  } catch (error) {
    if (error.name === 'AbortError') throw error
    throw new Error('No se pudo conectar con Flask. Verificá que esté encendido y accesible por Hamachi.')
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

  const normalized = value.includes(' ') && !value.includes('T')
    ? value.replace(' ', 'T')
    : value
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
    throw new Error('La respuesta de lecturas_sensores contiene un registro inválido.')
  }

  const timestamp = parseTimestamp(reading.fecha)
  const angle = toFiniteNumber(reading.angulo_inclinacion)
  if (!timestamp || angle === null || (reading.estado_postura !== null && typeof reading.estado_postura !== 'string')) {
    throw new Error('La respuesta de lecturas_sensores no contiene fecha, ángulo o estado válidos.')
  }

  return {
    id: `${timestamp}-${index}`,
    timestamp,
    angle,
    status: reading.estado_postura?.trim() ?? '',
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

const api = {
  async getDashboardData({ signal } = {}) {
    const [readings, userSummaries] = await Promise.all([
      fetchArray('lecturas_sensores', signal),
      fetchArray('resumen_usuarios', signal),
    ])

    return {
      readings: readings.map(mapReading),
      userSummaries: userSummaries.map(mapUserSummary),
    }
  },
}

export default api
