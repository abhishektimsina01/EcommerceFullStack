import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

type PendingAction = (() => void) | null

interface AuthGateContextValue {
  open: boolean
  message: string
  requireAuth: (action?: () => void, message?: string) => boolean
  closeGate: () => void
  consumePending: () => void
}

const AuthGateContext = createContext<AuthGateContextValue | null>(null)

const DEFAULT_MSG = 'Please login or signup to continue'

export function AuthGateProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState(DEFAULT_MSG)
  const [pending, setPending] = useState<PendingAction>(null)

  const requireAuth = useCallback((action?: () => void, msg = DEFAULT_MSG) => {
    setMessage(msg)
    setPending(() => action ?? null)
    setOpen(true)
    return false
  }, [])

  const closeGate = useCallback(() => {
    setOpen(false)
    setPending(null)
  }, [])

  const consumePending = useCallback(() => {
    const fn = pending
    setOpen(false)
    setPending(null)
    fn?.()
  }, [pending])

  const value = useMemo(
    () => ({ open, message, requireAuth, closeGate, consumePending }),
    [open, message, requireAuth, closeGate, consumePending],
  )

  return <AuthGateContext.Provider value={value}>{children}</AuthGateContext.Provider>
}

export function useAuthGate() {
  const ctx = useContext(AuthGateContext)
  if (!ctx) throw new Error('useAuthGate must be used within AuthGateProvider')
  return ctx
}
