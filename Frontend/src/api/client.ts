import type { ApiResponse } from '../types'

export class ApiError extends Error {
  status: number
  details?: unknown

  constructor(message: string, status = 400, details?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.details = details
  }
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const headers = new Headers(options.headers)

  if (!(options.body instanceof FormData) && !headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json')
  }

  const response = await fetch(path, {
    ...options,
    headers,
    credentials: 'include',
  })

  let data: ApiResponse<T>
  try {
    data = await response.json()
  } catch {
    throw new ApiError('Unexpected server response', response.status)
  }

  if (!response.ok || data.error) {
    throw new ApiError(data.message || 'Request failed', response.status, data.details)
  }

  return data
}
