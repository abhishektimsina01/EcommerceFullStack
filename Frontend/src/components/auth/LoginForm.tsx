import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import type { Role } from '../../types'

interface Props {
  onSuccess?: () => void
  compact?: boolean
  expectedRole?: Role
  signupPath?: string
}

export function LoginForm({ onSuccess, compact, expectedRole, signupPath }: Props) {
  const { login, logout } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await login(email, password)
      if (expectedRole && user.role !== expectedRole) {
        await logout()
        setError(
          expectedRole === 'admin'
            ? 'This portal is for admins only.'
            : 'This login is for customers only.',
        )
        return
      }
      onSuccess?.()
      if (!onSuccess) {
        navigate(user.role === 'admin' ? '/admin' : '/')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const registerHref = signupPath ?? '/customer/signup'

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="alert alert-error">{error}</div>}
      <div className="field">
        <label htmlFor="login-email">Email</label>
        <input
          id="login-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />
      </div>
      <div className="field">
        <label htmlFor="login-password">Password</label>
        <input
          id="login-password"
          type="password"
          required
          minLength={6}
          maxLength={18}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="6–18 characters"
        />
      </div>
      <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%' }}>
        {loading ? 'Signing in…' : 'Login'}
      </button>
      {!compact && (
        <p className="muted" style={{ marginTop: '1rem', textAlign: 'center' }}>
          New here? <Link to={registerHref}>Create an account</Link>
        </p>
      )}
    </form>
  )
}
