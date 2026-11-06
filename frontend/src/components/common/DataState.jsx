export default function DataState({ loading, error, empty, onRetry }) {
  if (loading) {
    return <div className="data-notice loading-notice" role="status"><span className="loading-spinner" /> Consultando datos del servidor…</div>
  }

  if (error) {
    return (
      <div className="data-notice data-error" role="alert">
        <span>{error}</span>
        <button className="secondary-button" type="button" onClick={onRetry}>Reintentar</button>
      </div>
    )
  }

  if (empty) {
    return <div className="data-notice" role="status">Todavía no hay registros disponibles.</div>
  }

  return null
}
