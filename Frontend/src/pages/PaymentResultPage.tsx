import { Link, useSearchParams } from 'react-router-dom'
import { StoreFooter } from '../components/layout/StoreFooter'
import { StoreHeader } from '../components/layout/StoreHeader'

export function PaymentResultPage({ success }: { success: boolean }) {
  const [params] = useSearchParams()
  const orderId = params.get('order_id')

  return (
    <div className="app-shell">
      <StoreHeader />
      <main className="page" style={{ display: 'grid', placeItems: 'center' }}>
        <div className="auth-card" style={{ textAlign: 'center' }}>
          <p className="brand">ATO Store</p>
          <h1>{success ? 'Payment successful' : 'Payment failed'}</h1>
          <p className="muted">
            {orderId ? `Order #${orderId}` : 'Your order'}{' '}
            {success ? 'was paid. You can review it in My Orders.' : 'could not be completed. You can retry payment from My Orders.'}
          </p>
          <div className="action-row" style={{ justifyContent: 'center', marginTop: '1rem' }}>
            <Link className="btn btn-primary" to="/orders">
              View orders
            </Link>
            <Link className="btn btn-ghost" to="/">
              Continue shopping
            </Link>
          </div>
        </div>
      </main>
      <StoreFooter />
    </div>
  )
}
