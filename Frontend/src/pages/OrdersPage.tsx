import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getOrders, initiateEsewa } from '../api/orders'
import { StoreFooter } from '../components/layout/StoreFooter'
import { StoreHeader } from '../components/layout/StoreHeader'
import { useAuth } from '../context/AuthContext'
import type { Order } from '../types'
import { submitEsewaForm } from '../utils/esewa'
import { formatPrice, resolveImageUrl } from '../utils/format'

export function OrdersPage() {
  const { isCustomer, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isAuthenticated || !isCustomer) {
      navigate('/customer/login', { replace: true })
      return
    }
    getOrders()
      .then((res) => setOrders(res.details ?? []))
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load orders'))
      .finally(() => setLoading(false))
  }, [isAuthenticated, isCustomer, navigate])

  async function payAgain(orderId: number) {
    try {
      const pay = await initiateEsewa(orderId)
      if (!pay.details?.action || !pay.details.fields) {
        throw new Error('Payment could not be started')
      }
      submitEsewaForm(pay.details)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed')
    }
  }

  return (
    <div className="app-shell">
      <StoreHeader />
      <main className="page">
        <h1 className="brand-font" style={{ margin: 0, flexShrink: 0 }}>My Orders</h1>
        {loading && (
          <div className="empty-state">
            <div className="spinner" style={{ margin: '0 auto' }} />
          </div>
        )}
        {error && <div className="alert alert-error">{error}</div>}
        {!loading && orders.length === 0 && (
          <div className="empty-state">
            No orders yet. <Link to="/">Start shopping</Link>
          </div>
        )}
        <div className="list-panel">
          {orders.map((order) => (
            <div
              className="list-row clickable-row"
              key={order.order_id}
              role="button"
              tabIndex={0}
              onClick={() => navigate(`/orders/${order.order_id}`)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  navigate(`/orders/${order.order_id}`)
                }
              }}
            >
              <img
                src={resolveImageUrl(order.product?.product_image)}
                alt={order.product?.product_name || 'Order'}
              />
              <div>
                <h3 style={{ margin: '0 0 0.25rem' }}>
                  {order.product?.product_name || `Order #${order.order_id}`}
                </h3>
                <p className="muted" style={{ margin: 0 }}>
                  Qty {order.quantity} · {formatPrice(order.price * order.quantity)}
                </p>
                <span className={`status-badge ${order.status}`}>{order.status}</span>
                {order.payment_id ? (
                  <p className="muted" style={{ margin: '0.35rem 0 0' }}>Paid</p>
                ) : null}
              </div>
              <div className="action-row">
                {!order.payment_id && order.status !== 'canceled' && (
                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      payAgain(order.order_id)
                    }}
                  >
                    Pay with eSewa
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
      <StoreFooter />
    </div>
  )
}
