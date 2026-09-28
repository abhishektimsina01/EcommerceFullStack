import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { deleteProduct, getProducts } from '../../api/products'
import { AdminProductCard } from '../../components/products/AdminProductCard'
import { PRODUCT_CATEGORIES, type Product, type ProductType } from '../../types'

export function AdminDashboard() {
  const navigate = useNavigate()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [category, setCategory] = useState<ProductType | ''>('')
  const [search, setSearch] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await getProducts(category ? { product_type: category } : {})
      setProducts(res.details ?? [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products')
    } finally {
      setLoading(false)
    }
  }, [category])

  useEffect(() => {
    void load()
  }, [load])

  function handleEdit(product: Product) {
    navigate(`/admin/products?edit=${product.product_id}`)
  }

  async function handleDelete(product: Product) {
    if (!confirm(`Delete "${product.product_name}"?`)) return
    try {
      await deleteProduct(product.product_id)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed')
    }
  }

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
            <AdminProductCard
              key={product.product_id}
              product={product}
              index={index}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}
