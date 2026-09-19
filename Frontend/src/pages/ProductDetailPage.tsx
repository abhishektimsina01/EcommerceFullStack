import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { addToCart } from '../api/cart'
import { getProduct } from '../api/products'
import { StoreFooter } from '../components/layout/StoreFooter'
import { StoreHeader } from '../components/layout/StoreHeader'
import { useAuth } from '../context/AuthContext'
import { useAuthGate } from '../context/AuthGateContext'
import type { Product } from '../types'
import { formatPrice, resolveImageUrl } from '../utils/format'

export function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated, isCustomer } = useAuth()
  const { requireAuth } = useAuthGate()
  const [product, setProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    let alive = true
    setLoading(true)
    getProduct(Number(id))
      .then((res) => {
        if (alive) setProduct(res.details ?? null)
      })
      .catch((err) => {
        if (alive) setError(err instanceof Error ? err.message : 'Product not found')
      })
      .finally(() => {
        if (alive) setLoading(false)
      })
    return () => {
      alive = false
    }
  }, [id])

  function ensureCustomer(action: () => void, msg: string) {
    if (!isAuthenticated || !isCustomer) {
      requireAuth(action, msg)
      return
    }
    action()
  }

  async function handleAddToCart() {
    if (!product) return
    ensureCustomer(async () => {
      try {
        await addToCart(product.product_id)
        setMessage('Added to cart')
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not add to cart')
      }
    }, 'Login as a customer to add items to your cart')
  }

  function handleBuyNow() {
    if (!product) return
    ensureCustomer(() => {
      navigate(`/checkout/${product.product_id}?qty=${quantity}`)
    }, 'Login as a customer to place an order')
  }

  return (
    <div className="app-shell">
      <StoreHeader />
      <main className="page">
        <Link to="/" className="muted" style={{ flexShrink: 0, fontSize: '0.85rem' }}>
          ← Back to store
        </Link>
        {loading && (
          <div className="empty-state">
            <div className="spinner" style={{ margin: '0 auto' }} />
          </div>
        )}
        {error && <div className="alert alert-error">{error}</div>}
        {message && <div className="alert alert-success">{message}</div>}
        {product && (
          <div className="detail-layout">
            <div className="detail-media">
              <img src={resolveImageUrl(product.product_image)} alt={product.product_name} />
            </div>
            <div className="detail-info">
              <div className="product-type">{product.product_type}</div>
              <h1>{product.product_name}</h1>
              <div className="product-price" style={{ fontSize: '1.45rem' }}>
                {formatPrice(product.price)}
              </div>
              {product.stock !== undefined && (
                <p className="muted">{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</p>
              )}
              <p>{product.description || 'No description provided for this product.'}</p>
              <div className="qty-row">
                <label htmlFor="qty">Quantity</label>
                <input
                  id="qty"
                  type="number"
                  min={1}
                  max={product.stock || 99}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
                />
              </div>
              <div className="action-row">
                <button className="btn btn-primary" type="button" onClick={handleBuyNow}>
                  Buy Now
                </button>
                <button className="btn btn-dark" type="button" onClick={handleAddToCart}>
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      <StoreFooter />
    </div>
  )
}
