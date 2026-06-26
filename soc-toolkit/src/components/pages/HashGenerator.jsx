import { useMemo, useRef, useState } from 'react'
import { MD5, SHA1, SHA256, SHA512 } from 'crypto-js'

function HashGenerator() {
	const [text, setText] = useState('')
	const [copyMessage, setCopyMessage] = useState('')
	const copyTimerRef = useRef(null)

	const hashes = useMemo(() => {
		if (!text) {
			return null
		}

		return {
			md5: MD5(text).toString(),
			sha1: SHA1(text).toString(),
			sha256: SHA256(text).toString(),
			sha512: SHA512(text).toString(),
		}
	}, [text])

	const handleCopy = async (value, label) => {
		try {
			await navigator.clipboard.writeText(value)
			setCopyMessage(`${label} copiado al portapapeles`)
		} catch {
			setCopyMessage('No se pudo copiar el hash')
		}

		if (copyTimerRef.current) {
			window.clearTimeout(copyTimerRef.current)
		}

		copyTimerRef.current = window.setTimeout(() => setCopyMessage(''), 2000)
	}

	const handleClear = () => {
		setText('')
		setCopyMessage('')
	}

	const hashFields = [
		{ key: 'md5', label: 'MD5', value: hashes?.md5 ?? '' },
		{ key: 'sha1', label: 'SHA-1', value: hashes?.sha1 ?? '' },
		{ key: 'sha256', label: 'SHA-256', value: hashes?.sha256 ?? '' },
		{ key: 'sha512', label: 'SHA-512', value: hashes?.sha512 ?? '' },
	]

	return (
		<section className="panel hash-generator-panel" aria-label="Hash Generator">
			<div className="hash-generator-header">
				<div>
					<p className="section-label">Security Utility</p>
					<h3>Hash Generator</h3>
				</div>
				<button type="button" className="hash-clear-button" onClick={handleClear}>
					Limpiar contenido
				</button>
			</div>

			<p className="hash-generator-copy">
				Escribe o pega texto para generar hashes localmente en tu navegador sin
				enviarlo a ningun servidor.
			</p>

			<label className="hash-input-group">
				<span className="hash-input-label">Texto de entrada</span>
				<textarea
					className="hash-input"
					value={text}
					onChange={(event) => setText(event.target.value)}
					placeholder="Escribe o pega el texto para generar hashes"
					spellCheck="false"
					rows={6}
				/>
			</label>

			{!text ? (
				<p className="hash-empty-state">El texto esta vacio. Ingresa contenido para ver los hashes.</p>
			) : null}

			{copyMessage ? <p className="hash-feedback">{copyMessage}</p> : null}

			<div className="hash-grid">
				{hashFields.map((field) => (
					<div key={field.key} className="hash-card">
						<div className="hash-card-head">
							<span className="hash-label">{field.label}</span>
							<button
								type="button"
								className="hash-copy-button"
								onClick={() => handleCopy(field.value, field.label)}
								disabled={!field.value}
							>
								Copiar
							</button>
						</div>
						<input className="hash-output" type="text" value={field.value} readOnly />
					</div>
				))}
			</div>
		</section>
	)
}

export default HashGenerator
