import { Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import { ErrorBoundary } from './components/ErrorBoundary'
import { PageLayout } from './components/PageLayout'
import Dashboard from './pages/Dashboard'
import MapsPage from './pages/MapsPage'
import SettingsPage from './pages/SettingsPage'
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  return (
    <AppProvider>
      <ErrorBoundary>
        <PageLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/maps" element={<MapsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </PageLayout>
      </ErrorBoundary>
    </AppProvider>
  )
}
