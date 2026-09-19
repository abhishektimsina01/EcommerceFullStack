import { type FormEvent, useEffect, useState } from 'react'
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
  const [products, setProducts] = useState<Product[]>([])
  const [form, setForm] = useState(emptyForm)
  const [image, setImage] = useState<File | null>(null)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)

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
    setEditingId(product.product_id)
    setForm({
      product_name: product.product_name,
      product_type: product.product_type,
      price: String(product.price),
      stock: String(product.stock ?? 0),
      description: product.description || '',
    })
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
        <form onSubmit={handleSubmit} className="list-panel">
          <h3 style={{ margin: '0 0 0.5rem', fontSize: '0.95rem' }}>
            {editingId ? 'Edit product' : 'Add product'}
          </h3>
          <div className="form-grid">
            <div className="field">
              <label>Name</label>
              <input
                required
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
          </div>
          <div className="form-grid">
            <div className="field">
              <label>Price</label>
              <input
                type="number"
                min={1}
                required
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
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
              />
            </div>
          </div>
          <div className="field">
            <label>Description</label>
            <textarea
              rows={2}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          {!editingId && (
            <div className="field">
              <label>Image</label>
              <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] ?? null)} />
            </div>
          )}
          <div className="action-row">
            <button className="btn btn-primary" type="submit">
              {editingId ? 'Update' : 'Create'}
            </button>
            {editingId && (
              <button
                className="btn btn-ghost"
                type="button"
                onClick={() => {
                  setEditingId(null)
                  setForm(emptyForm)
                }}
              >
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
                  <tr key={product.product_id}>
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
