import { useState } from 'react'
import PageTitle from '../components/common/PageTitle.jsx'
import NotificationCard from '../components/notifications/NotificationCard.jsx'
import { notifications as initialNotifications } from '../data/mockData.js'

export default function Notifications() {
  const [items, setItems] = useState(initialNotifications)
  const [filter, setFilter] = useState('all')
  const filteredItems = items.filter((item) => filter === 'all' || item.type === filter)

  const dismiss = (id) => setItems((current) => current.filter((item) => item.id !== id))

  return (
    <>
      <PageTitle eyebrow="CENTRO DE ACTIVIDAD" title="Notificaciones" description="Alertas y novedades sobre tu postura." action={<span className="unread-count">{items.length} avisos</span>} />
      <div className="filter-tabs" role="group" aria-label="Filtrar notificaciones">
        {[['all', 'Todas'], ['alert', 'Alertas'], ['warning', 'Advertencias'], ['improvement', 'Mejoras']].map(([value, label]) => <button key={value} type="button" className={filter === value ? 'selected' : ''} onClick={() => setFilter(value)}>{label}</button>)}
      </div>
      <div className="notification-list">
        {filteredItems.length ? filteredItems.map((item) => <NotificationCard key={item.id} notification={item} onDismiss={dismiss} />) : <div className="empty-state">No hay notificaciones en esta categoría.</div>}
      </div>
    </>
  )
}