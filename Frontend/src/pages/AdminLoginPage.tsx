import { Link } from 'react-router-dom'
import { LoginForm } from '../components/auth/LoginForm'

export function AdminLoginPage() {
  return (
    <div className="auth-page auth-page-admin">
      <div className="auth-card">
        <p className="brand">ATO Store</p>
        <span className="portal-tag">Admin portal</span>
        <h1 style={{ margin: '0.35rem 0 0.25rem' }}>Admin login</h1>
        <p className="muted">Sign in to manage products and orders.</p>
        <LoginForm expectedRole="admin" signupPath="/admin-portal/signup" compact />
        <p className="muted" style={{ textAlign: 'center', marginTop: '1rem' }}>
          New admin? <Link to="/admin-portal/signup">Create admin account</Link>
        </p>
      </div>
    </div>
  )
}
