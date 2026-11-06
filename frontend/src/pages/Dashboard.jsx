import { useEffect, useMemo, useState } from 'react'
import { Activity, CircleCheck, Radio } from 'lucide-react'
import { Link } from 'react-router-dom'
import DataState from '../components/common/DataState.jsx'
import DailySummary from '../components/dashboard/DailySummary.jsx'
import PostureChart from '../components/dashboard/PostureChart.jsx'
import PostureStatus from '../components/dashboard/PostureStatus.jsx'
import StatCard from '../components/dashboard/StatCard.jsx'
import PageTitle from '../components/common/PageTitle.jsx'
import useDashboardData from '../hooks/useDashboardData.js'
import { classifyPostureStatus } from '../utils/posture.js'

export default function Dashboard() {
  const { readings, userSummaries, loading, hasLoaded, error, retry } = useDashboardData()
  const [today, setToday] = useState('')

  useEffect(() => {
    const updateToday = () => {
      const currentDay = new Date().toDateString()
      setToday((previousDay) => previousDay === currentDay ? previousDay : currentDay)
    }

    updateToday()
    const intervalId = window.setInterval(updateToday, 60000)
    return () => window.clearInterval(intervalId)
  }, [])

  const sortedReadings = useMemo(
    () => [...readings].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)),
    [readings],
  )
  const todayReadings = sortedReadings.filter(
    (reading) => today && new Date(reading.timestamp).toDateString() === today,
  )
  const readingsWithKnownStatus = todayReadings.filter(
    (reading) => classifyPostureStatus(reading.status) !== 'unknown',
  )
  const goodCount = readingsWithKnownStatus.filter(
    (reading) => classifyPostureStatus(reading.status) === 'good',
  ).length
  const badCount = readingsWithKnownStatus.filter(
    (reading) => classifyPostureStatus(reading.status) === 'bad',
  ).length
  const goodPercent = readingsWithKnownStatus.length
    ? Math.round((goodCount / readingsWithKnownStatus.length) * 100)
    : null
  const badPercent = readingsWithKnownStatus.length
    ? Math.round((badCount / readingsWithKnownStatus.length) * 100)
    : null
  const totalRecords = userSummaries.length
    ? userSummaries.reduce((total, summary) => total + summary.totalRecords, 0)
    : null
  const hasData = readings.length > 0 || (totalRecords !== null && totalRecords > 0)
  const latestReading = sortedReadings[0]

  return (
    <>
      <PageTitle eyebrow="SEGUIMIENTO DIARIO" title="Tu postura, de un vistazo" description="Un pequeño ajuste hoy puede hacer una gran diferencia." />
      <DataState loading={loading} error={error} empty={!hasData} onRetry={retry} />
      <div className="dashboard-grid">
        <PostureStatus reading={latestReading} />
        <DailySummary totalRecords={totalRecords} />
      </div>
      <div className="stats-grid">
        <StatCard label="LECTURAS DE HOY" value={hasLoaded ? todayReadings.length : '—'} note="Registros devueltos por la API" icon={Radio} />
        <StatCard label="BUENA POSTURA" value={goodPercent ?? '—'} suffix={goodPercent === null ? '' : '%'} note="Calculado desde los estados informados" icon={CircleCheck} />
        <StatCard label="MALA POSTURA" value={badPercent ?? '—'} suffix={badPercent === null ? '' : '%'} note="Calculado desde los estados informados" icon={Activity} tone="red" />
      </div>
      <div className="dashboard-lower-grid">
        <PostureChart readings={todayReadings} />
        <aside className="quick-panel">
          <p className="eyebrow">ACCESO RÁPIDO</p>
          <h2>Seguí tu progreso</h2>
          <p className="quick-description">Revisá tus registros y mantené el hábito de una postura saludable.</p>
          <Link className="quick-link" to="/history"><span className="quick-link-icon"><Activity size={17} /></span><span><strong>Ver historial</strong><small>Explorá tus últimas lecturas</small></span><span className="quick-arrow">→</span></Link>
          <Link className="quick-link" to="/notifications"><span className="quick-link-icon amber"><Radio size={17} /></span><span><strong>Notificaciones</strong><small>La API actual no proporciona avisos</small></span><span className="quick-arrow">→</span></Link>
          <div className="sensor-note">Datos de sensores <span>{readings.length ? 'Disponibles' : 'Sin lecturas'}</span></div>
        </aside>
      </div>
    </>
  )
}