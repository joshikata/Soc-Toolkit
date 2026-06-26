import { useMemo, useState } from 'react'

const criteriaConfig = [
	{
		key: 'length',
		label: 'Mínimo 8 caracteres',
		test: (value) => value.length >= 8,
	},
	{
		key: 'uppercase',
		label: 'Contiene mayúsculas',
		test: (value) => /[A-Z]/.test(value),
	},
	{
		key: 'lowercase',
		label: 'Contiene minúsculas',
		test: (value) => /[a-z]/.test(value),
	},
	{
		key: 'number',
		label: 'Contiene números',
		test: (value) => /\d/.test(value),
	},
	{
		key: 'special',
		label: 'Contiene caracteres especiales',
		test: (value) => /[^A-Za-z0-9]/.test(value),
	},
]

const strengthLabels = ['Débil', 'Media', 'Fuerte', 'Muy fuerte']

function getStrength(score) {
	if (score <= 1) {
		return 'Débil'
	}

	if (score === 2 || score === 3) {
		return 'Media'
	}

	if (score === 4) {
		return 'Fuerte'
	}

	return 'Muy fuerte'
}

function getStrengthTone(score) {
	if (score <= 1) {
		return 'weak'
	}

	if (score === 2 || score === 3) {
		return 'medium'
	}

	if (score === 4) {
		return 'strong'
	}

	return 'very-strong'
}

function PasswordChecker() {
	const [password, setPassword] = useState('')

	const evaluation = useMemo(() => {
		const results = criteriaConfig.map((criterion) => ({
			...criterion,
			passed: criterion.test(password),
		}))

		const score = results.reduce((total, criterion) => total + (criterion.passed ? 1 : 0), 0)
		const percent = Math.round((score / criteriaConfig.length) * 100)
		const strength = getStrength(score)

		return {
			results,
			score,
			percent,
			strength,
			tone: getStrengthTone(score),
		}
	}, [password])

	return (
		<section className="panel password-checker-panel" aria-label="Password Checker">
			<div className="password-checker-header">
				<div>
					<p className="section-label">Security Utility</p>
					<h3>Password Checker</h3>
				</div>
				<div className={`password-strength-badge ${evaluation.tone}`} aria-live="polite">
					{evaluation.strength}
				</div>
			</div>

			<p className="password-checker-copy">
				Evalua la fortaleza de una contraseña en tiempo real sin guardarla ni enviarla
				a ningun servidor.
			</p>

			<label className="password-input-group">
				<span className="password-input-label">Escribe una contraseña</span>
				<input
					className="password-input"
					type="password"
					value={password}
					onChange={(event) => setPassword(event.target.value)}
					autoComplete="off"
					spellCheck="false"
					placeholder="Ingresa una contraseña para analizar"
					aria-describedby="password-checker-status"
				/>
			</label>

			<div className="password-meter" aria-label="barrita de progreso de fortaleza">
				<div
					className={`password-meter-fill ${evaluation.tone}`}
					style={{ width: `${evaluation.percent}%` }}
				/>
			</div>

			<div id="password-checker-status" className="password-summary">
				<div>
					<span className="password-summary-label">Fortaleza actual</span>
					<strong>{evaluation.strength}</strong>
				</div>
				<div>
					<span className="password-summary-label">Puntuacion</span>
					<strong>{evaluation.score}/5</strong>
				</div>
				<div>
					<span className="password-summary-label">Cobertura</span>
					<strong>{evaluation.percent}%</strong>
				</div>
			</div>

			<div className="password-criteria-grid">
				<div className="password-criteria-card">
					<p className="section-label">Cumplidos</p>
					<ul className="password-criteria-list" aria-label="criterios cumplidos">
						{evaluation.results
							.filter((criterion) => criterion.passed)
							.map((criterion) => (
								<li key={criterion.key} className="criterion-item passed">
									<span className="criterion-marker" aria-hidden="true">OK</span>
									{criterion.label}
								</li>
							))}
						{evaluation.results.every((criterion) => !criterion.passed) ? (
							<li className="criterion-empty">Aun no hay criterios cumplidos</li>
						) : null}
					</ul>
				</div>

				<div className="password-criteria-card">
					<p className="section-label">Pendientes</p>
					<ul className="password-criteria-list" aria-label="criterios no cumplidos">
						{evaluation.results
							.filter((criterion) => !criterion.passed)
							.map((criterion) => (
								<li key={criterion.key} className="criterion-item failed">
									<span className="criterion-marker" aria-hidden="true">NO</span>
									{criterion.label}
								</li>
							))}
						{evaluation.results.every((criterion) => criterion.passed) ? (
							<li className="criterion-empty">Todos los criterios estan cumplidos</li>
						) : null}
					</ul>
				</div>
			</div>

			<p className="password-disclaimer">
				La evaluacion se realiza localmente en el navegador. La contraseña no se almacena.
			</p>
		</section>
	)
}

export default PasswordChecker
