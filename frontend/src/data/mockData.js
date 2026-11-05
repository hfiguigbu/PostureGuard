const makeTimestamp = (daysAgo, hour, minute) => {
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)
  date.setHours(hour, minute, 0, 0)
  return date.toISOString()
}

export const postureReadings = [
  { id: 1, timestamp: makeTimestamp(0, 8, 10), angle: 8, status: 'good' },
  { id: 2, timestamp: makeTimestamp(0, 8, 42), angle: 12, status: 'good' },
  { id: 3, timestamp: makeTimestamp(0, 9, 15), angle: 24, status: 'warning' },
  { id: 4, timestamp: makeTimestamp(0, 9, 48), angle: 31, status: 'bad' },
  { id: 5, timestamp: makeTimestamp(0, 10, 20), angle: 17, status: 'good' },
  { id: 6, timestamp: makeTimestamp(0, 11, 5), angle: 11, status: 'good' },
  { id: 7, timestamp: makeTimestamp(0, 11, 38), angle: 27, status: 'warning' },
  { id: 8, timestamp: makeTimestamp(0, 12, 12), angle: 34, status: 'bad' },
  { id: 9, timestamp: makeTimestamp(0, 13, 30), angle: 15, status: 'good' },
  { id: 10, timestamp: makeTimestamp(0, 14, 4), angle: 9, status: 'good' },
  { id: 11, timestamp: makeTimestamp(0, 14, 45), angle: 29, status: 'bad' },
  { id: 12, timestamp: makeTimestamp(0, 15, 20), angle: 13, status: 'good' },
  { id: 13, timestamp: makeTimestamp(1, 9, 5), angle: 18, status: 'good' },
  { id: 14, timestamp: makeTimestamp(1, 10, 14), angle: 32, status: 'bad' },
  { id: 15, timestamp: makeTimestamp(1, 11, 42), angle: 22, status: 'warning' },
  { id: 16, timestamp: makeTimestamp(2, 8, 50), angle: 10, status: 'good' },
  { id: 17, timestamp: makeTimestamp(2, 10, 25), angle: 28, status: 'bad' },
  { id: 18, timestamp: makeTimestamp(2, 12, 40), angle: 16, status: 'good' },
  { id: 19, timestamp: makeTimestamp(3, 9, 30), angle: 25, status: 'warning' },
  { id: 20, timestamp: makeTimestamp(3, 11, 10), angle: 12, status: 'good' },
  { id: 21, timestamp: makeTimestamp(4, 8, 35), angle: 30, status: 'bad' },
  { id: 22, timestamp: makeTimestamp(4, 10, 55), angle: 14, status: 'good' },
  { id: 23, timestamp: makeTimestamp(5, 9, 18), angle: 19, status: 'good' },
  { id: 24, timestamp: makeTimestamp(6, 13, 5), angle: 33, status: 'bad' },
]

export const todayPostureReadings = postureReadings.filter(
  (reading) => new Date(reading.timestamp).toDateString() === new Date().toDateString(),
)

export const notifications = [
  {
    id: 1,
    type: 'alert',
    title: 'Postura incorrecta detectada',
    description: 'Llevás 12 minutos con una inclinación mayor a 30°. Tomate un momento para corregirla.',
    timestamp: makeTimestamp(0, 14, 45),
  },
  {
    id: 2,
    type: 'warning',
    title: 'Inclinación por encima del umbral',
    description: 'Tu postura superó los 25° durante más de 3 minutos.',
    timestamp: makeTimestamp(0, 11, 38),
  },
  {
    id: 3,
    type: 'improvement',
    title: '¡Buen trabajo!',
    description: 'Mantuviste una postura saludable durante 45 minutos seguidos.',
    timestamp: makeTimestamp(0, 10, 20),
  },
  {
    id: 4,
    type: 'alert',
    title: 'Recordatorio de postura',
    description: 'Se detectó una inclinación de 34°. Acomodá la espalda y la pantalla.',
    timestamp: makeTimestamp(0, 12, 12),
  },
  {
    id: 5,
    type: 'improvement',
    title: 'Racha saludable',
    description: 'Tuviste un 86% de lecturas con buena postura ayer.',
    timestamp: makeTimestamp(1, 17, 0),
  },
]

export const dashboardSummary = {
  currentStatus: 'good',
  badPostureMinutes: 18,
  registeredReadings: todayPostureReadings.length,
  goodPosturePercent: 78,
  badPosturePercent: 22,
}