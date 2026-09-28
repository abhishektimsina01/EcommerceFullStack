import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getOrder, initiateEsewa } from '../api/orders'
import { StoreFooter } from '../components/layout/StoreFooter'
import { StoreHeader } from '../components/layout/StoreHeader'
import { useAuth } from '../context/AuthContext'
import type { Order } from '../types'
import { submitEsewaForm } from '../utils/esewa'
import { formatPrice, resolveImageUrl } from '../utils/format'

export function OrderDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated, isCustomer } = useAuth()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isAuthenticated || !isCustomer) {
      navigate('/customer/login', { replace: true })
      return
    }
    let alive = true
    setLoading(true)
    getOrder(Number(id))
      .then((res) => {
        if (alive) setOrder(res.details ?? null)
      })
      .catch((err) => {
        if (alive) setError(err instanceof Error ? err.message : 'Order not found')
      })
      .finally(() => {
        if (alive) setLoading(false)
      })
    return () => {
      alive = false
    }
  }, [id, isAuthenticated, isCustomer, navigate])

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

  const total = order ? order.total ?? order.price * order.quantity : 0
  const addressLine = order?.address
    ? [order.address.address_line, order.address.city, order.address.state, order.address.postal_code]
        .filter(Boolean)
        .join(', ')
    : ''

  return (
    <div className="app-shell">
      <StoreHeader />
      <main className="page">
        <Link to="/orders" className="muted" style={{ flexShrink: 0, fontSize: '0.85rem' }}>
          ← Back to my orders
        </Link>
        {loading && (
          <div className="empty-state">
            <div className="spinner" style={{ margin: '0 auto' }} />
          </div>
        )}
        {error && <div className="alert alert-error">{error}</div>}
        {!loading && order && (
          <div className="detail-layout">
            <div className="detail-media">
              <img
                src={resolveImageUrl(order.product?.product_image)}
                alt={order.product?.product_name || 'Order'}
              />
            </div>
            <div className="order-info">
              <span className={`status-badge ${order.status}`}>{order.status}</span>
              <h1>{order.product?.product_name || `Order #${order.order_id}`}</h1>
              <div className="product-price" style={{ fontSize: '1.45rem' }}>
                {formatPrice(total)}
              </div>
              <p className="muted" style={{ margin: 0, fontSize: '0.9rem' }}>
                {formatPrice(order.price)} × {order.quantity}
              </p>

              <div className="order-detail-block">
                <h3>Order</h3>
                <dl className="detail-grid">
                  <dt>Order ID</dt>
                  <dd>#{order.order_id}</dd>
                  <dt>Payment</dt>
                  <dd>{order.payment_id ? 'Paid' : 'Unpaid'}</dd>
                  {order.address?.created_at && (
                    <>
                      <dt>Placed on</dt>
                      <dd>{new Date(order.address.created_at).toLocaleString()}</dd>
                    </>
                  )}
                </dl>
              </div>

              <div className="order-detail-block">
                <h3>Shipping address</h3>
                <p style={{ margin: 0, fontSize: '0.9rem' }}>{addressLine || 'No address on file.'}</p>
              </div>

              {!order.payment_id && order.status !== 'canceled' && (
                <div className="action-row" style={{ marginTop: '0.75rem' }}>
                  <button className="btn btn-primary" type="button" onClick={() => payAgain(order.order_id)}>
                    Pay with eSewa
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
      <StoreFooter />
    </div>
  )
}
