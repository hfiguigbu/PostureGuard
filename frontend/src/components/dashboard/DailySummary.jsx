import { Timer } from 'lucide-react'
import Card from '../common/Card.jsx'

export default function DailySummary({ minutes }) {
  return (
    <Card className="daily-summary">
      <div className="summary-icon"><Timer size={18} /></div>
      <p className="metric-label">TIEMPO EN MALA POSTURA</p>
      <div className="summary-value">{minutes}<span>min</span></div>
      <p className="summary-note"><span className="trend-down">− 12%</span> vs. promedio semanal</p>
      <div className="summary-progress"><span style={{ width: `${Math.min(minutes / 60 * 100, 100)}%` }} /></div>
      <div className="summary-scale"><span>0 min</span><span>Meta diaria 60 min</span></div>
    </Card>
  )
}