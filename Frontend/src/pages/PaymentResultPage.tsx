import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { StoreFooter } from '../components/layout/StoreFooter'
import { StoreHeader } from '../components/layout/StoreHeader'

export function PaymentResultPage({ success }: { success: boolean }) {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const orderId = params.get('order_id')

  useEffect(() => {
    const timer = setTimeout(() => navigate('/orders'), 3500)
    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className="app-shell">
      <StoreHeader />
      <main className="page" style={{ display: 'grid', placeItems: 'center' }}>
        <div className="auth-card" style={{ textAlign: 'center' }}>
          <p className="brand">ATO Store</p>
          <h1>{success ? 'Payment successful' : 'Payment failed'}</h1>
          <p className="muted">
            {orderId ? `Order #${orderId}` : 'Your order'}{' '}
            {success ? 'was paid.' : 'could not be completed.'}
          </p>
          <p className="muted">Redirecting to your orders…</p>
        </div>
      </main>
      <StoreFooter />
    </div>
  )
}
