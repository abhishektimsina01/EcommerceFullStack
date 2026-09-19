import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import type { Role } from '../../types'

interface Props {
  role: Role
  onSuccess?: () => void
}

const defaultAddress = {
  city: '',
  state: '',
  postal_code: '',
  address_line: '',
}

export function SignupForm({ role, onSuccess }: Props) {
  const { signup } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    email: '',
    password: '',
    username: '',
    phone_number: '',
    address: defaultAddress,
  })

  function updateField(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function updateAddress(key: string, value: string) {
    setForm((prev) => ({
      ...prev,
      address: { ...prev.address, [key]: value },
    }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await signup({ ...form, role })
      onSuccess?.()
      if (!onSuccess) {
        navigate(user.role === 'admin' ? '/admin' : '/')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="signup-form" onSubmit={handleSubmit}>
      {error && <div className="alert alert-error">{error}</div>}
      <div className="form-grid">
        <div className="field">
          <label>Username</label>
          <input
            required
            value={form.username}
            onChange={(e) => updateField('username', e.target.value)}
          />
        </div>
        <div className="field">
          <label>Phone (97/98…)</label>
          <input
            required
            pattern="^(97|98)\d{8}$"
            title="Must start with 97 or 98 and be 10 digits"
            value={form.phone_number}
            onChange={(e) => updateField('phone_number', e.target.value)}
          />
        </div>
      </div>
      <div className="form-grid">
        <div className="field">
          <label>Email</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => updateField('email', e.target.value)}
          />
        </div>
        <div className="field">
          <label>Password</label>
          <input
            type="password"
            required
            minLength={6}
            maxLength={18}
            value={form.password}
            onChange={(e) => updateField('password', e.target.value)}
          />
        </div>
      </div>
      <div className="form-grid">
        <div className="field">
          <label>City</label>
          <input
            required
            value={form.address.city}
            onChange={(e) => updateAddress('city', e.target.value)}
          />
        </div>
        <div className="field">
          <label>State</label>
          <input
            required
            value={form.address.state}
            onChange={(e) => updateAddress('state', e.target.value)}
          />
        </div>
      </div>
      <div className="form-grid">
        <div className="field">
          <label>Address line</label>
          <input
            value={form.address.address_line}
            onChange={(e) => updateAddress('address_line', e.target.value)}
            placeholder="Optional"
          />
        </div>
        <div className="field">
          <label>Postal code</label>
          <input
            value={form.address.postal_code}
            onChange={(e) => updateAddress('postal_code', e.target.value)}
            placeholder="Optional"
          />
        </div>
      </div>
      <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%' }}>
        {loading ? 'Creating account…' : `Sign up as ${role}`}
      </button>
      <p className="muted signup-login-link">
        Already have an account?{' '}
        <Link to={role === 'admin' ? '/admin-portal/login' : '/customer/login'}>Login</Link>
      </p>
    </form>
  )
}
