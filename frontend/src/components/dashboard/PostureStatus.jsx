import { Check, MoveUpRight } from 'lucide-react'
import Card from '../common/Card.jsx'

export default function PostureStatus({ status }) {
  const isGood = status === 'good'

  return (
    <Card className={`posture-status ${isGood ? 'status-good' : 'status-alert'}`}>
      <div className="status-topline"><span className="status-label">ESTADO ACTUAL</span><span className="live-indicator"><i /> EN VIVO</span></div>
      <div className="status-content">
        <span className="status-icon">{isGood ? <Check size={25} /> : <MoveUpRight size={25} />}</span>
        <div><h2>{isGood ? 'Buena postura' : 'Revisá tu postura'}</h2><p>{isGood ? 'Tu espalda está en una posición saludable.' : 'La inclinación supera el límite recomendado.'}</p></div>
      </div>
      <div className="status-footer"><span><i className="status-dot" /> Sensor activo</span><span>Última lectura · hace 8 s</span></div>
    </Card>
  )
}