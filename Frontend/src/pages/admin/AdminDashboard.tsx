import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getProducts } from '../../api/products'
import { ProductCard } from '../../components/products/ProductCard'
import { PRODUCT_CATEGORIES, type Product, type ProductType } from '../../types'

export function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [category, setCategory] = useState<ProductType | ''>('')
  const [search, setSearch] = useState('')

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
    if (!search.trim()) return products
    const term = search.toLowerCase()
    return products.filter((p) => p.product_name.toLowerCase().includes(term))
  }, [products, search])

  return (
    <div className="fade-up">
      <div className="section-head">
        <div>
          <h1 className="brand-font" style={{ margin: 0 }}>
            ATO Store Admin
          </h1>
          <p className="muted" style={{ margin: 0, fontSize: '0.8rem' }}>
            Catalogue view — no ordering
          </p>
        </div>
        <div className="action-row">
          <Link className="btn btn-primary" to="/admin/products">
            Manage
          </Link>
          <Link className="btn btn-ghost" to="/admin/orders">
            Orders
          </Link>
        </div>
      </div>

      <div className="filters-bar">
        <div className="field" style={{ marginBottom: 0, flex: 1, minWidth: 160 }}>
          <label htmlFor="admin-search">Search</label>
          <input
            id="admin-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products"
          />
        </div>
      </div>

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

      <div className="section-head">
        <p className="muted" style={{ margin: 0, fontSize: '0.8rem' }}>
          {filtered.length} products
        </p>
      </div>

      {loading && (
        <div className="empty-state">
          <div className="spinner" style={{ margin: '0 auto' }} />
        </div>
      )}
      {error && <div className="alert alert-error">{error}</div>}
      {!loading && !error && filtered.length === 0 && (
        <div className="empty-state">No products yet.</div>
      )}
      {!loading && !error && filtered.length > 0 && (
        <div className="product-grid">
          {filtered.map((product, index) => (
            <ProductCard
              key={product.product_id}
              product={product}
              index={index}
              to={`/admin/product/${product.product_id}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
