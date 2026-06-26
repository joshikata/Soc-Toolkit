import { useMemo, useState } from 'react'

const DEFAULT_LOGS = `2026-06-26 09:15:31 INFO auth-service User login successful user=ana ip=10.0.0.12
2026-06-26 09:16:07 WARN edge-firewall Blocked outbound connection src=10.0.0.12 dst=198.51.100.22 port=4444
2026-06-26 09:17:40 ERROR db-cluster Query timeout on reporting shard host=db-02
2026-06-26 09:18:02 CRITICAL ids-engine Possible lateral movement detected src=10.0.0.44 dst=10.0.0.21
2026-06-26 09:19:18 INFO proxy-api Request completed status=200 path=/api/health`

const logLinePattern = /^(\S+\s+\S+)\s+(INFO|WARN|ERROR|CRITICAL)\s+(\S+)\s+(.+)$/
const ipPattern = /\b(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\b/g

function parseLogLine(line, index) {
	const cleanLine = line.trim()

	if (!cleanLine) {
		return null
	}

	const match = cleanLine.match(logLinePattern)

	if (!match) {
		return {
			id: `raw-${index}`,
			timestamp: 'N/A',
			severity: 'UNKNOWN',
			source: 'N/A',
			message: cleanLine,
			ips: [],
			status: 'No estructurado',
		}
	}

	const [, timestamp, severity, source, message] = match
	const ips = message.match(ipPattern) ?? []

	return {
		id: `${timestamp}-${source}-${index}`,
		timestamp,
		severity,
		source,
		message,
		ips,
		status: 'Valido',
	}
}

function LogAnalyzer() {
	const [logsInput, setLogsInput] = useState(DEFAULT_LOGS)
	const [rows, setRows] = useState([])
	const [severityFilter, setSeverityFilter] = useState('ALL')
	const [statusMessage, setStatusMessage] = useState(
		'Pega logs y ejecuta el analisis local para clasificar eventos.'
	)

	const summary = useMemo(() => {
		const info = rows.filter((row) => row.severity === 'INFO').length
		const warn = rows.filter((row) => row.severity === 'WARN').length
		const error = rows.filter((row) => row.severity === 'ERROR').length
		const critical = rows.filter((row) => row.severity === 'CRITICAL').length
		const unstructured = rows.filter((row) => row.status === 'No estructurado').length
		return { info, warn, error, critical, unstructured }
	}, [rows])

	const filteredRows = useMemo(() => {
		if (severityFilter === 'ALL') {
			return rows
		}

		if (severityFilter === 'UNKNOWN') {
			return rows.filter((row) => row.severity === 'UNKNOWN')
		}

		return rows.filter((row) => row.severity === severityFilter)
	}, [rows, severityFilter])

	const handleAnalyze = () => {
		const lines = logsInput
			.split(/\r?\n/)
			.map((line) => line.trim())
			.filter(Boolean)

		if (lines.length === 0) {
			setRows([])
			setStatusMessage('No hay lineas para analizar.')
			return
		}

		const parsedRows = lines
			.map((line, index) => parseLogLine(line, index))
			.filter(Boolean)

		setRows(parsedRows)
		setStatusMessage(
			`Analisis local completado: ${parsedRows.length} lineas procesadas sin uso de APIs.`
		)
	}

	const handleClear = () => {
		setLogsInput('')
		setRows([])
		setSeverityFilter('ALL')
		setStatusMessage('Pega logs y ejecuta el analisis local para clasificar eventos.')
	}

	const handleLoadSample = () => {
		setLogsInput(DEFAULT_LOGS)
		setStatusMessage('Dataset de ejemplo cargado. Ejecuta Analizar para ver resultados.')
	}

	return (
		<section className="panel log-analyzer-panel" aria-label="Log Analyzer">
			<div className="log-analyzer-header">
				<div>
					<p className="section-label">Monitoring Utility</p>
					<h3>Log Analyzer</h3>
				</div>
				<div className="log-summary-chips" aria-label="resumen de severidad">
					<span className="chip">Critical: {summary.critical}</span>
					<span className="chip">Error: {summary.error}</span>
					<span className="chip">Warn: {summary.warn}</span>
					<span className="chip">Info: {summary.info}</span>
				</div>
			</div>

			<p className="log-analyzer-copy">
				Analiza eventos en el navegador para priorizar incidentes. Todo el procesamiento es local.
			</p>

			<label className="log-input-group">
				<span className="log-input-label">Entrada de logs</span>
				<textarea
					className="log-input"
					value={logsInput}
					onChange={(event) => setLogsInput(event.target.value)}
					placeholder={
						'Formato sugerido:\n2026-06-26 09:15:31 INFO auth-service Mensaje...\nUna linea por evento'
					}
					rows={8}
					spellCheck="false"
				/>
			</label>

			<div className="log-actions">
				<button type="button" className="log-primary-button" onClick={handleAnalyze}>
					Analizar
				</button>
				<button type="button" className="log-secondary-button" onClick={handleLoadSample}>
					Cargar ejemplo
				</button>
				<button type="button" className="log-secondary-button" onClick={handleClear}>
					Limpiar
				</button>
			</div>

			<div className="log-toolbar">
				<label className="log-filter-group">
					<span className="log-filter-label">Filtro de severidad</span>
					<select
						className="log-select"
						value={severityFilter}
						onChange={(event) => setSeverityFilter(event.target.value)}
					>
						<option value="ALL">Todas</option>
						<option value="CRITICAL">Critical</option>
						<option value="ERROR">Error</option>
						<option value="WARN">Warn</option>
						<option value="INFO">Info</option>
						<option value="UNKNOWN">No estructurado</option>
					</select>
				</label>

				<span className="chip">No estructurado: {summary.unstructured}</span>
				<span className="chip">Mostrando: {filteredRows.length}</span>
			</div>

			<p className="log-status">{statusMessage}</p>

			{filteredRows.length > 0 ? (
				<div className="log-table-wrap">
					<table className="log-table">
						<thead>
							<tr>
								<th>Timestamp</th>
								<th>Severidad</th>
								<th>Origen</th>
								<th>Mensaje</th>
								<th>IP(s)</th>
							</tr>
						</thead>
						<tbody>
							{filteredRows.map((row) => (
								<tr key={row.id}>
									<td>{row.timestamp}</td>
									<td>
										<span className={`log-severity-pill ${row.severity.toLowerCase()}`}>
											{row.severity}
										</span>
									</td>
									<td>{row.source}</td>
									<td>{row.message}</td>
									<td>{row.ips.length > 0 ? row.ips.join(', ') : '-'}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			) : (
				<div className="log-empty-state">
					Sin resultados para mostrar. Ejecuta Analizar o ajusta el filtro de severidad.
				</div>
			)}
		</section>
	)
}

export default LogAnalyzer
