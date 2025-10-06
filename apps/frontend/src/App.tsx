import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { ColorProvider } from '@/contexts/ColorContext'
import { ToastProvider } from '@/contexts/ToastContext'
import { ToastContainer } from '@/components/ToastContainer'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { useNProgress } from '@/hooks/useNProgress'
import { AuthLayout } from '@/layouts/AuthLayout'
import Landing from "@/pages/landing/Landing"
import { Auth } from "@/pages/auth/Auth"
import { Feed } from "@/pages/app/Feed"
import { Settings } from "@/pages/app/Settings/Settings"
import { Profile } from "@/pages/app/Profile/Profile"
import { queryClient } from '@/utils/query-client'
import { AppLayout } from '@/layouts/AppLayout'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ColorProvider>
          <ToastProvider>
              <Router>
                <AppRoutes />
                <ToastContainer />
              </Router>
          </ToastProvider>
        </ColorProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

function AppRoutes() {
  useNProgress()
  
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/auth" element={<Navigate to="/auth/sign-in" replace />} />
      <Route 
        path="/auth/sign-in" 
        element={
          <AuthLayout 
            title="Sign In" 
            description="Access your Strak Social account"
          >
            <Auth />
          </AuthLayout>
        } 
      />
      <Route 
        path="/auth/sign-up" 
        element={
          <AuthLayout 
            title="Create Account" 
            description="Join Strak Social and connect with the world"
          >
            <Auth />
          </AuthLayout>
        } 
      />
        
      <Route 
        path="/feed" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <Feed />
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/settings" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <Settings />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <Profile />
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/settings/:tab" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <Settings />
            </AppLayout>
          </ProtectedRoute>
        } 
      />
           
      <Route path="/app/*" element={<Navigate to="/feed" replace />} />
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App