import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { getProducts } from '../api/products'
import { ProductCard } from '../components/products/ProductCard'
import { StoreFooter } from '../components/layout/StoreFooter'
import { StoreHeader } from '../components/layout/StoreHeader'
import { PRODUCT_CATEGORIES, type Product, type ProductType } from '../types'

export function HomePage() {
  const [params, setParams] = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const category = (params.get('category') || '') as ProductType | ''
  const q = params.get('q') || ''
  const payment = params.get('payment')
  const paidOrderId = params.get('order_id')

  useEffect(() => {
    let alive = true
    setLoading(true)
    getProducts(category ? { product_type: category } : {})
      .then((res) => {
        if (alive) setProducts(res.details ?? [])
      })
      .catch((err) => {
        if (alive) setError(err instanceof Error ? err.message : 'Failed to load products')
      })
      .finally(() => {
        if (alive) setLoading(false)
      })
    return () => {
      alive = false
    }
  }, [category])

  const filtered = useMemo(() => {
    if (!q.trim()) return products
    const term = q.toLowerCase()
    return products.filter((p) => p.product_name.toLowerCase().includes(term))
  }, [products, q])

  function setCategory(value: string) {
    const next = new URLSearchParams(params)
    if (value) next.set('category', value)
    else next.delete('category')
    setParams(next)
  }

  function onSearch(value: string) {
    const next = new URLSearchParams(params)
    if (value.trim()) next.set('q', value.trim())
    else next.delete('q')
    setParams(next)
  }

  function dismissPaymentNotice() {
    const next = new URLSearchParams(params)
    next.delete('payment')
    next.delete('order_id')
    setParams(next)
  }

  return (
    <div className="app-shell">
      <StoreHeader search={q} onSearch={onSearch} />
      <main className="page">
        {payment === 'success' && (
          <div className="alert alert-success">
            Payment successful{paidOrderId ? ` for order #${paidOrderId}` : ''}.{' '}
            <Link to="/orders">View orders</Link>
            {' · '}
            <button type="button" className="btn btn-ghost" onClick={dismissPaymentNotice} style={{ padding: '0.2rem 0.5rem' }}>
              Dismiss
            </button>
          </div>
        )}
        {payment === 'failed' && (
          <div className="alert alert-error">
            Payment failed{paidOrderId ? ` for order #${paidOrderId}` : ''}.{' '}
            <Link to="/orders">Try again from orders</Link>
            {' · '}
            <button type="button" className="btn btn-ghost" onClick={dismissPaymentNotice} style={{ padding: '0.2rem 0.5rem' }}>
              Dismiss
            </button>
          </div>
        )}

        <section className="hero">
          <div className="hero-content">
            <h1 className="hero-brand">ATO Store</h1>
            <p>Browse freely — login when you are ready to buy.</p>
            <div className="hero-actions">
              <Link
                className="btn btn-ghost"
                to="/customer/login"
                style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.35)' }}
              >
                Login
              </Link>
            </div>
          </div>
        </section>

        <div className="category-row">
          {PRODUCT_CATEGORIES.map((cat) => (
            <button
              key={cat.label}
              type="button"
              className={`category-chip ${category === cat.value ? 'active' : ''}`}
              onClick={() => setCategory(cat.value)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="section-head" id="products">
          <div>
            <h2>Just for you</h2>
            <p className="muted" style={{ margin: 0, fontSize: '0.8rem' }}>
              {filtered.length} products
            </p>
          </div>
        </div>

        {loading && (
          <div className="empty-state">
            <div className="spinner" style={{ margin: '0 auto' }} />
          </div>
        )}
        {error && <div className="alert alert-error">{error}</div>}
        {!loading && !error && filtered.length === 0 && (
          <div className="empty-state">No products found. Check back soon.</div>
        )}
        {!loading && !error && filtered.length > 0 && (
          <div className="product-grid">
            {filtered.map((product, index) => (
              <ProductCard key={product.product_id} product={product} index={index} />
            ))}
          </div>
        )}
      </main>
      <StoreFooter />
    </div>
  )
}
