import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { ToastProvider } from '@/contexts/ToastContext'
import { ToastContainer } from '@/components/ToastContainer'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { useNProgress } from '@/hooks/useNProgress'
import Landing from "@/pages/landing/Landing"
import { Auth } from "@/pages/auth/Auth"
import { Dashboard } from "@/pages/app/Dashboard"
import { Profile } from "@/pages/app/Profile"
import { Account } from "@/pages/app/Account"
import { Appearance } from "@/pages/app/Appearance"
import { queryClient } from '@/lib/query-client'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ToastProvider>
          <Router>
            <AppRoutes />
            <ToastContainer />
          </Router>
        </ToastProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

function AppRoutes() {
  useNProgress()
  
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/auth/sign-in" element={<Auth />} />
      <Route path="/auth/sign-up" element={<Auth />} />
        
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
        
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } 
      />
        
      <Route 
        path="/profile/account" 
        element={
          <ProtectedRoute>
            <Account />
          </ProtectedRoute>
        } 
      />
        
      <Route 
        path="/profile/appearance" 
        element={
          <ProtectedRoute>
            <Appearance />
          </ProtectedRoute>
        } 
      />
        
      <Route path="/app/*" element={<Navigate to="/dashboard" replace />} />
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App