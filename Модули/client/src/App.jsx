import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'
import { ConfigProvider } from './contexts/ConfigContext'
import Layout from './components/Layout'
import PrivateRoute from './components/PrivateRoute'
import AdminRoute from './components/AdminRoute'
import HomeRedirect from './components/HomeRedirect'

import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import ApplicationForm from './pages/ApplicationForm'
import Applications from './pages/Applications'
import AdminDashboard from './pages/AdminDashboard'
import AdminApplications from './pages/AdminApplications'

function App() {
  return (
    <ConfigProvider>
      <AuthProvider>
        <Router>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#2d1219',
                color: '#fff',
                borderRadius: '10px',
                fontSize: '14px',
              },
              success: {
                style: {
                  background: '#4a7c59',
                },
              },
              error: {
                style: {
                  background: '#dc2626',
                },
              },
            }}
          />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route element={<PrivateRoute />}>
              <Route element={<Layout />}>
                <Route path="/" element={<HomeRedirect />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/applications" element={<Applications />} />
                <Route path="/applications/new" element={<ApplicationForm />} />
                
                <Route element={<AdminRoute />}>
                  <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/admin/applications" element={<AdminApplications />} />
                </Route>
              </Route>
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ConfigProvider>
  )
}

export default App
