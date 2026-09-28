import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { getCustomerRecommendations, getProducts, getRecommendedProducts } from '../api/products'
import { ProductCard } from '../components/products/ProductCard'
import { StoreFooter } from '../components/layout/StoreFooter'
import { StoreHeader } from '../components/layout/StoreHeader'
import { useAuth } from '../context/AuthContext'
import { PRODUCT_CATEGORIES, type Product, type ProductType } from '../types'

function randomizeProductsByCategory(products: Product[]): Product[] {
  const groups = new Map<ProductType, Product[]>()
  for (const product of products) {
    const group = groups.get(product.product_type) ?? []
    group.push(product)
    groups.set(product.product_type, group)
  }

  for (const group of groups.values()) {
    for (let i = group.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1))
      const item = group[i]
      group[i] = group[j]
      group[j] = item
    }
  }

  const ordered: Product[] = []
  let previousCategory: ProductType | undefined
  while (groups.size > 0) {
    const available = [...groups.keys()]
    const choices = available.filter((type) => type !== previousCategory)
    // If only one category remains, allow it again so the final group can drain.
    const candidates = choices.length > 0 ? choices : available
    const category = candidates[Math.floor(Math.random() * candidates.length)]
    const group = groups.get(category)
    if (!group?.length) {
      groups.delete(category)
      continue
    }
    ordered.push(group.pop()!)
    previousCategory = category
    if (group.length === 0) groups.delete(category)
  }

  return ordered
}

export function HomePage() {
  const [params, setParams] = useSearchParams()
  const { isAuthenticated, isCustomer } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [recommendations, setRecommendations] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const category = (params.get('category') || '') as ProductType | ''
  const q = params.get('q') || ''
  const payment = params.get('payment')
  const paidOrderId = params.get('order_id')
  const recommendationSlider = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let alive = true
    setLoading(true)
    // logged-in customers browsing the full catalogue get a per-user recommended
    // ordering; a category filter or an anonymous visitor gets the default listing.
    const request =
      !category && isCustomer
        ? getRecommendedProducts()
        : getProducts(category ? { product_type: category } : {})
    request
      .then((res) => {
        if (alive) setProducts(randomizeProductsByCategory(res.details ?? []))
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
  }, [category, isCustomer])

  useEffect(() => {
    let alive = true
    setRecommendations([])
    if (!isAuthenticated || !isCustomer || category) return () => { alive = false }

    getCustomerRecommendations()
      .then((res) => {
        if (alive) setRecommendations(res.details ?? [])
      })
      .catch(() => {
        // Recommendations are optional; keep the main catalogue available on failure.
      })
    return () => { alive = false }
  }, [category, isAuthenticated, isCustomer, payment, paidOrderId])

  function scrollRecommendations(direction: -1 | 1) {
    recommendationSlider.current?.scrollBy({
      left: direction * 240,
      behavior: 'smooth',
    })
  }

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
    <div className="app-shell home-scroll-layout">
      <StoreHeader search={q} onSearch={onSearch} />
      <main className="page home-page">
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

        {!category && isAuthenticated && isCustomer && recommendations.length > 0 && (
          <section className="recommendation-section" aria-label="Recommended products">
            <div className="recommendation-heading">
              <div>
                <h3>Recommended for you</h3>
                <p className="muted">Picked from products you may like</p>
              </div>
              <div className="recommendation-controls">
                <button type="button" className="recommendation-arrow" aria-label="Scroll recommendations left" onClick={() => scrollRecommendations(-1)}>‹</button>
                <button type="button" className="recommendation-arrow" aria-label="Scroll recommendations right" onClick={() => scrollRecommendations(1)}>›</button>
              </div>
            </div>
            <div className="recommendation-track" ref={recommendationSlider}>
              {recommendations.map((product, index) => (
                <div className="recommendation-item" key={product.product_id}>
                  <ProductCard product={product} index={index} />
                </div>
              ))}
            </div>
          </section>
        )}

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
