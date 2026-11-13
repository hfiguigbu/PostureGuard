export function classifyPostureStatus(status) {
  const normalized = status
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()

  if (/(mala|incorrecta|bad)/.test(normalized)) return 'bad'
  if (/(advertencia|warning)/.test(normalized)) return 'warning'
  if (/(buena|correcta|good)/.test(normalized)) return 'good'
  return 'unknown'
}

export function formatDuration(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return 'Sin dato'

  const totalSeconds = Math.floor(seconds)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const remainingSeconds = totalSeconds % 60

  if (hours > 0) {
    return `${hours} h${minutes ? ` ${minutes} min` : ''}${remainingSeconds ? ` ${remainingSeconds} s` : ''}`
  }
  if (minutes > 0) return `${minutes} min${remainingSeconds ? ` ${remainingSeconds} s` : ''}`
  return `${remainingSeconds} s`
}

export function getConfiguredPostureLimit() {
  const configuredValue = import.meta.env.VITE_MAX_BAD_POSTURE_SECONDS?.trim()
  if (!configuredValue) return { seconds: null, error: '' }

  const seconds = Number(configuredValue)
  if (!Number.isFinite(seconds) || seconds <= 0) {
    return {
      seconds: null,
      error: 'VITE_MAX_BAD_POSTURE_SECONDS debe ser un número mayor que cero.',
    }
  }

  return { seconds, error: '' }
}
