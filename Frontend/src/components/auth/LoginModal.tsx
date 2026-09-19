import { useState } from 'react'
import { useAuthGate } from '../../context/AuthGateContext'
import { LoginForm } from './LoginForm'
import { SignupForm } from './SignupForm'

export function LoginModal() {
  const { open, message, closeGate, consumePending } = useAuthGate()
  const [mode, setMode] = useState<'login' | 'signup'>('login')

  if (!open) return null

  return (
    <div className="modal-backdrop" onClick={closeGate}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Welcome to ATO Store</h2>
        <p className="muted">{message}</p>
        <div className="modal-tabs">
          <button
            type="button"
            className={mode === 'login' ? 'active' : ''}
            onClick={() => setMode('login')}
          >
            Login
          </button>
          <button
            type="button"
            className={mode === 'signup' ? 'active' : ''}
            onClick={() => setMode('signup')}
          >
            Signup
          </button>
        </div>
        {mode === 'login' ? (
          <LoginForm compact expectedRole="customer" onSuccess={consumePending} />
        ) : (
          <SignupForm role="customer" onSuccess={consumePending} />
        )}
      </div>
    </div>
  )
}
