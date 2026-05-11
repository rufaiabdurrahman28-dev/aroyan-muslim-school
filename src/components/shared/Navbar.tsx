'use client'

import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'

export default function Navbar() {
  const pathname = usePathname()
  const { profile, signOut } = useAuth()
  const isLoggedIn = !!profile

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true
    if (path !== '/' && pathname.startsWith(path)) return true
    return false
  }

  const handleNavClick = (path: string) => {
    window.location.href = path
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <a href="/">
          <img
            src="/school-logo.png"
            alt="Aroyan Muslim School"
            className="navbar-logo-brand"
          />
        </a>
      </div>
      <div className="navbar-links">
        <a href="/" className={`nav-link ${isActive('/') && pathname === '/' ? 'nav-link-active' : ''}`}>Home</a>
        <a href="/about" className={`nav-link ${isActive('/about') ? 'nav-link-active' : ''}`}>About</a>
        <a href="/admission" className={`nav-link ${isActive('/admission') ? 'nav-link-active' : ''}`}>Admission</a>

        {isLoggedIn ? (
          <>
            <a href="/dashboard" className={`nav-link ${isActive('/dashboard') || isActive('/portal') ? 'nav-link-active' : ''}`}>Dashboard</a>
            <button
              onClick={signOut}
              className="nav-link"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#C9A961', fontWeight: 600 }}
            >
              Logout
            </button>
          </>
        ) : (
          <a href="/login" className={`nav-link ${isActive('/login') ? 'nav-link-active' : ''}`}>Login</a>
        )}

        <a href="/apply" className="nav-cta-btn"><span className="apply-hand">👉</span> Apply for Admission</a>
      </div>
      {/* Mobile hamburger */}
      <button
        className="mobile-menu-btn"
        onClick={() => {
          const links = document.querySelector('.navbar-links')
          links?.classList.toggle('mobile-open')
        }}
        aria-label="Toggle navigation menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
    </nav>
  )
}
