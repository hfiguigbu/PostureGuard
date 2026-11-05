import { AlertTriangle, CheckCircle2, Clock3, X } from 'lucide-react'
import Card from '../common/Card.jsx'

const typeDetails = {
  alert: { label: 'Alerta', icon: AlertTriangle },
  warning: { label: 'Advertencia', icon: Clock3 },
  improvement: { label: 'Mejora', icon: CheckCircle2 },
}

export default function NotificationCard({ notification, onDismiss }) {
  const { label, icon: Icon } = typeDetails[notification.type] || typeDetails.warning
  const date = new Intl.DateTimeFormat('es', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(notification.timestamp))

  return (
    <Card className={`notification-card notification-${notification.type}`}>
      <span className="notification-type-icon"><Icon size={19} /></span>
      <div className="notification-copy"><div className="notification-title-row"><h2>{notification.title}</h2><span className="notification-tag">{label}</span></div><p>{notification.description}</p><time>{date}</time></div>
      {onDismiss && <button className="dismiss-button" type="button" onClick={() => onDismiss(notification.id)} aria-label="Descartar notificación" title="Descartar"><X size={17} /></button>}
    </Card>
  )
}