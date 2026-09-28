import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getOrder, updateOrderStatus } from '../../api/orders'
import { ORDER_STATUSES, type Order, type OrderStatus } from '../../types'
import { formatPrice, resolveImageUrl } from '../../utils/format'

export function AdminOrderDetailPage() {
  const { id } = useParams()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  async function load() {
    setLoading(true)
    try {
      const res = await getOrder(Number(id))
      setOrder(res.details ?? null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Order not found')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [id])

  async function changeStatus(status: OrderStatus) {
    if (!order) return
    setError('')
    setMessage('')
    try {
      await updateOrderStatus(order.order_id, status)
      setMessage(`Status updated → ${status}`)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed')
    }
  }

  const total = order ? order.total ?? order.price * order.quantity : 0
  const addressLine = order?.address
    ? [order.address.address_line, order.address.city, order.address.state, order.address.postal_code]
        .filter(Boolean)
        .join(', ')
    : ''

  return (
    <div className="fade-up">
      <Link to="/admin/orders" className="muted" style={{ flexShrink: 0, fontSize: '0.85rem' }}>
        ← Back to orders
      </Link>

      {error && <div className="alert alert-error">{error}</div>}
      {message && <div className="alert alert-success">{message}</div>}

      {loading && (
        <div className="empty-state">
          <div className="spinner" style={{ margin: '0 auto' }} />
        </div>
      )}

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
              {formatPrice(order.price)} × {order.quantity} · {order.payment_id ? 'Paid' : 'Unpaid'}
            </p>

            <div className="order-detail-block">
              <h3>Customer</h3>
              <dl className="detail-grid">
                <dt>Name</dt>
                <dd>{order.customer?.user?.username || '—'}</dd>
                <dt>Phone</dt>
                <dd>{order.customer?.user?.phone_number ?? '—'}</dd>
                <dt>Email</dt>
                <dd>{order.customer?.user?.email || '—'}</dd>
              </dl>
            </div>

            <div className="order-detail-block">
              <h3>Shipping address</h3>
              <p style={{ margin: 0, fontSize: '0.9rem' }}>{addressLine || 'No address on file.'}</p>
              {order.address?.created_at && (
                <p className="muted" style={{ margin: '0.35rem 0 0', fontSize: '0.8rem' }}>
                  Placed {new Date(order.address.created_at).toLocaleString()}
                </p>
              )}
            </div>

            <div className="order-detail-block">
              <h3>Update status</h3>
              <select value={order.status} onChange={(e) => changeStatus(e.target.value as OrderStatus)}>
                {ORDER_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
