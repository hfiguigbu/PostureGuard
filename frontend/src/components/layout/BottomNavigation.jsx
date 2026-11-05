import { Bell, Clock3, LayoutDashboard, Settings2 } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Inicio', icon: LayoutDashboard, end: true },
  { to: '/history', label: 'Historial', icon: Clock3 },
  { to: '/notifications', label: 'Avisos', icon: Bell },
  { to: '/settings', label: 'Ajustes', icon: Settings2 },
]

export default function BottomNavigation() {
  return (
    <nav className="bottom-nav" aria-label="Navegación móvil">
      {links.map(({ to, label, icon: Icon, end }) => (
        <NavLink key={to} to={to} end={end} className={({ isActive }) => `bottom-nav-link${isActive ? ' active' : ''}`}>
          <Icon size={20} strokeWidth={1.8} /><span>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}