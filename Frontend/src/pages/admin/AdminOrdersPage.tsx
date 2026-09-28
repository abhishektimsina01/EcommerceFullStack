import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getOrders, updateOrderStatus } from '../../api/orders'
import { ORDER_STATUSES, type Order, type OrderStatus } from '../../types'
import { formatPrice, resolveImageUrl } from '../../utils/format'

export function AdminOrdersPage() {
  const navigate = useNavigate()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  async function load() {
    setLoading(true)
    try {
      const res = await getOrders()
      setOrders(res.details ?? [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  async function changeStatus(id: number, status: OrderStatus) {
    setError('')
    setMessage('')
    try {
      await updateOrderStatus(id, status)
      setMessage(`Order #${id} → ${status}`)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed')
    }
  }

  return (
    <div className="fade-up">
      <h1 className="brand-font" style={{ margin: 0 }}>
        Orders
      </h1>
      {error && <div className="alert alert-error">{error}</div>}
      {message && <div className="alert alert-success">{message}</div>}
      {loading ? (
        <div className="spinner" />
      ) : orders.length === 0 ? (
        <div className="empty-state">No orders yet.</div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Order</th>
                <th>Total</th>
                <th>Status</th>
                <th>Update</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.order_id}
                  className="clickable-row"
                  onClick={() => navigate(`/admin/orders/${order.order_id}`)}
                >
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <img src={resolveImageUrl(order.product?.product_image)} alt="" />
                      <span>{order.product?.product_name || '—'}</span>
                    </div>
                  </td>
                  <td>#{order.order_id}</td>
                  <td>
                    {formatPrice(order.price * order.quantity)}
                    <div className="muted" style={{ fontSize: '0.75rem' }}>
                      qty {order.quantity}
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${order.status}`}>{order.status}</span>
                    <div className="muted" style={{ fontSize: '0.75rem' }}>
                      {order.payment_id ? 'Paid' : 'Unpaid'}
                    </div>
                  </td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <select
                      value={order.status}
                      onChange={(e) => changeStatus(order.order_id, e.target.value as OrderStatus)}
                    >
                      {ORDER_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
