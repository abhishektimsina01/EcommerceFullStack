import { SignupForm } from '../components/auth/SignupForm'

export function CustomerSignupPage() {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <p className="brand">ATO Store</p>
        <h1 style={{ margin: '0.35rem 0 0.25rem' }}>Create customer account</h1>
        <p className="muted">Join ATO Store to shop and track orders.</p>
        <SignupForm role="customer" />
      </div>
    </div>
  )
}
