import './App.css'
import Dashboard from './components/pages/Dashboard'

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
          <Dashboard />
        </main>
      </div>
    </div>
  )
}

export default App
