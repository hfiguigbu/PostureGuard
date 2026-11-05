import { Activity, CircleCheck, Radio } from 'lucide-react'
import { Link } from 'react-router-dom'
import DailySummary from '../components/dashboard/DailySummary.jsx'
import PostureChart from '../components/dashboard/PostureChart.jsx'
import PostureStatus from '../components/dashboard/PostureStatus.jsx'
import StatCard from '../components/dashboard/StatCard.jsx'
import PageTitle from '../components/common/PageTitle.jsx'
import { dashboardSummary, postureReadings, todayPostureReadings } from '../data/mockData.js'

export default function Dashboard() {
  const readingsForChart = todayPostureReadings.length ? todayPostureReadings : postureReadings.slice(0, 12)

  return (
    <>
      <PageTitle eyebrow="SEGUIMIENTO DIARIO" title="Tu postura, de un vistazo" description="Un pequeño ajuste hoy puede hacer una gran diferencia." />
      <div className="dashboard-grid">
        <PostureStatus status={dashboardSummary.currentStatus} />
        <DailySummary minutes={dashboardSummary.badPostureMinutes} />
      </div>
      <div className="stats-grid">
        <StatCard label="LECTURAS DE HOY" value={dashboardSummary.registeredReadings} note="Sensor activo durante la jornada" icon={Radio} />
        <StatCard label="BUENA POSTURA" value={dashboardSummary.goodPosturePercent} suffix="%" note="+ 6% respecto a ayer" icon={CircleCheck} />
        <StatCard label="MALA POSTURA" value={dashboardSummary.badPosturePercent} suffix="%" note="Dentro de tu promedio" icon={Activity} tone="red" />
      </div>
      <div className="dashboard-lower-grid">
        <PostureChart readings={readingsForChart} />
        <aside className="quick-panel">
          <p className="eyebrow">ACCESO RÁPIDO</p>
          <h2>Seguí tu progreso</h2>
          <p className="quick-description">Revisá tus registros y mantené el hábito de una postura saludable.</p>
          <Link className="quick-link" to="/history"><span className="quick-link-icon"><Activity size={17} /></span><span><strong>Ver historial</strong><small>Explorá tus últimas lecturas</small></span><span className="quick-arrow">→</span></Link>
          <Link className="quick-link" to="/notifications"><span className="quick-link-icon amber"><Radio size={17} /></span><span><strong>Notificaciones</strong><small>2 avisos requieren atención</small></span><span className="quick-arrow">→</span></Link>
          <div className="sensor-note"><span className="device-indicator" /> Sensor PostureGuard <span>Conectado</span></div>
        </aside>
      </div>
    </>
  )
}