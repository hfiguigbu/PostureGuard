import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Sidebar from './components/layout/Sidebar.jsx'
import Header from './components/layout/Header.jsx'
import BottomNavigation from './components/layout/BottomNavigation.jsx'

const Dashboard = lazy(() => import('./pages/Dashboard.jsx'))
const Notifications = lazy(() => import('./pages/Notifications.jsx'))
const History = lazy(() => import('./pages/History.jsx'))
const Settings = lazy(() => import('./pages/Settings.jsx'))

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Sidebar />
        <div className="app-main">
          <Header />
          <main className="page-content">
            <Suspense fallback={<div className="loading-state">Cargando vista…</div>}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/history" element={<History />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </main>
        </div>
        <BottomNavigation />
      </div>
    </BrowserRouter>
  )
}

export default App
