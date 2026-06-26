import { useRef, useState } from 'react'

function formatBytes(bytes) {
	if (!bytes) {
		return '0 B'
	}

	const units = ['B', 'KB', 'MB', 'GB', 'TB']
	let size = bytes
	let unitIndex = 0

	while (size >= 1024 && unitIndex < units.length - 1) {
		size /= 1024
		unitIndex += 1
	}

	return `${size.toFixed(size >= 10 || unitIndex === 0 ? 0 : 2)} ${units[unitIndex]}`
}

function toHex(buffer) {
	return Array.from(new Uint8Array(buffer))
		.map((byte) => byte.toString(16).padStart(2, '0'))
		.join('')
}

function FileIntegrity() {
	const [selectedFile, setSelectedFile] = useState(null)
	const [sha256Hash, setSha256Hash] = useState('')
	const [statusMessage, setStatusMessage] = useState('')
	const [isHashing, setIsHashing] = useState(false)
	const [copyMessage, setCopyMessage] = useState('')
	const inputRef = useRef(null)
	const hashRequestRef = useRef(0)
	const copyTimerRef = useRef(null)

	const handleFileChange = async (event) => {
		const file = event.target.files?.[0] ?? null
		hashRequestRef.current += 1
		const requestId = hashRequestRef.current

		setSelectedFile(file)
		setCopyMessage('')

		if (copyTimerRef.current) {
			window.clearTimeout(copyTimerRef.current)
		}

		if (!file) {
			setSha256Hash('')
			setStatusMessage('No hay ningun archivo seleccionado.')
			setIsHashing(false)
			return
		}

		setIsHashing(true)
		setStatusMessage('Calculando hash SHA-256...')
		setSha256Hash('')

		try {
			const arrayBuffer = await file.arrayBuffer()
			const digest = await crypto.subtle.digest('SHA-256', arrayBuffer)

			if (hashRequestRef.current !== requestId) {
				return
			}

			setSha256Hash(toHex(digest))
			setStatusMessage('Hash calculado correctamente.')
		} catch {
			if (hashRequestRef.current === requestId) {
				setSha256Hash('')
				setStatusMessage('No fue posible calcular el hash del archivo.')
			}
		} finally {
			if (hashRequestRef.current === requestId) {
				setIsHashing(false)
			}
		}
	}

	const handleCopy = async () => {
		if (!sha256Hash) {
			return
		}

		try {
			await navigator.clipboard.writeText(sha256Hash)
			setCopyMessage('Hash copiado al portapapeles')
		} catch {
			setCopyMessage('No se pudo copiar el hash')
		}

		if (copyTimerRef.current) {
			window.clearTimeout(copyTimerRef.current)
		}

		copyTimerRef.current = window.setTimeout(() => setCopyMessage(''), 2000)
	}

	const handleClear = () => {
		hashRequestRef.current += 1
		setSelectedFile(null)
		setSha256Hash('')
		setStatusMessage('No hay ningun archivo seleccionado.')
		setIsHashing(false)
		setCopyMessage('')

		if (copyTimerRef.current) {
			window.clearTimeout(copyTimerRef.current)
		}

		if (inputRef.current) {
			inputRef.current.value = ''
		}
	}

	return (
		<section className="panel file-integrity-panel" aria-label="File Integrity Checker">
			<div className="file-integrity-header">
				<div>
					<p className="section-label">Security Utility</p>
					<h3>File Integrity Checker</h3>
				</div>
				<button type="button" className="file-integrity-clear-button" onClick={handleClear}>
					Limpiar seleccion
				</button>
			</div>

			<p className="file-integrity-copy">
				Selecciona un archivo para revisar sus metadatos y calcular localmente el hash
				SHA-256 usando la Web Crypto API.
			</p>

			<label className="file-input-group">
				<span className="file-input-label">Seleccionar archivo</span>
				<input ref={inputRef} className="file-input" type="file" onChange={handleFileChange} />
			</label>

			{!selectedFile ? (
				<p className="file-empty-state">No hay ningun archivo seleccionado.</p>
			) : null}

			{selectedFile ? (
				<div className="file-info-grid" aria-label="metadatos del archivo">
					<div className="file-info-card">
						<span className="file-info-label">Nombre del archivo</span>
						<strong>{selectedFile.name}</strong>
					</div>
					<div className="file-info-card">
						<span className="file-info-label">Tamaño</span>
						<strong>{formatBytes(selectedFile.size)}</strong>
					</div>
					<div className="file-info-card">
						<span className="file-info-label">Tipo</span>
						<strong>{selectedFile.type || 'Desconocido'}</strong>
					</div>
					<div className="file-info-card">
						<span className="file-info-label">Fecha de modificacion</span>
						<strong>
							{selectedFile.lastModified
								? new Date(selectedFile.lastModified).toLocaleString()
								: 'No disponible'}
						</strong>
					</div>
				</div>
			) : null}

			<div className="file-hash-card">
				<div className="file-hash-card-head">
					<div>
						<p className="section-label">SHA-256</p>
						<h4>Hash generado</h4>
					</div>
					<button
						type="button"
						className="file-copy-button"
						onClick={handleCopy}
						disabled={!sha256Hash}
					>
						Copiar hash
					</button>
				</div>

				<input className="file-hash-output" type="text" value={sha256Hash} readOnly placeholder={isHashing ? 'Calculando hash...' : 'Selecciona un archivo para generar el hash'} />
				{copyMessage ? <p className="file-feedback">{copyMessage}</p> : null}
				<p className="file-status">{statusMessage}</p>
			</div>
		</section>
	)
}

export default FileIntegrity
