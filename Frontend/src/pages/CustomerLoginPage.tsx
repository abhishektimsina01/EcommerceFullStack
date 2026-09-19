import { Link } from 'react-router-dom'
import { LoginForm } from '../components/auth/LoginForm'

export function CustomerLoginPage() {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <p className="brand">ATO Store</p>
        <h1 style={{ margin: '0.35rem 0 0.25rem' }}>Customer login</h1>
        <p className="muted">Access your cart, checkout and orders.</p>
        <LoginForm expectedRole="customer" signupPath="/customer/signup" compact />
        <p className="muted" style={{ textAlign: 'center', marginTop: '1rem' }}>
          Need an account? <Link to="/customer/signup">Sign up</Link>
          {' · '}
          <Link to="/">← Back to store</Link>
        </p>
      </div>
    </div>
  )
}
