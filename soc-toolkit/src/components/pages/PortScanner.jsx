import { useMemo, useState } from 'react'

const COMMON_PORTS = [21, 22, 25, 53, 80, 110, 123, 135, 139, 143, 389, 443, 445, 993, 995, 1433, 1521, 3306, 3389, 5432, 6379, 8080]

const SERVICE_BY_PORT = {
	21: 'FTP',
	22: 'SSH',
	25: 'SMTP',
	53: 'DNS',
	80: 'HTTP',
	110: 'POP3',
	123: 'NTP',
	135: 'RPC',
	139: 'NetBIOS',
	143: 'IMAP',
	389: 'LDAP',
	443: 'HTTPS',
	445: 'SMB',
	993: 'IMAPS',
	995: 'POP3S',
	1433: 'MSSQL',
	1521: 'Oracle',
	3306: 'MySQL',
	3389: 'RDP',
	5432: 'PostgreSQL',
	6379: 'Redis',
	8080: 'HTTP-Alt',
}

const DEFAULT_TARGET = '192.168.1.10'
const DEFAULT_PORT_SPEC = '20-25,53,80,110,135,139,143,443,445,3389,8080'

function parsePortSpec(input) {
	const trimmed = input.trim()

	if (!trimmed) {
		return []
	}

	const selected = new Set()
	const chunks = trimmed.split(',').map((part) => part.trim()).filter(Boolean)

	for (const chunk of chunks) {
		if (chunk.includes('-')) {
			const [rawStart, rawEnd] = chunk.split('-').map((value) => Number(value.trim()))

			if (!Number.isInteger(rawStart) || !Number.isInteger(rawEnd)) {
				throw new Error('El rango de puertos contiene valores no numericos.')
			}

			if (rawStart < 1 || rawEnd > 65535 || rawStart > rawEnd) {
				throw new Error('Rango invalido. Usa puertos entre 1 y 65535.')
			}

			for (let port = rawStart; port <= rawEnd; port += 1) {
				selected.add(port)
			}
			continue
		}

		const port = Number(chunk)

		if (!Number.isInteger(port) || port < 1 || port > 65535) {
			throw new Error('Lista invalida. Ingresa puertos validos entre 1 y 65535.')
		}

		selected.add(port)
	}

	return Array.from(selected).sort((a, b) => a - b)
}

function getSeed(target) {
	let hash = 0
	for (let index = 0; index < target.length; index += 1) {
		hash = (hash * 31 + target.charCodeAt(index)) % 9973
	}
	return hash
}

function evaluatePort(seed, port) {
	const service = SERVICE_BY_PORT[port] ?? 'Desconocido'
	const riskScore = (seed + port * 7) % 100

	if (riskScore >= 84) {
		return { state: 'Open', service, risk: 'Alto', details: 'Puerto expuesto con alta probabilidad de servicio activo.' }
	}

	if (riskScore >= 62) {
		return { state: 'Open', service, risk: 'Medio', details: 'Puerto abierto detectado en escaneo local simulado.' }
	}

	if (riskScore >= 45) {
		return { state: 'Filtered', service, risk: 'Bajo', details: 'Sin respuesta consistente. Posible filtrado por firewall.' }
	}

	return { state: 'Closed', service, risk: 'Bajo', details: 'Sin evidencia de servicio escuchando en este puerto.' }
}

function PortScanner() {
	const [target, setTarget] = useState(DEFAULT_TARGET)
	const [portSpec, setPortSpec] = useState(DEFAULT_PORT_SPEC)
	const [rows, setRows] = useState([])
	const [scanSummary, setScanSummary] = useState('Configura el objetivo y ejecuta un escaneo local simulado.')
	const [errorMessage, setErrorMessage] = useState('')

	const summary = useMemo(() => {
		const open = rows.filter((row) => row.state === 'Open').length
		const filtered = rows.filter((row) => row.state === 'Filtered').length
		const closed = rows.filter((row) => row.state === 'Closed').length
		return { open, filtered, closed, total: rows.length }
	}, [rows])

	const handleScan = () => {
		const normalizedTarget = target.trim()

		if (!normalizedTarget) {
			setErrorMessage('Ingresa una IP o hostname para iniciar el escaneo.')
			setRows([])
			setScanSummary('Configura el objetivo y ejecuta un escaneo local simulado.')
			return
		}

		try {
			const ports = parsePortSpec(portSpec)

			if (ports.length === 0) {
				setErrorMessage('Debes indicar al menos un puerto o rango.')
				setRows([])
				setScanSummary('Configura el objetivo y ejecuta un escaneo local simulado.')
				return
			}

			const seed = getSeed(normalizedTarget)
			const generatedRows = ports.map((port) => ({
				id: `${normalizedTarget}-${port}`,
				port,
				...evaluatePort(seed, port),
			}))

			setRows(generatedRows)
			setErrorMessage('')
			setScanSummary(`Escaneo local finalizado para ${normalizedTarget}. No se realizo trafico real de red.`)
		} catch (error) {
			setRows([])
			setErrorMessage(error.message)
			setScanSummary('Corrige la configuracion de puertos para continuar.')
		}
	}

	const handleLoadCommonPorts = () => {
		setPortSpec(COMMON_PORTS.join(','))
		setErrorMessage('')
	}

	const handleClear = () => {
		setTarget(DEFAULT_TARGET)
		setPortSpec(DEFAULT_PORT_SPEC)
		setRows([])
		setErrorMessage('')
		setScanSummary('Configura el objetivo y ejecuta un escaneo local simulado.')
	}

	return (
		<section className="panel port-scanner-panel" aria-label="Port Scanner">
			<div className="port-scanner-header">
				<div>
					<p className="section-label">Network Utility</p>
					<h3>Port Scanner</h3>
				</div>
				<div className="port-summary-chips" aria-label="resumen de puertos">
					<span className="chip">Open: {summary.open}</span>
					<span className="chip">Filtered: {summary.filtered}</span>
					<span className="chip">Closed: {summary.closed}</span>
				</div>
			</div>

			<p className="port-scanner-copy">
				Escaner visual y local para practicar triage de puertos sin usar backend ni APIs externas.
			</p>

			<div className="port-form-grid">
				<label className="port-input-group">
					<span className="port-input-label">Objetivo (IP o hostname)</span>
					<input
						className="port-input"
						type="text"
						value={target}
						onChange={(event) => setTarget(event.target.value)}
						placeholder="192.168.1.10 o servidor.local"
					/>
				</label>

				<label className="port-input-group">
					<span className="port-input-label">Puertos (ej: 22,80,443,1000-1010)</span>
					<input
						className="port-input"
						type="text"
						value={portSpec}
						onChange={(event) => setPortSpec(event.target.value)}
						placeholder="22,80,443 o 1-1024"
					/>
				</label>
			</div>

			<div className="port-actions">
				<button type="button" className="port-scan-button" onClick={handleScan}>
					Escanear
				</button>
				<button type="button" className="port-secondary-button" onClick={handleLoadCommonPorts}>
					Cargar puertos comunes
				</button>
				<button type="button" className="port-secondary-button" onClick={handleClear}>
					Restablecer
				</button>
			</div>

			<p className="port-status">{scanSummary}</p>
			{errorMessage ? <p className="port-error">{errorMessage}</p> : null}

			{summary.total > 0 ? (
				<div className="port-table-wrap">
					<table className="port-table">
						<thead>
							<tr>
								<th>Puerto</th>
								<th>Estado</th>
								<th>Servicio</th>
								<th>Riesgo</th>
								<th>Detalle</th>
							</tr>
						</thead>
						<tbody>
							{rows.map((row) => (
								<tr key={row.id}>
									<td>{row.port}</td>
									<td>
										<span className={`port-state-pill ${row.state.toLowerCase()}`}>
											{row.state}
										</span>
									</td>
									<td>{row.service}</td>
									<td>{row.risk}</td>
									<td>{row.details}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			) : (
				<div className="port-empty-state">
					Aun no hay resultados. Configura objetivo y puertos, luego presiona Escanear.
				</div>
			)}
		</section>
	)
}

export default PortScanner
