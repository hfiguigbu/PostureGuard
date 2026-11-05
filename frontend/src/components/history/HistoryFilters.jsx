export default function HistoryFilters({ filters, onChange }) {
  return (
    <div className="history-filters">
      <label>Desde<input type="date" value={filters.from} onChange={(event) => onChange({ ...filters, from: event.target.value })} /></label>
      <label>Hasta<input type="date" value={filters.to} onChange={(event) => onChange({ ...filters, to: event.target.value })} /></label>
      <label>Estado<select value={filters.status} onChange={(event) => onChange({ ...filters, status: event.target.value })}><option value="all">Todos los estados</option><option value="good">Buena postura</option><option value="warning">Advertencia</option><option value="bad">Mala postura</option></select></label>
      <button className="text-button" type="button" onClick={() => onChange({ from: '', to: '', status: 'all' })}>Limpiar filtros</button>
    </div>
  )
}