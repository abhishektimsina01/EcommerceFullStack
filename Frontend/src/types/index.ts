export type Role = 'customer' | 'admin'

export type ProductType =
  | 'electronics'
  | 'clothing'
  | 'footwear'
  | 'books'
  | 'beauty'
  | 'home'
  | 'sports'
  | 'toys'
  | 'groceries'
  | 'accessories'
  | 'other'

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'delivered'
  | 'canceled'

export interface ApiResponse<T = unknown> {
  error: boolean
  message: string
  details?: T
  name?: string
}

export interface AuthUser {
  id: number
  username: string
  role: Role
}

export interface LoginDetails {
  id: number
  username: string
  role: Role
  access_token: string
  refresh_token: string
}

export interface SignupDetails {
  user_id: number
  username: string
  customer_id?: number
  admin_id?: number
  access_token: string
  refresh_token: string
}

export interface AddressInput {
  city: string
  state: string
  postal_code?: string
  address_line?: string
}

export interface Product {
  product_id: number
  product_name: string
  product_type: ProductType
  product_image?: string | null
  price: number
  stock?: number
  description?: string | null
}

export interface CartItem {
  cart_item_id: number
  quantity?: number
  product_item: Product
}

export interface OrderProduct {
  product_id: number
  product_name: string
  product_image?: string | null
  description?: string | null
}

export interface OrderAddress {
  address_id: number
  city: string
  state: string
  address_line?: string | null
  postal_code?: string | null
  created_at?: string
}

export interface OrderCustomerUser {
  user_id: number
  username: string
  phone_number?: string | number | null
  email?: string | null
}

export interface OrderCustomer {
  customer_id: number
  user: OrderCustomerUser
}

export interface Order {
  order_id: number
  price: number
  quantity: number
  status: OrderStatus
  payment_id?: number | null
  product?: OrderProduct | null
  address?: OrderAddress
  customer?: OrderCustomer
  total?: number
}

export interface EsewaPayload {
  action: string
  fields: Record<string, string>
}

export const PRODUCT_CATEGORIES: { value: ProductType | ''; label: string }[] = [
  { value: '', label: 'All' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'clothing', label: 'Clothing' },
  { value: 'footwear', label: 'Footwear' },
  { value: 'books', label: 'Books' },
  { value: 'beauty', label: 'Beauty' },
  { value: 'home', label: 'Home' },
  { value: 'sports', label: 'Sports' },
  { value: 'toys', label: 'Toys' },
  { value: 'groceries', label: 'Groceries' },
  { value: 'accessories', label: 'Accessories' },
  { value: 'other', label: 'Other' },
]

export const ORDER_STATUSES: OrderStatus[] = [
  'pending',
  'confirmed',
  'processing',
  'delivered',
  'canceled',
]
