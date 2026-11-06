import { Timer } from 'lucide-react'
import Card from '../common/Card.jsx'

export default function DailySummary({ totalRecords }) {
  return (
    <Card className="daily-summary">
      <div className="summary-icon"><Timer size={18} /></div>
      <p className="metric-label">REGISTROS TOTALES</p>
      <div className="summary-value">{totalRecords ?? '—'}</div>
      <p className="summary-note">Total informado por el resumen de usuarios.</p>
    </Card>
  )
}