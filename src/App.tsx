import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { ToastProvider } from '@/contexts/ToastContext'
import { ToastContainer } from '@/components/ToastContainer'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { useNProgress } from '@/hooks/useNProgress'
import { AuthLayout02 } from '@/layouts/AuthLayout'
import { FeedLayout } from '@/layouts/FeedLayout'
import Landing from "@/pages/landing/Landing"
import { Auth } from "@/pages/auth/Auth"
import { SignIn } from "@/pages/auth/SignIn"
import { SignUp } from "@/pages/auth/SignUp"
import { Dashboard } from "@/pages/app/Dashboard"
import { Explore } from "@/pages/app/Explore"
import { Profile } from "@/pages/app/Profile"
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
      <Route 
        path="/auth/sign-in" 
        element={
          <AuthLayout02 
            title="Sign In" 
            description="Access your Strak Social account"
          >
            <SignIn />
          </AuthLayout02>
        } 
      />
      <Route 
        path="/auth/sign-up" 
        element={
          <AuthLayout02 
            title="Create Account" 
            description="Join Strak Social and connect with the world"
          >
            <SignUp />
          </AuthLayout02>
        } 
      />
        
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <FeedLayout>
              <Dashboard />
            </FeedLayout>
          </ProtectedRoute>
        } 
      />
        
      <Route 
        path="/explore" 
        element={
          <ProtectedRoute>
            <FeedLayout>
              <Explore />
            </FeedLayout>
          </ProtectedRoute>
        } 
      />
        
      <Route 
        path="/settings" 
        element={
          <ProtectedRoute>
            <FeedLayout>
              <Profile />
            </FeedLayout>
          </ProtectedRoute>
        } 
      />
        
      <Route path="/app/*" element={<Navigate to="/dashboard" replace />} />
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App