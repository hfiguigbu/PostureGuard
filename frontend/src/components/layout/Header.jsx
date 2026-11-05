import { Bell, ChevronDown, Settings2 } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

const pageNames = {
  '/': 'Panel de control',
  '/history': 'Historial',
  '/notifications': 'Notificaciones',
  '/settings': 'Configuración',
}

export default function Header() {
  const { pathname } = useLocation()

  return (
    <header className="topbar">
      <div className="breadcrumb"><span>PostureGuard</span><span className="breadcrumb-divider">/</span><strong>{pageNames[pathname] || 'Panel de control'}</strong></div>
      <div className="topbar-actions">
        <span className="today-label">Monitoreo activo</span>
        <Link className="icon-button notification-button" to="/notifications" aria-label="Ver notificaciones" title="Notificaciones">
          <Bell size={18} /><span className="notification-dot" />
        </Link>
        <Link className="icon-button settings-shortcut" to="/settings" aria-label="Configuración" title="Configuración"><Settings2 size={18} /></Link>
        <button className="profile-menu" type="button" aria-label="Menú de perfil"><span className="avatar avatar-small">MG</span><ChevronDown size={15} /></button>
      </div>
    </header>
  )
}