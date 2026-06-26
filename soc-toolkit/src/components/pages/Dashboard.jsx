const metrics = [
	{ label: 'Alertas criticas', value: '27', delta: '+8% en 24h', tone: 'critical' },
	{ label: 'Alertas altas', value: '63', delta: '+4% en 24h', tone: 'high' },
	{ label: 'Alertas medias', value: '142', delta: '-2% en 24h', tone: 'medium' },
	{ label: 'Equipos monitoreados', value: '118', delta: '+6 nuevos', tone: 'neutral' },
	{ label: 'Logs analizados', value: '1.84M', delta: 'Ultima hora', tone: 'neutral' },
]

const points = '20,164 120,136 220,144 320,110 420,104 520,86 620,72'

function Dashboard() {
	return (
		<div className="dashboard-view">
			<section className="panel panel-hero dashboard-hero">
				<p className="section-label">Threat Overview</p>
				<h3>Estado general del centro de operaciones</h3>
				<p>
					Resumen simulado del comportamiento de alertas y telemetria para validar
					la estructura visual del panel principal.
				</p>
			</section>

			<section className="stats-grid" aria-label="estadisticas SOC">
				{metrics.map((item) => (
					<article key={item.label} className={`panel stat-card ${item.tone}`}>
						<p className="section-label">Metric</p>
						<h3>{item.value}</h3>
						<p className="stat-title">{item.label}</p>
						<p className="stat-delta">{item.delta}</p>
					</article>
				))}
			</section>

			<section className="panel chart-panel" aria-label="grafico de actividad">
				<div className="chart-head">
					<div>
						<p className="section-label">Activity</p>
						<h3>Tendencia de alertas detectadas</h3>
					</div>
					<div className="legend">
						<span>
							<i className="dot critical"></i> Criticas
						</span>
						<span>
							<i className="dot high"></i> Altas
						</span>
						<span>
							<i className="dot medium"></i> Medias
						</span>
					</div>
				</div>

				<svg
					className="threat-chart"
					viewBox="0 0 640 210"
					role="img"
					aria-label="Grafico de tendencia de alertas"
				>
					<defs>
						<linearGradient id="alertGlow" x1="0" x2="0" y1="0" y2="1">
							<stop offset="0%" stopColor="rgba(75, 198, 205, 0.65)" />
							<stop offset="100%" stopColor="rgba(75, 198, 205, 0.02)" />
						</linearGradient>
					</defs>

					<g className="chart-grid">
						<line x1="20" y1="30" x2="620" y2="30" />
						<line x1="20" y1="74" x2="620" y2="74" />
						<line x1="20" y1="118" x2="620" y2="118" />
						<line x1="20" y1="162" x2="620" y2="162" />
						<line x1="20" y1="206" x2="620" y2="206" />
					</g>

					<polyline points={`20,206 ${points} 620,206`} className="chart-area" />
					<polyline points={points} className="chart-line" />

					<g className="chart-points">
						<circle cx="20" cy="164" r="5" />
						<circle cx="120" cy="136" r="5" />
						<circle cx="220" cy="144" r="5" />
						<circle cx="320" cy="110" r="5" />
						<circle cx="420" cy="104" r="5" />
						<circle cx="520" cy="86" r="5" />
						<circle cx="620" cy="72" r="5" />
					</g>
				</svg>

				<div className="chart-xlabels" aria-hidden="true">
					<span>00:00</span>
					<span>04:00</span>
					<span>08:00</span>
					<span>12:00</span>
					<span>16:00</span>
					<span>20:00</span>
					<span>24:00</span>
				</div>
			</section>
		</div>
	)
}

export default Dashboard
