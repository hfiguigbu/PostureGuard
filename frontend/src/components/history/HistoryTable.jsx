const statusNames = { good: 'Buena', warning: 'Advertencia', bad: 'Mala' }

export default function HistoryTable({ readings }) {
  const dateFormat = new Intl.DateTimeFormat('es', { day: '2-digit', month: 'short', year: 'numeric' })
  const timeFormat = new Intl.DateTimeFormat('es', { hour: '2-digit', minute: '2-digit' })

  return (
    <div className="table-scroll"><table className="history-table"><thead><tr><th>Fecha</th><th>Hora</th><th>Inclinación</th><th>Estado</th></tr></thead><tbody>
      {readings.length ? readings.map((reading) => {
        const date = new Date(reading.timestamp)
        return <tr key={reading.id}><td>{dateFormat.format(date)}</td><td>{timeFormat.format(date)}</td><td><strong>{reading.angle}°</strong></td><td><span className={`reading-status ${reading.status}`}><i />{statusNames[reading.status]}</span></td></tr>
      }) : <tr><td colSpan="4" className="empty-table">No hay registros para los filtros seleccionados.</td></tr>}
    </tbody></table></div>
  )
}