import { useState } from 'react'
import PageTitle from '../components/common/PageTitle.jsx'

export default function Notifications() {
  const [filter, setFilter] = useState('all')

  return (
    <>
      <PageTitle eyebrow="CENTRO DE ACTIVIDAD" title="Notificaciones" description="Alertas y novedades sobre tu postura." action={<span className="unread-count">No disponibles</span>} />
      <div className="filter-tabs" role="group" aria-label="Filtrar notificaciones">
        {[['all', 'Todas'], ['alert', 'Alertas'], ['warning', 'Advertencias'], ['improvement', 'Mejoras']].map(([value, label]) => <button key={value} type="button" className={filter === value ? 'selected' : ''} onClick={() => setFilter(value)}>{label}</button>)}
      </div>
      <div className="notification-list">
        <div className="empty-state">La API actual todavía no proporciona notificaciones.</div>
      </div>
    </>
  )
}