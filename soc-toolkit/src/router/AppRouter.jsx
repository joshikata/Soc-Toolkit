import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import App from '../App.jsx'
import Dashboard from '../components/pages/Dashboard'
import FileIntegrity from '../components/pages/FileIntegrity'
import HashGenerator from '../components/pages/HashGenerator'
import IOCScanner from '../components/pages/IOCSScanner'
import LogAnalyzer from '../components/pages/LogAnalyzer'
import PasswordChecker from '../components/pages/PasswordChecker'
import PortScanner from '../components/pages/PortScanner'
import Settings from '../components/pages/Settings'

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Dashboard />} />
          <Route path="password-checker" element={<PasswordChecker />} />
          <Route path="hash-generator" element={<HashGenerator />} />
          <Route path="port-scanner" element={<PortScanner />} />
          <Route path="file-integrity" element={<FileIntegrity />} />
          <Route path="log-analyzer" element={<LogAnalyzer />} />
          <Route path="ioc-scanner" element={<IOCScanner />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter