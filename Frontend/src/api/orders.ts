import { apiRequest } from './client'
import type { AddressInput, EsewaPayload, Order, OrderStatus } from '../types'

export function createOrder(payload: {
  product: { product_id: number; quantity: number }
  current_address: { address: AddressInput } | { default_address: true }
}) {
  return apiRequest<Order>('/api/orders', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function getOrders() {
  return apiRequest<Order[]>('/api/orders')
}

export function getOrder(id: number) {
  return apiRequest<Order>(`/api/orders/${id}`)
}

export function updateOrderStatus(id: number, status: OrderStatus) {
  return apiRequest<Order>(`/api/orders/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })
}

export function deleteOrder(id: number) {
  return apiRequest(`/api/orders/${id}`, { method: 'DELETE' })
}

export function initiateEsewa(orderId: number) {
  return apiRequest<EsewaPayload>('/api/payments/esewa/initiate', {
    method: 'POST',
    body: JSON.stringify({
      order_id: orderId,
      return_url: 'http://localhost:8010',
    }),
  })
}
