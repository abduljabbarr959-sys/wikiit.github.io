import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../hooks/useToast'

export default function Register() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { addToast } = useToast()
  const [passwordHint, setPasswordHint] = useState('')
  const [confirmHint, setConfirmHint] = useState('')

  useEffect(() => {
    if (password && password.length < 8) {
      setPasswordHint(`Need ${8 - password.length} more characters`)
    } else if (password) {
      setPasswordHint('Password looks good')
    } else {
      setPasswordHint('')
    }
  }, [password])

  useEffect(() => {
    if (confirm && password !== confirm) {
      setConfirmHint('Passwords do not match')
    } else if (confirm) {
      setConfirmHint('Passwords match')
    } else {
      setConfirmHint('')
    }
  }, [confirm, password])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    if (!username.trim()) {
      setError('Username is required.')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    setLoading(true)
    try {
      await register(username.trim(), password)
      addToast('Account created!', 'success')
      navigate('/')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <h1>Register</h1>
      {error && <div className="alert alert-error">{error}</div>}
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input id="username" type="text" value={username} onChange={e => setUsername(e.target.value)} disabled={loading} />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            disabled={loading}
            className={(passwordHint && passwordHint !== 'Password looks good') ? 'input-error' : passwordHint === 'Password looks good' ? 'input-ok' : ''}
          />
          {passwordHint && (
            <span className={`field-hint ${passwordHint === 'Password looks good' ? 'hint-ok' : 'hint-error'}`}>
              {passwordHint}
            </span>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="confirm">Confirm Password</label>
          <input
            id="confirm"
            type="password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            disabled={loading}
            className={confirmHint === 'Passwords do not match' ? 'input-error' : confirmHint === 'Passwords match' ? 'input-ok' : ''}
          />
          {confirmHint && (
            <span className={`field-hint ${confirmHint === 'Passwords match' ? 'hint-ok' : 'hint-error'}`}>
              {confirmHint}
            </span>
          )}
        </div>
        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
      <p className="auth-alt">Already have an account? <Link to="/login">Log in</Link></p>
    </div>
  )
}
