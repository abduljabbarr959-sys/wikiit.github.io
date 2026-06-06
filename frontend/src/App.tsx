import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { useTheme } from './hooks/useTheme'
import { AuthProvider } from './hooks/useAuth'
import Layout from './components/Layout'
import Skeleton from './components/Skeleton'

const Home = lazy(() => import('./pages/Home'))
const Entry = lazy(() => import('./pages/Entry'))
const Search = lazy(() => import('./pages/Search'))
const NewEntry = lazy(() => import('./pages/NewEntry'))
const EditEntry = lazy(() => import('./pages/EditEntry'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))

export default function App() {
  const { theme, toggleTheme } = useTheme()

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout theme={theme} onToggleTheme={toggleTheme} />}>
            <Route path="/" element={<Suspense fallback={<Skeleton variant="home" />}><Home /></Suspense>} />
            <Route path="/wiki/:title" element={<Suspense fallback={<Skeleton variant="entry" />}><Entry /></Suspense>} />
            <Route path="/search" element={<Suspense fallback={<Skeleton variant="search" />}><Search /></Suspense>} />
            <Route path="/new" element={<Suspense fallback={<Skeleton variant="form" />}><NewEntry /></Suspense>} />
            <Route path="/edit/:title" element={<Suspense fallback={<Skeleton variant="form" />}><EditEntry /></Suspense>} />
            <Route path="/login" element={<Suspense fallback={<Skeleton variant="auth" />}><Login /></Suspense>} />
            <Route path="/register" element={<Suspense fallback={<Skeleton variant="auth" />}><Register /></Suspense>} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

function NotFound() {
  return (
    <div className="error-page">
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none" className="empty-illustration">
        <rect x="25" y="20" width="70" height="85" rx="4" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.25" />
        <polyline points="40,65 52,50 64,65 76,45" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.3" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="30" y1="30" x2="50" y2="30" stroke="currentColor" strokeWidth="2" opacity="0.15" />
        <line x1="30" y1="38" x2="45" y2="38" stroke="currentColor" strokeWidth="2" opacity="0.1" />
        <text x="60" y="105" textAnchor="middle" fontSize="14" fill="currentColor" opacity="0.2">?</text>
      </svg>
      <h1>404</h1>
      <p>Page not found.</p>
      <Link to="/" className="btn">Return to Home</Link>
    </div>
  )
}
