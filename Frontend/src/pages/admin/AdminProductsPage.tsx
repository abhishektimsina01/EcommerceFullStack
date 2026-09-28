import { type FormEvent, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { createProduct, deleteProduct, getProducts, updateProduct } from '../../api/products'
import { PRODUCT_CATEGORIES, type Product, type ProductType } from '../../types'
import { formatPrice, resolveImageUrl } from '../../utils/format'

const emptyForm = {
  product_name: '',
  product_type: 'electronics' as ProductType,
  price: '',
  stock: '',
  description: '',
}

export function AdminProductsPage() {
  const [params, setParams] = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [form, setForm] = useState(emptyForm)
  const [image, setImage] = useState<File | null>(null)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const nameInputRef = useRef<HTMLInputElement>(null)
  const handledEditParam = useRef(false)

  async function load() {
    setLoading(true)
    try {
      const res = await getProducts()
      setProducts(res.details ?? [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  // Open directly in edit mode when arriving from the dashboard with ?edit=<id>
  useEffect(() => {
    if (handledEditParam.current) return
    const editId = params.get('edit')
    if (!editId || products.length === 0) return
    const target = products.find((p) => p.product_id === Number(editId))
    if (target) {
      handledEditParam.current = true
      startEdit(target)
      const next = new URLSearchParams(params)
      next.delete('edit')
      setParams(next, { replace: true })
    }
  }, [params, products, setParams])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setMessage('')
    try {
      if (editingId) {
        await updateProduct(editingId, {
          product_name: form.product_name,
          product_type: form.product_type,
          price: Number(form.price),
          stock: Number(form.stock),
          description: form.description || undefined,
        })
        setMessage('Product updated')
      } else {
        const data = new FormData()
        data.append('product_name', form.product_name)
        data.append('product_type', form.product_type)
        data.append('price', form.price)
        data.append('stock', form.stock)
        if (form.description) data.append('description', form.description)
        if (image) data.append('image', image)
        await createProduct(data)
        setMessage('Product created')
      }
      setForm(emptyForm)
      setImage(null)
      setEditingId(null)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed')
    }
  }

  function startEdit(product: Product) {
    setError('')
    setMessage('')
    setImage(null)
    setEditingId(product.product_id)
    setForm({
      product_name: product.product_name,
      product_type: product.product_type,
      price: String(product.price),
      stock: String(product.stock ?? 0),
      description: product.description || '',
    })
    requestAnimationFrame(() => nameInputRef.current?.focus())
  }

  function cancelEdit() {
    setEditingId(null)
    setForm(emptyForm)
    setImage(null)
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this product?')) return
    try {
      await deleteProduct(id)
      setMessage('Product deleted')
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed')
    }
  }

  return (
    <div className="fade-up">
      <div className="section-head">
        <h1 className="brand-font" style={{ margin: 0 }}>
          Manage products
        </h1>
      </div>
      {error && <div className="alert alert-error">{error}</div>}
      {message && <div className="alert alert-success">{message}</div>}

      <div className="admin-manage-layout">
        <form onSubmit={handleSubmit} className="list-panel admin-form-card">
          <div className="admin-form-head">
            <h3>{editingId ? 'Edit product' : 'Add product'}</h3>
            {editingId ? (
              <span className="status-badge">Editing #{editingId}</span>
            ) : (
              <span className="muted" style={{ fontSize: '0.75rem' }}>
                New item
              </span>
            )}
          </div>

          <div className="admin-form-body">
            <div className="field">
              <label>Name</label>
              <input
                ref={nameInputRef}
                required
                placeholder="e.g. Wireless headphones"
                value={form.product_name}
                onChange={(e) => setForm({ ...form, product_name: e.target.value })}
              />
            </div>
            <div className="field">
              <label>Category</label>
              <select
                value={form.product_type}
                onChange={(e) => setForm({ ...form, product_type: e.target.value as ProductType })}
              >
                {PRODUCT_CATEGORIES.filter((c) => c.value).map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-grid">
              <div className="field">
                <label>Price (Rs.)</label>
                <input
                  type="number"
                  min={1}
                  required
                  placeholder="0"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                />
              </div>
              <div className="field">
                <label>Stock</label>
                <input
                  type="number"
                  min={0}
                  required
                  placeholder="0"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                />
              </div>
            </div>
            <div className="field">
              <label>Description</label>
              <textarea
                rows={3}
                placeholder="Short description shown to customers"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            {editingId ? (
              <p className="muted" style={{ fontSize: '0.72rem', margin: 0 }}>
                Image can only be set when a product is first created.
              </p>
            ) : (
              <div className="field">
                <label>Image</label>
                <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] ?? null)} />
                {image && <span className="muted" style={{ fontSize: '0.72rem' }}>{image.name}</span>}
              </div>
            )}
          </div>

          <div className="action-row admin-form-actions">
            <button className="btn btn-primary" type="submit">
              {editingId ? 'Save changes' : 'Create product'}
            </button>
            {editingId && (
              <button className="btn btn-ghost" type="button" onClick={cancelEdit}>
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="admin-table-wrap">
          {loading ? (
            <div className="spinner" />
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Price</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.product_id} className={editingId === product.product_id ? 'row-active' : ''}>
                    <td>
                      <img src={resolveImageUrl(product.product_image)} alt="" />
                    </td>
                    <td>{product.product_name}</td>
                    <td>{product.product_type}</td>
                    <td>{formatPrice(product.price)}</td>
                    <td>
                      <div className="action-row">
                        <button className="btn btn-ghost" type="button" onClick={() => startEdit(product)}>
                          Edit
                        </button>
                        <button className="btn btn-danger" type="button" onClick={() => handleDelete(product.product_id)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
