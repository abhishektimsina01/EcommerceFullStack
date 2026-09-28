import { Link } from 'react-router-dom'
import type { Product } from '../../types'
import { formatPrice, resolveImageUrl } from '../../utils/format'

export function AdminProductCard({
  product,
  index = 0,
  onEdit,
  onDelete,
}: {
  product: Product
  index?: number
  onEdit: (product: Product) => void
  onDelete: (product: Product) => void
}) {
  return (
    <div className="product-card admin-product-card" style={{ animationDelay: `${Math.min(index, 12) * 40}ms` }}>
      <Link to={`/admin/product/${product.product_id}`} className="product-card-link">
        <img src={resolveImageUrl(product.product_image)} alt={product.product_name} />
        <div className="product-card-body">
          <div className="product-type">{product.product_type}</div>
          <h3>{product.product_name}</h3>
          <div className="product-price">{formatPrice(product.price)}</div>
        </div>
      </Link>
      <div className="product-card-actions">
        <button type="button" className="btn btn-primary" onClick={() => onEdit(product)}>
          Edit
        </button>
        <button type="button" className="btn btn-ghost" onClick={() => onDelete(product)}>
          Delete
        </button>
      </div>
    </div>
  )
}
