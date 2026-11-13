import { classifyPostureStatus, formatDuration } from '../../utils/posture.js'

export default function HistoryTable({ readings }) {
  const dateFormat = new Intl.DateTimeFormat('es', { day: '2-digit', month: 'short', year: 'numeric' })
  const timeFormat = new Intl.DateTimeFormat('es', { hour: '2-digit', minute: '2-digit' })

  return (
    <div className="table-scroll"><table className="history-table"><thead><tr><th>Fecha</th><th>Hora</th><th>Inclinación</th><th>Duración acumulada</th><th>Estado</th></tr></thead><tbody>
      {readings.length ? readings.map((reading) => {
        const date = new Date(reading.timestamp)
        const category = classifyPostureStatus(reading.status)
        return <tr key={reading.id}><td>{dateFormat.format(date)}</td><td>{timeFormat.format(date)}</td><td><strong>{reading.angle}°</strong></td><td>{reading.duration === null || reading.duration === undefined ? 'Sin dato' : formatDuration(reading.duration)}</td><td><span className={`reading-status ${category}`}><i />{reading.status || 'Sin estado informado'}</span></td></tr>
      }) : <tr><td colSpan="5" className="empty-table">No hay registros para los filtros seleccionados.</td></tr>}
    </tbody></table></div>
  )
}