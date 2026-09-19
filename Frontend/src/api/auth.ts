import { apiRequest } from './client'
import type { AddressInput, LoginDetails, Role, SignupDetails } from '../types'

export function login(email: string, password: string) {
  return apiRequest<LoginDetails>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export function signup(payload: {
  email: string
  password: string
  username: string
  phone_number: string
  role: Role
  address: AddressInput
}) {
  return apiRequest<SignupDetails>('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function logout() {
  return apiRequest('/api/auth/logout', { method: 'GET' })
}
