import { Activity, Bell, Clock3, LayoutDashboard, Settings2 } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Resumen', icon: LayoutDashboard, end: true },
  { to: '/history', label: 'Historial', icon: Clock3 },
  { to: '/notifications', label: 'Notificaciones', icon: Bell },
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
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            <Icon size={18} strokeWidth={1.8} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-device">
        <div><strong>Datos de sensores</strong><small>Consultados desde el panel</small></div>
      </div>
      <div className="sidebar-profile">
        <span className="avatar">PG</span>
        <div><strong>PostureGuard</strong><small>Seguimiento de postura</small></div>
      </div>
    </aside>
  )
}