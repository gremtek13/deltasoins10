import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import Login from './pages/Login'
import DossiersList from './pages/DossiersList'
import DossierDetail from './pages/DossierDetail'
import ClientHome from './pages/ClientHome'
import ClientUpload from './pages/ClientUpload'

function Gate() {
  const { session, role, loading } = useAuth()

  if (loading) return <div className="login-shell"><p className="muted">Chargement…</p></div>
  if (!session) return <Login />

  return (
    <Routes>
      <Route element={<Layout />}>
        {role === 'cabinet' && (
          <>
            <Route path="/dossiers" element={<DossiersList />} />
            <Route path="/dossiers/:id" element={<DossierDetail />} />
            <Route path="*" element={<Navigate to="/dossiers" replace />} />
          </>
        )}
        {role === 'client' && (
          <>
            <Route path="/accueil" element={<ClientHome />} />
            <Route path="/mes-pieces" element={<ClientUpload />} />
            <Route path="*" element={<Navigate to="/accueil" replace />} />
          </>
        )}
      </Route>
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Gate />
      </AuthProvider>
    </BrowserRouter>
  )
}
