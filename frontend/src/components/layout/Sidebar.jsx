import { Activity, Bell, Clock3, LayoutDashboard, Settings2 } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Resumen', icon: LayoutDashboard, end: true },
  { to: '/history', label: 'Historial', icon: Clock3 },
  { to: '/notifications', label: 'Notificaciones', icon: Bell, badge: '2' },
  { to: '/settings', label: 'Configuración', icon: Settings2 },
]

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <Link className="brand" to="/" aria-label="PostureGuard, inicio">
        <span className="brand-mark"><Activity size={19} strokeWidth={2.2} /></span>
        <span>posture<span className="brand-light">guard</span></span>
      </Link>
      <p className="nav-caption">ESPACIO DE TRABAJO</p>
      <nav className="side-nav" aria-label="Navegación principal">
        {links.map(({ to, label, icon: Icon, badge, end }) => (
          <NavLink key={to} to={to} end={end} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            <Icon size={18} strokeWidth={1.8} />
            <span>{label}</span>
            {badge && <span className="nav-badge">{badge}</span>}
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-device">
        <span className="device-indicator" />
        <div><strong>Sensor conectado</strong><small>Actualizado ahora</small></div>
      </div>
      <div className="sidebar-profile">
        <span className="avatar">MG</span>
        <div><strong>María García</strong><small>Plan personal</small></div>
      </div>
    </aside>
  )
}