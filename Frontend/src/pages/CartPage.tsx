import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getCart, removeFromCart } from '../api/cart'
import { StoreFooter } from '../components/layout/StoreFooter'
import { StoreHeader } from '../components/layout/StoreHeader'
import { useAuth } from '../context/AuthContext'
import type { CartItem } from '../types'
import { formatPrice, resolveImageUrl } from '../utils/format'

export function CartPage() {
  const { isCustomer, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isAuthenticated || !isCustomer) {
      navigate('/customer/login', { replace: true })
      return
    }
    let alive = true
    getCart()
      .then((res) => {
        if (alive) setItems(res.details ?? [])
      })
      .catch((err) => {
        if (alive) setError(err instanceof Error ? err.message : 'Failed to load cart')
      })
      .finally(() => {
        if (alive) setLoading(false)
      })
    return () => {
      alive = false
    }
  }, [isAuthenticated, isCustomer, navigate])

  async function handleRemove(productId: number) {
    try {
      await removeFromCart(productId)
      setItems((prev) => prev.filter((item) => item.product_item.product_id !== productId))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not remove item')
    }
  }

  return (
    <div className="app-shell">
      <StoreHeader />
      <main className="page">
        <h1 className="brand-font" style={{ margin: 0, flexShrink: 0 }}>My Cart</h1>
        {loading && (
          <div className="empty-state">
            <div className="spinner" style={{ margin: '0 auto' }} />
          </div>
        )}
        {error && <div className="alert alert-error">{error}</div>}
        {!loading && items.length === 0 && (
          <div className="empty-state">
            Your cart is empty. <Link to="/">Continue shopping</Link>
          </div>
        )}
        <div className="list-panel">
          {items.map((item) => (
            <div className="list-row" key={item.cart_item_id}>
              <img
                src={resolveImageUrl(item.product_item.product_image)}
                alt={item.product_item.product_name}
              />
              <div>
                <h3 style={{ margin: '0 0 0.25rem' }}>{item.product_item.product_name}</h3>
                <div className="product-price">{formatPrice(item.product_item.price)}</div>
              </div>
              <div className="action-row">
                <Link
                  className="btn btn-primary"
                  to={`/checkout/${item.product_item.product_id}?qty=1`}
                >
                  Buy
                </Link>
                <button
                  className="btn btn-ghost"
                  type="button"
                  onClick={() => handleRemove(item.product_item.product_id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
      <StoreFooter />
    </div>
  )
}
