import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { ColorProvider } from '@/contexts/ColorContext'
import { CreatePostProvider } from '@/contexts/CreatePostContext'
import { Toaster } from '@/components/ui/sonner'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { ScrollToTop } from '@/components/ScrollToTop'
import { useNProgress } from '@/hooks/useNProgress'
import { AppLayout } from '@/layouts/AppLayout'
import { AuthLayout } from '@/layouts/AuthLayout'
import Landing from "@/pages/landing/Landing"
import { Auth } from "@/pages/auth/Auth"
import { Feed } from "@/pages/app/Feed/Feed"
import { Settings } from "@/pages/app/Settings/Settings"
import { Profile } from "@/pages/app/Profile/Profile"
import { Following } from "@/pages/app/Profile/Following"
import { Followers } from "@/pages/app/Profile/Followers"
import { Explore } from "@/pages/app/Explore/Explore"
import { Post } from "@/pages/app/Post/Post"
import { Comment } from "@/pages/app/Comment/Comment"
import { Bookmarks } from "@/pages/app/Bookmarks/Bookmarks"
import { Lists } from "@/pages/app/Lists/Lists"
import { ListDetails } from "@/pages/app/Lists/ListDetails"
import { EditList } from "@/pages/app/Lists/EditList"
import { CreateList } from "@/pages/app/Lists/CreateList"
import { queryClient } from '@/utils/query-client'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ColorProvider>
          <Router>
            <CreatePostProvider>
              <AppRoutes />
              <Toaster />
            </CreatePostProvider>
          </Router>
        </ColorProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

function AppRoutes() {
  useNProgress()
  
  return (
    <>
      <ScrollToTop />
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
            <AppLayout showNewsColumn={true}>
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
        path="/bookmarks" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <Bookmarks />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route 
        path="/lists" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <Lists />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route 
        path="/lists/new" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <CreateList />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route 
        path="/lists/:id" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <ListDetails />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route 
        path="/lists/:id/edit" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <EditList />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route 
        path="/post/:id" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <Post />
            </AppLayout>
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/comment/:id" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <Comment />
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

      <Route 
        path="/:username" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <Outlet />
            </AppLayout>
          </ProtectedRoute>
        }
      >
        <Route index element={<Profile />} />
        <Route path="following" element={<Following />} />
        <Route path="followers" element={<Followers />} />
      </Route>
           
      <Route path="/app/*" element={<Navigate to="/feed" replace />} />
      
      <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default App