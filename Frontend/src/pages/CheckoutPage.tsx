import { type FormEvent, useEffect, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { createOrder, initiateEsewa } from '../api/orders'
import { getProduct } from '../api/products'
import { StoreFooter } from '../components/layout/StoreFooter'
import { StoreHeader } from '../components/layout/StoreHeader'
import { useAuth } from '../context/AuthContext'
import type { Product } from '../types'
import { formatPrice, resolveImageUrl } from '../utils/format'

export function CheckoutPage() {
  const { id } = useParams()
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { isCustomer, isAuthenticated } = useAuth()
  const [product, setProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState(Number(params.get('qty') || 1))
  const [useDefault, setUseDefault] = useState(true)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [address, setAddress] = useState({
    city: 'Kathmandu',
    state: 'Bagmati',
    address_line: '',
    postal_code: '',
  })

  useEffect(() => {
    if (!isAuthenticated || !isCustomer) {
      navigate('/customer/login', { replace: true })
      return
    }
    getProduct(Number(id))
      .then((res) => setProduct(res.details ?? null))
      .catch((err) => setError(err instanceof Error ? err.message : 'Product not found'))
  }, [id, isAuthenticated, isCustomer, navigate])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!product) return
    setLoading(true)
    setError('')
    try {
      const orderRes = await createOrder({
        product: { product_id: product.product_id, quantity },
        current_address: useDefault
          ? { default_address: true }
          : { address },
      })
      const orderId = orderRes.details?.order_id
      if (!orderId) throw new Error('Order created but no order id returned')

      const pay = await initiateEsewa(orderId)
      const { action, fields } = pay.details!
      const form = document.createElement('form')
      form.method = 'POST'
      form.action = action
      Object.entries(fields).forEach(([key, value]) => {
        const input = document.createElement('input')
        input.type = 'hidden'
        input.name = key
        input.value = value
        form.appendChild(input)
      })
      document.body.appendChild(form)
      form.submit()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Checkout failed')
      setLoading(false)
    }
  }

  return (
    <div className="app-shell">
      <StoreHeader />
      <main className="page">
        <Link to={product ? `/product/${product.product_id}` : '/'} className="muted" style={{ flexShrink: 0, fontSize: '0.85rem' }}>
          ← Back
        </Link>
        <h1 className="brand-font" style={{ margin: 0, flexShrink: 0 }}>Checkout</h1>
        {error && <div className="alert alert-error">{error}</div>}
        {product && (
          <div className="list-panel fade-up" style={{ maxWidth: 720 }}>
            <div className="list-row">
              <img src={resolveImageUrl(product.product_image)} alt={product.product_name} />
              <div>
                <h3 style={{ margin: 0 }}>{product.product_name}</h3>
                <p className="muted" style={{ margin: '0.25rem 0' }}>
                  {formatPrice(product.price)} × {quantity}
                </p>
                <strong>{formatPrice(product.price * quantity)}</strong>
              </div>
            </div>
            <form onSubmit={handleSubmit} style={{ padding: '1rem' }}>
              <div className="field">
                <label>Quantity</label>
                <input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
                />
              </div>
              <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '1rem' }}>
                <input
                  type="checkbox"
                  checked={useDefault}
                  onChange={(e) => setUseDefault(e.target.checked)}
                />
                Use my default address
              </label>
              {!useDefault && (
                <>
                  <div className="form-grid">
                    <div className="field">
                      <label>City</label>
                      <input
                        required
                        value={address.city}
                        onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      />
                    </div>
                    <div className="field">
                      <label>State</label>
                      <input
                        required
                        value={address.state}
                        onChange={(e) => setAddress({ ...address, state: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="field">
                    <label>Address line</label>
                    <input
                      value={address.address_line}
                      onChange={(e) => setAddress({ ...address, address_line: e.target.value })}
                    />
                  </div>
                </>
              )}
              <button className="btn btn-primary" type="submit" disabled={loading}>
                {loading ? 'Redirecting to eSewa…' : 'Pay with eSewa'}
              </button>
            </form>
          </div>
        )}
      </main>
      <StoreFooter />
    </div>
  )
}
