import { Activity, Check, MoveUpRight } from 'lucide-react'
import Card from '../common/Card.jsx'
import { classifyPostureStatus, formatDuration, getConfiguredPostureLimit } from '../../utils/posture.js'

export default function PostureStatus({ reading }) {
  const { seconds: durationLimit, error: limitError } = getConfiguredPostureLimit()
  const category = reading ? classifyPostureStatus(reading.status) : 'unknown'
  const isGood = category === 'good'
  const isBad = category === 'bad'
  const duration = reading?.duration
  const progress = duration !== null && duration !== undefined && durationLimit
    ? Math.min(100, Math.round((duration / durationLimit) * 100))
    : null
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
        <div className="status-description"><h2>{title}</h2><p>{reading ? 'Estado informado por el sensor.' : 'El estado aparecerá cuando la API devuelva una lectura.'}</p></div>
        <div className="status-angle"><strong>{reading ? `${reading.angle}°` : '—'}</strong><small>Ángulo actual</small></div>
      </div>
      <div className="posture-duration">
        <div className="duration-metric"><span>MALA POSTURA ACUMULADA</span><strong>{duration === null || duration === undefined ? 'Sin dato' : formatDuration(duration)}</strong></div>
        <div className="duration-metric"><span>LÍMITE CONFIGURADO</span><strong>{durationLimit ? formatDuration(durationLimit) : 'No configurado'}</strong></div>
      </div>
      <div className="duration-progress">
        <div className="duration-progress-label"><span>Progreso hacia el límite</span><strong>{progress === null ? '—' : `${progress}%`}</strong></div>
        {progress !== null && (
          <div className="duration-progress-track" role="progressbar" aria-label="Progreso hacia el límite de mala postura" aria-valuemin="0" aria-valuemax="100" aria-valuenow={progress}>
            <span style={{ width: `${progress}%` }} />
          </div>
        )}
        {limitError
          ? <small className="duration-note">{limitError}</small>
          : !durationLimit
            ? <small className="duration-note">Configurá VITE_MAX_BAD_POSTURE_SECONDS para habilitar la comparación.</small>
            : null}
      </div>
      <div className="status-footer"><span>Datos recibidos de la API</span><span>Última lectura · {timestamp}</span></div>
    </Card>
  )
}