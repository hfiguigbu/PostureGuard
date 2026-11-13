import { useMemo, useState } from 'react'
import DataState from '../components/common/DataState.jsx'
import NotificationCard from '../components/notifications/NotificationCard.jsx'
import PageTitle from '../components/common/PageTitle.jsx'
import useDashboardData from '../hooks/useDashboardData.js'

export default function Notifications() {
  const [filter, setFilter] = useState('all')
  const { alerts, userSummaries, loading, error, retry } = useDashboardData()
  const notifications = useMemo(() => alerts.map((alert) => {
    const user = userSummaries.find((summary) => String(summary.id) === String(alert.userId))
    return {
      id: alert.id,
      type: 'alert',
      title: 'Alerta registrada',
      description: alert.message,
      timestamp: alert.timestamp,
      user: user?.name ? `Usuario: ${user.name}` : alert.userId !== null ? `Usuario ID: ${alert.userId}` : '',
    }
  }), [alerts, userSummaries])

  return (
    <>
      <PageTitle eyebrow="CENTRO DE ACTIVIDAD" title="Alertas registradas" description="Alertas almacenadas en la API; no se envían notificaciones móviles." action={<span className="unread-count">{alerts.length} alertas</span>} />
      <DataState loading={loading} error={error} empty={!alerts.length} onRetry={retry} />
      <div className="filter-tabs" role="group" aria-label="Filtrar notificaciones">
        {[['all', 'Todas'], ['alert', 'Alertas']].map(([value, label]) => <button key={value} type="button" className={filter === value ? 'selected' : ''} onClick={() => setFilter(value)}>{label}</button>)}
      </div>
      <div className="notification-list">
        {notifications.filter((notification) => filter === 'all' || notification.type === filter).map((notification) => (
          <NotificationCard key={notification.id} notification={notification} />
        ))}
      </div>
    </>
  )
}