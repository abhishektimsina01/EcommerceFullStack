import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getProduct } from '../../api/products'
import type { Product } from '../../types'
import { formatPrice, resolveImageUrl } from '../../utils/format'

export function AdminProductDetailPage() {
  const { id } = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
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

  return (
    <div className="fade-up">
      <Link to="/admin" className="muted" style={{ flexShrink: 0, fontSize: '0.85rem' }}>
        ← Back to catalogue
      </Link>

      {loading && (
        <div className="empty-state">
          <div className="spinner" style={{ margin: '0 auto' }} />
        </div>
      )}
      {error && <div className="alert alert-error">{error}</div>}

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
              <p className="muted">
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </p>
            )}
            <p>{product.description || 'No description provided for this product.'}</p>
            <p className="muted">Admin view — ordering disabled.</p>
            <div className="action-row">
              <Link className="btn btn-primary" to="/admin/products">
                Manage products
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
