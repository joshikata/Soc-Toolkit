import { useMemo, useState } from 'react'

const indicatorPatterns = [
  {
    type: 'URL',
    test: (value) => /^https?:\/\//i.test(value),
    confidence: 'Alta',
    notes: 'Coincide con un esquema web valido.',
  },
  {
    type: 'IPv4',
    test: (value) => /^(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$/.test(value),
    confidence: 'Alta',
    notes: 'Direccion IPv4 valida.',
  },
  {
    type: 'Email',
    test: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    confidence: 'Media',
    notes: 'Posible IOC relacionado con correo.',
  },
  {
    type: 'SHA-256',
    test: (value) => /^[A-Fa-f0-9]{64}$/.test(value),
    confidence: 'Alta',
    notes: 'Hash hexadecimal de 64 caracteres.',
  },
  {
    type: 'SHA-1',
    test: (value) => /^[A-Fa-f0-9]{40}$/.test(value),
    confidence: 'Media',
    notes: 'Hash hexadecimal de 40 caracteres.',
  },
  {
    type: 'MD5',
    test: (value) => /^[A-Fa-f0-9]{32}$/.test(value),
    confidence: 'Media',
    notes: 'Hash hexadecimal de 32 caracteres.',
  },
  {
    type: 'Dominio',
    test: (value) => /^[a-z0-9.-]+\.[a-z]{2,}$/i.test(value),
    confidence: 'Media',
    notes: 'Nombre de dominio potencialmente malicioso.',
  },
]

function classifyIndicator(value) {
	const matchedPattern = indicatorPatterns.find((pattern) => pattern.test(value))

	if (matchedPattern) {
		return {
			type: matchedPattern.type,
			status: 'Detectado',
			confidence: matchedPattern.confidence,
			notes: matchedPattern.notes,
		}
	}

	return {
		type: 'Desconocido',
		status: 'Revisar',
		confidence: 'Baja',
		notes: 'No coincide con un formato IOC comun.',
	}
}

function IOCScanner() {
	const [inputValue, setInputValue] = useState('')
	const [rows, setRows] = useState([])
	const [statusMessage, setStatusMessage] = useState('Pega indicadores para analizarlos localmente.')

	const handleAnalyze = () => {
		const normalizedLines = inputValue
			.split(/\r?\n/)
			.map((line) => line.trim())
			.filter(Boolean)

		if (normalizedLines.length === 0) {
			setRows([])
			setStatusMessage('No hay indicadores para analizar.')
			return
		}

		const parsedRows = normalizedLines.map((indicator, index) => ({
			id: `${indicator}-${index}`,
			indicator,
			...classifyIndicator(indicator),
		}))

		setRows(parsedRows)
		setStatusMessage(`Se analizaron ${parsedRows.length} indicadores de forma local.`)
	}

	const handleClear = () => {
		setInputValue('')
		setRows([])
		setStatusMessage('Pega indicadores para analizarlos localmente.')
	}

	const hasRows = rows.length > 0

	const summary = useMemo(() => {
		const detected = rows.filter((row) => row.status === 'Detectado').length
		const review = rows.filter((row) => row.status === 'Revisar').length
		return { detected, review }
	}, [rows])

	return (
		<section className="panel ioc-scanner-panel" aria-label="IOC Scanner">
			<div className="ioc-scanner-header">
				<div>
					<p className="section-label">Threat Intelligence</p>
					<h3>IOC Scanner</h3>
				</div>
				<div className="ioc-summary-chips" aria-label="resumen de analisis">
					<span className="chip">Detectados: {summary.detected}</span>
					<span className="chip">Por revisar: {summary.review}</span>
				</div>
			</div>

			<p className="ioc-scanner-copy">
				Analiza indicadores de compromiso de forma visual y local. No usa APIs ni backend.
			</p>

			<label className="ioc-input-group">
				<span className="ioc-input-label">Indicadores IOC</span>
				<textarea
					className="ioc-input"
					value={inputValue}
					onChange={(event) => setInputValue(event.target.value)}
					placeholder={
						'Pega un IOC por linea\nhttps://example.com\n8.8.8.8\nmalicious-domain.com\n...'
					}
					spellCheck="false"
					rows={7}
				/>
			</label>

			<div className="ioc-actions">
				<button type="button" className="ioc-analyze-button" onClick={handleAnalyze}>
					Analizar
				</button>
				<button type="button" className="ioc-clear-button" onClick={handleClear}>
					Limpiar
				</button>
			</div>

			<p className="ioc-status">{statusMessage}</p>

			{hasRows ? (
				<div className="ioc-table-wrap">
					<table className="ioc-table">
						<thead>
							<tr>
								<th>IOC</th>
								<th>Tipo</th>
								<th>Estado</th>
								<th>Confianza</th>
								<th>Observacion</th>
							</tr>
						</thead>
						<tbody>
							{rows.map((row) => (
								<tr key={row.id}>
									<td>{row.indicator}</td>
									<td>{row.type}</td>
									<td>
										<span className={`ioc-status-pill ${row.status === 'Detectado' ? 'detected' : 'review'}`}>
											{row.status}
										</span>
									</td>
									<td>{row.confidence}</td>
									<td>{row.notes}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			) : (
				<div className="ioc-empty-state">
					No hay resultados todavia. Agrega indicadores y presiona Analizar.
				</div>
			)}
		</section>
	)
}

export default IOCScanner
