import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from "react-router";
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/query-client'
import './index.css'
import App from './App.tsx'
import { SignUp } from './pages/auth/SignUp.tsx';


createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/auth/sign-up" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
)
