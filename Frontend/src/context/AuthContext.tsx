import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import * as authApi from '../api/auth'
import type { AddressInput, AuthUser, Role } from '../types'

const STORAGE_KEY = 'ato_user'

interface AuthContextValue {
  user: AuthUser | null
  isAuthenticated: boolean
  isAdmin: boolean
  isCustomer: boolean
  login: (email: string, password: string) => Promise<AuthUser>
  signup: (payload: {
    email: string
    password: string
    username: string
    phone_number: string
    role: Role
    address: AddressInput
  }) => Promise<AuthUser>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

function readStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as AuthUser) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => readStoredUser())

  const persist = useCallback((next: AuthUser | null) => {
    setUser(next)
    if (next) localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    else localStorage.removeItem(STORAGE_KEY)
  }, [])

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await authApi.login(email, password)
      const next: AuthUser = {
        id: res.details!.id,
        username: res.details!.username,
        role: res.details!.role,
      }
      persist(next)
      return next
    },
    [persist],
  )

  const signup = useCallback(
    async (payload: {
      email: string
      password: string
      username: string
      phone_number: string
      role: Role
      address: AddressInput
    }) => {
      const res = await authApi.signup(payload)
      const next: AuthUser = {
        id: res.details!.user_id,
        username: res.details!.username,
        role: payload.role,
      }
      persist(next)
      return next
    },
    [persist],
  )

  const logout = useCallback(async () => {
    try {
      await authApi.logout()
    } catch {
      // clear local session even if cookie already expired
    }
    persist(null)
  }, [persist])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === 'admin',
      isCustomer: user?.role === 'customer',
      login,
      signup,
      logout,
    }),
    [user, login, signup, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
