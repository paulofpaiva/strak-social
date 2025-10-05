import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { ToastProvider } from '@/contexts/ToastContext'
import { CreatePostProvider } from '@/contexts/CreatePostContext'
import { ToastContainer } from '@/components/ToastContainer'
import { GlobalCreatePostModal } from '@/components/app/posts/GlobalCreatePostModal'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { useNProgress } from '@/hooks/useNProgress'
import { AuthLayout } from '@/layouts/AuthLayout'
import { FeedLayout } from '@/layouts/FeedLayout'
import { AppLayout } from '@/layouts/AppLayout'
import Landing from "@/pages/landing/Landing"
import { Auth } from "@/pages/auth/Auth"
import { SignIn } from "@/pages/auth/SignIn"
import { SignUp } from "@/pages/auth/SignUp"
import { Feed } from "@/pages/app/Feed"
import { Explore } from "@/pages/app/Explore"
import { Settings } from "@/pages/app/settings/Settings"
import { Profile } from "@/pages/app/profile/Profile"
import { UserProfile } from "@/pages/app/users/[username]/index"
import { PostView } from "@/pages/app/posts/[id]"
import { CommentView } from "@/pages/app/posts/comments/[id]"
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
      <Route path="/auth" element={<Auth />}>
        <Route index element={<Navigate to="/auth/sign-in" replace />} />
        <Route path="sign-in" element={<SignIn />} />
        <Route path="sign-up" element={<SignUp />} />
      </Route>
        
      <Route 
        path="/feed" 
        element={
          <ProtectedRoute>
            <FeedLayout>
              <Feed />
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
        path="/post/:id" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <PostView />
            </AppLayout>
          </ProtectedRoute>
        } 
      />
        
      <Route 
        path="/post/:postId/comment/:id" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <CommentView />
            </AppLayout>
          </ProtectedRoute>
        } 
      />
        
      <Route 
        path="/:username" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <UserProfile />
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