import { SignupForm } from '../components/auth/SignupForm'

export function AdminSignupPage() {
  return (
    <div className="auth-page auth-page-admin">
      <div className="auth-card">
        <p className="brand">ATO Store</p>
        <span className="portal-tag">Admin portal</span>
        <h1 style={{ margin: '0.35rem 0 0.25rem' }}>Create admin account</h1>
        <p className="muted">Register to manage the ATO Store catalogue.</p>
        <SignupForm role="admin" />
      </div>
    </div>
  )
}
