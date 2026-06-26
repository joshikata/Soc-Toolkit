import './App.css'
import { NavLink, Outlet, useLocation } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/password-checker', label: 'Password Checker' },
  { to: '/hash-generator', label: 'Hash Generator' },
  { to: '/port-scanner', label: 'Port Scanner' },
  { to: '/file-integrity', label: 'File Integrity' },
  { to: '/log-analyzer', label: 'Log Analyzer' },
  { to: '/ioc-scanner', label: 'IOC Scanner' },
  { to: '/report-generator', label: 'Report Generator' },
  { to: '/settings', label: 'Settings' },
]

const routeTitles = {
  '/': 'Dashboard',
  '/password-checker': 'Password Checker',
  '/hash-generator': 'Hash Generator',
  '/port-scanner': 'Port Scanner',
  '/file-integrity': 'File Integrity',
  '/log-analyzer': 'Log Analyzer',
  '/ioc-scanner': 'IOC Scanner',
  '/report-generator': 'Report Generator',
  '/settings': 'Settings',
}

function App() {
  const { pathname } = useLocation()

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
            {navItems.map((item) => (
              <li className="menu-item" key={item.label}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    isActive ? 'menu-link is-active' : 'menu-link'
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
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
            <h2>{routeTitles[pathname] ?? 'SOC Toolkit'}</h2>
          </div>
          <div className="topbar-metrics" aria-label="estado de sistema">
            <span className="chip">Threat Feed: Online</span>
            <span className="chip">Nodes: 03</span>
          </div>
        </header>

        <main className="main-content" aria-label="contenido principal">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default App
