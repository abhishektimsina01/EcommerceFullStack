import { apiRequest } from './client'
import type { Product, ProductType } from '../types'

export interface ProductFilters {
  product_type?: ProductType | ''
  min?: number
  max?: number
  stock?: number
}

export function getProducts(filters: ProductFilters = {}) {
  const params = new URLSearchParams()
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== '' && value !== null) {
      params.set(key, String(value))
    }
  })
  const query = params.toString()
  return apiRequest<Product[]>(`/api/products${query ? `?${query}` : ''}`)
}

export function getRecommendedProducts(filters: ProductFilters = {}) {
  const params = new URLSearchParams()
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== '' && value !== null) {
      params.set(key, String(value))
    }
  })
  const query = params.toString()
  return apiRequest<Product[]>(`/api/products/recommended${query ? `?${query}` : ''}`)
}

export function getProduct(id: number) {
  return apiRequest<Product>(`/api/product/${id}`)
}

export function createProduct(formData: FormData) {
  return apiRequest<Product>('/api/products', {
    method: 'POST',
    body: formData,
  })
}

export function updateProduct(id: number, data: Partial<Product>) {
  return apiRequest<Product>(`/api/product/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}

export function deleteProduct(id: number) {
  return apiRequest(`/api/product/${id}`, { method: 'DELETE' })
}
