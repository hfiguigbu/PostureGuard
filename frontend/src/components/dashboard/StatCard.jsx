import Card from '../common/Card.jsx'

export default function StatCard({ label, value, suffix, note, icon: Icon, tone = 'green' }) {
  return (
    <Card className="stat-card">
      <div className="stat-card-top"><span className="metric-label">{label}</span><span className={`stat-icon ${tone}`}>{Icon && <Icon size={17} />}</span></div>
      <div className="stat-value">{value}{suffix && <span>{suffix}</span>}</div>
      {note && <p className="stat-note">{note}</p>}
    </Card>
  )
}