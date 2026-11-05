import { useState } from 'react'
import { Check, RotateCcw } from 'lucide-react'
import Card from '../components/common/Card.jsx'
import PageTitle from '../components/common/PageTitle.jsx'

export default function Settings() {
  const [threshold, setThreshold] = useState(25)
  const [preferences, setPreferences] = useState({ alerts: true, reminders: true, improvements: false })
  const [saved, setSaved] = useState(false)

  const togglePreference = (key) => {
    setPreferences((current) => ({ ...current, [key]: !current[key] }))
    setSaved(false)
  }

  return (
    <>
      <PageTitle eyebrow="PERSONALIZÁ TU EXPERIENCIA" title="Configuración" description="Ajustá cómo PostureGuard acompaña tu jornada." />
      <div className="settings-layout">
        <Card className="settings-card">
          <div className="settings-section-heading"><span className="settings-number">01</span><div><h2>Detección de postura</h2><p>Definí cuándo una inclinación requiere atención.</p></div></div>
          <div className="threshold-setting"><div><label htmlFor="threshold">Umbral de inclinación</label><p>Te avisaremos cuando superes este ángulo.</p></div><output htmlFor="threshold">{threshold}°</output></div>
          <input id="threshold" className="threshold-slider" type="range" min="10" max="45" step="1" value={threshold} onChange={(event) => { setThreshold(Number(event.target.value)); setSaved(false) }} />
          <div className="range-labels"><span>10° · Sensible</span><span>45° · Flexible</span></div>
          <div className="threshold-preview"><span className="preview-dot" /> Las alertas se activarán por encima de <strong>{threshold}°</strong></div>
        </Card>
        <Card className="settings-card">
          <div className="settings-section-heading"><span className="settings-number">02</span><div><h2>Notificaciones</h2><p>Elegí qué avisos querés recibir.</p></div></div>
          <div className="preference-list">
            {[['alerts', 'Alertas de mala postura', 'Cuando mantengas una postura incorrecta.'], ['reminders', 'Recordatorios', 'Pausas y ajustes durante tu jornada.'], ['improvements', 'Progreso y mejoras', 'Celebrá tus rachas y buenos hábitos.']].map(([key, title, description]) => <label className="preference-row" key={key}><span><strong>{title}</strong><small>{description}</small></span><input type="checkbox" checked={preferences[key]} onChange={() => togglePreference(key)} /></label>)}
          </div>
        </Card>
      </div>
      <div className="settings-actions"><button className="text-button" type="button" onClick={() => { setThreshold(25); setPreferences({ alerts: true, reminders: true, improvements: false }); setSaved(false) }}><RotateCcw size={15} /> Restaurar valores</button><button className="primary-button" type="button" onClick={() => setSaved(true)}>{saved ? <Check size={16} /> : null}{saved ? 'Cambios guardados' : 'Guardar cambios'}</button></div>
    </>
  )
}