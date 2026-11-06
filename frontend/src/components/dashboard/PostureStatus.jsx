import { Activity, Check, MoveUpRight } from 'lucide-react'
import Card from '../common/Card.jsx'
import { classifyPostureStatus } from '../../utils/posture.js'

export default function PostureStatus({ reading }) {
  const category = reading ? classifyPostureStatus(reading.status) : 'unknown'
  const isGood = category === 'good'
  const isBad = category === 'bad'
  const title = !reading
    ? 'Sin lecturas'
    : isGood
      ? 'Buena postura'
      : isBad
        ? 'Revisá tu postura'
        : reading.status || 'Estado no informado'
  const timestamp = reading
    ? new Intl.DateTimeFormat('es', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(reading.timestamp))
    : 'Sin lecturas'

  return (
    <Card className={`posture-status ${isGood ? 'status-good' : isBad ? 'status-alert' : 'status-neutral'}`}>
      <div className="status-topline"><span className="status-label">ESTADO SEGÚN ÚLTIMA LECTURA</span></div>
      <div className="status-content">
        <span className="status-icon">{isGood ? <Check size={25} /> : isBad ? <MoveUpRight size={25} /> : <Activity size={25} />}</span>
        <div><h2>{title}</h2><p>{reading ? 'Estado informado por el sensor.' : 'El estado aparecerá cuando la API devuelva una lectura.'}</p></div>
      </div>
      <div className="status-footer"><span>Datos recibidos de la API</span><span>Última lectura · {timestamp}</span></div>
    </Card>
  )
}