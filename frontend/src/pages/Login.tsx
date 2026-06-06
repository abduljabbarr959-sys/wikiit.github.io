import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../hooks/useToast'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { addToast } = useToast()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    if (!username.trim() || !password) {
      setError('Username and password are required.')
      return
    }
    setLoading(true)
    try {
      await login(username.trim(), password)
      addToast('Logged in.', 'success')
      navigate('/')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <h1>Log In</h1>
      {error && <div className="alert alert-error">{error}</div>}
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input id="username" type="text" value={username} onChange={e => setUsername(e.target.value)} disabled={loading} />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} disabled={loading} />
        </div>
        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Logging in...' : 'Log In'}
        </button>
      </form>
      <p className="auth-alt">Don't have an account? <Link to="/register">Register</Link></p>
    </div>
  )
}
