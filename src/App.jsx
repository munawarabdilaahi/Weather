import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import { ErrorBoundary } from './components/ErrorBoundary'
import { PageLayout } from './components/PageLayout'
import { Spinner } from './components/Spinner'
import { ToastProvider } from './components/Toast'

const Dashboard = lazy(() => import('./pages/Dashboard'))
const MapsPage = lazy(() => import('./pages/MapsPage'))
const SettingsPage = lazy(() => import('./pages/SettingsPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

function RouteFallback() {
  return (
    <div className="flex items-center justify-center p-16">
      <Spinner className="w-8 h-8 text-primary" />
    </div>
  )
}

export default function App() {
  return (
    <ToastProvider>
      <AppProvider>
        <ErrorBoundary>
          <PageLayout>
            <Suspense fallback={<RouteFallback />}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/maps" element={<MapsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </PageLayout>
        </ErrorBoundary>
      </AppProvider>
    </ToastProvider>
  )
}
