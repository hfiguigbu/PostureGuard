import { Area, AreaChart, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import Card from '../common/Card.jsx'

const formatTime = (timestamp) => new Intl.DateTimeFormat('es', { hour: '2-digit', minute: '2-digit' }).format(new Date(timestamp))

export default function PostureChart({ readings, title = 'Evolución de inclinación', subtitle = 'Ángulo de inclinación durante el día', threshold = 25 }) {
  const data = [...readings].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)).map((reading) => ({
    ...reading,
    time: formatTime(reading.timestamp),
  }))
  const angles = data.map((reading) => reading.angle)
  const minimumAngle = angles.reduce((minimum, angle) => Math.min(minimum, angle), 0)
  const maximumAngle = angles.reduce((maximum, angle) => Math.max(maximum, angle), 0)
  const yMinimum = Math.floor(minimumAngle / 10) * 10
  const yMaximum = minimumAngle < 0
    ? Math.ceil(maximumAngle / 10) * 10
    : Math.max(40, Math.ceil(maximumAngle / 10) * 10)
  const yTicks = Array.from({ length: (yMaximum - yMinimum) / 10 + 1 }, (_, index) => yMinimum + index * 10)

  return (
    <Card className="chart-card">
      <div className="card-heading"><div><h2>{title}</h2><p>{subtitle}</p></div><div className="chart-legend"><span><i className="legend-line" /> Inclinación</span><span><i className="legend-dash" /> Umbral</span></div></div>
      {data.length ? (
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 12, right: 12, left: -12, bottom: 0 }}>
              <defs><linearGradient id="angleFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#55d6a0" stopOpacity={0.22} /><stop offset="95%" stopColor="#55d6a0" stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid stroke="#26332f" strokeDasharray="3 5" vertical={false} />
              <XAxis dataKey="time" tick={{ fill: '#82918b', fontSize: 11 }} tickLine={false} axisLine={false} minTickGap={28} />
              <YAxis domain={[yMinimum, yMaximum]} ticks={yTicks} tick={{ fill: '#82918b', fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}°`} />
              <Tooltip contentStyle={{ background: '#18211e', border: '1px solid #34433d', borderRadius: 8, color: '#edf4f0', fontSize: 12 }} formatter={(value) => [`${value}°`, 'Inclinación']} labelStyle={{ color: '#9eaaa5', marginBottom: 4 }} />
              <ReferenceLine y={threshold} stroke="#d2915d" strokeDasharray="5 5" />
              <Area type="monotone" dataKey="angle" stroke="#55d6a0" strokeWidth={2.4} fill="url(#angleFill)" activeDot={{ r: 4, fill: '#55d6a0', stroke: '#17221d', strokeWidth: 2 }} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : <div className="chart-empty">Todavía no hay lecturas para mostrar.</div>}
      <div className="chart-footnote"><span className="chart-footnote-dot" /> Umbral recomendado <strong>{threshold}°</strong></div>
    </Card>
  )
}