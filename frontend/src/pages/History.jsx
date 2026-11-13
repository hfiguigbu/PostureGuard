import { useMemo, useState } from 'react'
import { Download } from 'lucide-react'
import Card from '../components/common/Card.jsx'
import DataState from '../components/common/DataState.jsx'
import PageTitle from '../components/common/PageTitle.jsx'
import HistoryFilters from '../components/history/HistoryFilters.jsx'
import HistoryTable from '../components/history/HistoryTable.jsx'
import PostureChart from '../components/dashboard/PostureChart.jsx'
import useDashboardData from '../hooks/useDashboardData.js'
import { classifyPostureStatus, formatDuration } from '../utils/posture.js'

export default function History() {
  const [filters, setFilters] = useState({ from: '', to: '', status: 'all' })
  const { readings, loading, error, retry } = useDashboardData()
  const filteredReadings = useMemo(() => readings.filter((reading) => {
    const date = new Date(reading.timestamp)
    const day = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    const from = filters.from ? new Date(`${filters.from}T00:00:00`) : null
    const to = filters.to ? new Date(`${filters.to}T23:59:59`) : null
    return (!from || day >= from)
      && (!to || day <= to)
      && (filters.status === 'all' || classifyPostureStatus(reading.status) === filters.status)
  }).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)), [filters, readings])

  const exportCsv = () => {
    const rows = [['Fecha', 'Hora', 'Ángulo', 'Duración acumulada', 'Estado'], ...filteredReadings.map((reading) => {
      const date = new Date(reading.timestamp)
      return [date.toLocaleDateString('es'), date.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' }), `${reading.angle}°`, reading.duration === null || reading.duration === undefined ? 'Sin dato' : formatDuration(reading.duration), reading.status]
    })]
    const file = new Blob([rows.map((row) => row.join(',')).join('\n')], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(file)
    const link = document.createElement('a')
    link.href = url
    link.download = 'postureguard-historial.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <>
      <PageTitle eyebrow="TUS REGISTROS" title="Historial de postura" description="Revisá cómo evoluciona tu postura a lo largo del tiempo." action={<button className="secondary-button" type="button" onClick={exportCsv}><Download size={16} /> Exportar CSV</button>} />
      <DataState loading={loading} error={error} empty={!readings.length} onRetry={retry} />
      <PostureChart readings={filteredReadings} title="Evolución histórica" subtitle="Lecturas según los filtros seleccionados" />
      <Card className="history-card">
        <div className="card-heading history-heading"><div><h2>Registros</h2><p>{filteredReadings.length} lecturas encontradas</p></div></div>
        <HistoryFilters filters={filters} onChange={setFilters} />
        <HistoryTable readings={filteredReadings} />
      </Card>
    </>
  )
}