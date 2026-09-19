import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export function StoreHeader({
  search,
  onSearch,
}: {
  search?: string
  onSearch?: (value: string) => void
}) {
  const { user, isAuthenticated, isCustomer, logout } = useAuth()
  const navigate = useNavigate()
  const [localSearch, setLocalSearch] = useState(search ?? '')

  function submitSearch(e: FormEvent) {
    e.preventDefault()
    onSearch?.(localSearch)
    if (!onSearch) navigate(`/?q=${encodeURIComponent(localSearch)}`)
  }

  async function handleLogout() {
    await logout()
    navigate('/')
  }

  return (
    <header className="store-header">
      <div className="header-inner">
        <Link to="/" className="logo">
          <div className="logo-mark">
            <span>ATO</span>
          </div>
          ATO Store
        </Link>

        <form className="search-bar" onSubmit={submitSearch}>
          <input
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search in ATO Store"
            aria-label="Search products"
          />
          <button type="submit">Search</button>
        </form>

        <div className="header-actions">
          {isAuthenticated && isCustomer ? (
            <>
              <span className="header-chip">Hi, {user?.username}</span>
              <Link className="header-link" to="/cart">
                Cart
              </Link>
              <Link className="header-link" to="/orders">
                Orders
              </Link>
              <button
                className="btn btn-ghost"
                type="button"
                onClick={handleLogout}
                style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.2)' }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="header-link" to="/customer/login">
                Login
              </Link>
              <Link className="btn btn-primary" to="/customer/signup">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
