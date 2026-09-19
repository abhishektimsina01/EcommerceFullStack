import { Link } from 'react-router-dom'
import type { Product } from '../../types'
import { formatPrice, resolveImageUrl } from '../../utils/format'

export function ProductCard({
  product,
  index = 0,
  to,
}: {
  product: Product
  index?: number
  to?: string
}) {
  return (
    <Link
      to={to ?? `/product/${product.product_id}`}
      className="product-card"
      style={{ animationDelay: `${Math.min(index, 12) * 40}ms` }}
    >
      <img src={resolveImageUrl(product.product_image)} alt={product.product_name} />
      <div className="product-card-body">
        <div className="product-type">{product.product_type}</div>
        <h3>{product.product_name}</h3>
        <div className="product-price">{formatPrice(product.price)}</div>
      </div>
    </Link>
  )
}
