import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useEffect } from 'react'

export function AdminLayout() {
  const { isAdmin, user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAdmin) navigate('/admin-portal/login', { replace: true })
  }, [isAdmin, navigate])

  if (!isAdmin) return null

  return (
    <div className="admin-shell">
      <aside className="admin-nav">
        <div className="logo" style={{ marginBottom: '0.75rem' }}>
          <div className="logo-mark">
            <span>ATO</span>
          </div>
          Admin
        </div>
        <p className="muted" style={{ color: '#94a3b8', margin: '0 0 0.75rem', fontSize: '0.8rem' }}>
          {user?.username}
        </p>
        <NavLink to="/admin" end>
          Dashboard
        </NavLink>
        <NavLink to="/admin/products">Products</NavLink>
        <NavLink to="/admin/orders">Orders</NavLink>
        <button
          className="btn btn-ghost"
          type="button"
          style={{
            width: '100%',
            marginTop: 'auto',
            color: '#fff',
            borderColor: 'rgba(255,255,255,0.2)',
          }}
          onClick={async () => {
            await logout()
            navigate('/admin-portal/login')
          }}
        >
          Logout
        </button>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  )
}
