import './App.css'

function App() {
  return (
    <div className="soc-shell">
      <aside className="sidebar">
        <div className="brand-block">
          <p className="eyebrow">Security Operations</p>
          <h1>SOC Toolkit</h1>
          <p className="brand-copy">Analisis y monitoreo centralizado</p>
        </div>

        <nav aria-label="SOC navigation">
          <p className="section-label">Workspace</p>
          <ul className="menu-list">
            <li className="menu-item is-active">Dashboard</li>
            <li className="menu-item">Log Analyzer</li>
            <li className="menu-item">IOC Scanner</li>
            <li className="menu-item">File Integrity</li>
            <li className="menu-item">Reports</li>
          </ul>
        </nav>

        <div className="sidebar-footer">
          <span className="status-dot" aria-hidden="true"></span>
          Entorno inicial listo
        </div>
      </aside>

      <div className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">Vista principal</p>
            <h2>Dashboard</h2>
          </div>
          <div className="topbar-metrics" aria-label="estado de sistema">
            <span className="chip">Threat Feed: Online</span>
            <span className="chip">Nodes: 03</span>
          </div>
        </header>

        <main className="main-content" aria-label="contenido principal">
          <section className="panel panel-hero">
            <p className="section-label">Panel Overview</p>
            <h3>Centro operativo para deteccion y respuesta</h3>
            <p>
              Estructura base del frontend lista para integrar modulos SOC en las
              siguientes fases.
            </p>
          </section>

          <section className="panel-grid" aria-label="secciones de trabajo">
            <article className="panel">
              <p className="section-label">Data Intake</p>
              <h3>Ingesta de logs</h3>
              <p>Conector visual para futuras fuentes de eventos y telemetria.</p>
            </article>

            <article className="panel">
              <p className="section-label">Detection</p>
              <h3>Analitica de amenazas</h3>
              <p>Espacio reservado para reglas, alertas y clasificacion.</p>
            </article>

            <article className="panel">
              <p className="section-label">Response</p>
              <h3>Acciones y reportes</h3>
              <p>Zona dedicada al flujo de respuesta y generacion de reportes.</p>
            </article>
          </section>
        </main>
      </div>
    </div>
  )
}

export default App
