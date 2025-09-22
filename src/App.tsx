import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { ToastProvider } from '@/contexts/ToastContext'
import { CreatePostProvider } from '@/contexts/CreatePostContext'
import { ToastContainer } from '@/components/ToastContainer'
import { GlobalCreatePostModal } from '@/components/posts/GlobalCreatePostModal'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { useNProgress } from '@/hooks/useNProgress'
import { AuthLayout } from '@/layouts/AuthLayout'
import { FeedLayout } from '@/layouts/FeedLayout'
import { AppLayout } from '@/layouts/AppLayout'
import Landing from "@/pages/landing/Landing"
import { Auth } from "@/pages/auth/Auth"
import { SignIn } from "@/pages/auth/SignIn"
import { SignUp } from "@/pages/auth/SignUp"
import { Dashboard } from "@/pages/app/Dashboard"
import { Explore } from "@/pages/app/Explore"
import { Settings } from "@/pages/app/settings/Settings"
import { Profile } from "@/pages/app/profile/Profile"
import { PostView } from "@/pages/app/posts/PostView"
import { CommentView } from "@/pages/app/posts/CommentView"
import { queryClient } from '@/lib/query-client'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ToastProvider>
          <CreatePostProvider>
            <Router>
              <AppRoutes />
              <ToastContainer />
              <GlobalCreatePostModal />
            </Router>
          </CreatePostProvider>
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
          <AuthLayout 
            title="Sign In" 
            description="Access your Strak Social account"
          >
            <SignIn />
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
            <SignUp />
          </AuthLayout>
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
            <AppLayout>
              <Explore />
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
        path="/post/:postId" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <PostView />
            </AppLayout>
          </ProtectedRoute>
        } 
      />
        
      <Route 
        path="/comment/:commentId" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <CommentView />
            </AppLayout>
          </ProtectedRoute>
        } 
      />
        
      <Route path="/app/*" element={<Navigate to="/dashboard" replace />} />
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App