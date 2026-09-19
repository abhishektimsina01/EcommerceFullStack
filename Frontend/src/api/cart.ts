import { apiRequest } from './client'
import type { CartItem } from '../types'

export function getCart() {
  return apiRequest<CartItem[]>('/api/cart')
}

export function addToCart(productId: number) {
  return apiRequest(`/api/cart/${productId}`, { method: 'GET' })
}

export function removeFromCart(productId: number) {
  return apiRequest('/api/cart', {
    method: 'DELETE',
    body: JSON.stringify({ itemIds: [productId] }),
  })
}

export function updateCartQuantity(productId: number, quantity: number) {
  return apiRequest(`/api/cart/${productId}`, {
    method: 'PATCH',
    body: JSON.stringify({ quantity }),
  })
}
