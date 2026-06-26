import { useEffect, useMemo, useState } from 'react'

const SETTINGS_KEY = 'soc-toolkit-settings-v1'

const defaultSettings = {
  notificationsEnabled: true,
  notificationLevel: 'high',
  autoRefreshEnabled: true,
  autoRefreshInterval: 30,
  retentionDays: 30,
  exportFormat: 'json',
  compactTables: false,
  obfuscateSensitiveData: true,
}

function loadSettings() {
  try {
    const savedValue = window.localStorage.getItem(SETTINGS_KEY)

    if (!savedValue) {
      return defaultSettings
    }

    const parsed = JSON.parse(savedValue)
    return {
      ...defaultSettings,
      ...parsed,
    }
  } catch {
    return defaultSettings
  }
}

function Settings() {
  const [settings, setSettings] = useState(() => loadSettings())
  const [statusMessage, setStatusMessage] = useState(
    'Configuracion local lista. Los cambios se guardan en este navegador.'
  )

  useEffect(() => {
    window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
  }, [settings])

  const summary = useMemo(() => {
    const enabledFeatures = [
      settings.notificationsEnabled,
      settings.autoRefreshEnabled,
      settings.obfuscateSensitiveData,
    ].filter(Boolean).length

    return {
      enabledFeatures,
      profile: settings.compactTables ? 'Analista tecnico' : 'Monitoreo estandar',
    }
  }, [settings])

  const updateSetting = (key, value) => {
    setSettings((previous) => ({
      ...previous,
      [key]: value,
    }))
    setStatusMessage('Cambios guardados localmente.')
  }

  const handleReset = () => {
    setSettings(defaultSettings)
    setStatusMessage('Configuracion restablecida a valores predeterminados.')
  }

  return (
    <section className="panel settings-panel" aria-label="Settings">
      <div className="settings-header">
        <div>
          <p className="section-label">Workspace Configuration</p>
          <h3>Settings</h3>
        </div>
        <div className="settings-summary-chips" aria-label="resumen de configuracion">
          <span className="chip">Funciones activas: {summary.enabledFeatures}/3</span>
          <span className="chip">Perfil: {summary.profile}</span>
        </div>
      </div>

      <p className="settings-copy">
        Gestiona ajustes de la consola SOC en modo local. No hay llamadas a backend ni APIs.
      </p>

      <div className="settings-grid" aria-label="configuracion principal">
        <div className="settings-card">
          <p className="section-label">Alerting</p>
          <h4>Alertas y notificaciones</h4>

          <label className="settings-toggle-row">
            <input
              type="checkbox"
              checked={settings.notificationsEnabled}
              onChange={(event) =>
                updateSetting('notificationsEnabled', event.target.checked)
              }
            />
            <span>Habilitar notificaciones internas</span>
          </label>

          <label className="settings-field">
            <span className="settings-label">Nivel minimo de alerta</span>
            <select
              className="settings-select"
              value={settings.notificationLevel}
              onChange={(event) =>
                updateSetting('notificationLevel', event.target.value)
              }
            >
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </label>
        </div>

        <div className="settings-card">
          <p className="section-label">Monitoring</p>
          <h4>Telemetria y retencion</h4>

          <label className="settings-toggle-row">
            <input
              type="checkbox"
              checked={settings.autoRefreshEnabled}
              onChange={(event) => updateSetting('autoRefreshEnabled', event.target.checked)}
            />
            <span>Auto-refresh de widgets</span>
          </label>

          <label className="settings-field">
            <span className="settings-label">Intervalo de refresco (segundos)</span>
            <input
              className="settings-input"
              type="number"
              min="5"
              max="300"
              value={settings.autoRefreshInterval}
              onChange={(event) =>
                updateSetting(
                  'autoRefreshInterval',
                  Math.max(5, Math.min(300, Number(event.target.value) || 5))
                )
              }
            />
          </label>

          <label className="settings-field">
            <span className="settings-label">Retencion de eventos (dias)</span>
            <input
              className="settings-input"
              type="number"
              min="1"
              max="365"
              value={settings.retentionDays}
              onChange={(event) =>
                updateSetting(
                  'retentionDays',
                  Math.max(1, Math.min(365, Number(event.target.value) || 1))
                )
              }
            />
          </label>
        </div>

        <div className="settings-card">
          <p className="section-label">Data Handling</p>
          <h4>Formato y privacidad</h4>

          <label className="settings-field">
            <span className="settings-label">Formato de exportacion</span>
            <select
              className="settings-select"
              value={settings.exportFormat}
              onChange={(event) => updateSetting('exportFormat', event.target.value)}
            >
              <option value="json">JSON</option>
              <option value="csv">CSV</option>
              <option value="txt">TXT</option>
            </select>
          </label>

          <label className="settings-toggle-row">
            <input
              type="checkbox"
              checked={settings.compactTables}
              onChange={(event) => updateSetting('compactTables', event.target.checked)}
            />
            <span>Usar tablas compactas</span>
          </label>

          <label className="settings-toggle-row">
            <input
              type="checkbox"
              checked={settings.obfuscateSensitiveData}
              onChange={(event) =>
                updateSetting('obfuscateSensitiveData', event.target.checked)
              }
            />
            <span>Ofuscar datos sensibles en vistas</span>
          </label>
        </div>
      </div>

      <div className="settings-footer">
        <button type="button" className="settings-reset-button" onClick={handleReset}>
          Restablecer valores
        </button>
        <p className="settings-status">{statusMessage}</p>
      </div>
    </section>
  )
}

export default Settings
