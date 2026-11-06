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
