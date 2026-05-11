'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { isSupabaseConfigured } from '@/lib/supabase'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { signIn, loading: authLoading, profile } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('student')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [signupSuccess, setSignupSuccess] = useState(false)

  useEffect(() => {
    if (searchParams.get('signup') === 'success') {
      setSignupSuccess(true)
    }
  }, [searchParams])

  useEffect(() => {
    if (!authLoading && profile) {
      router.push('/dashboard')
    }
  }, [authLoading, profile, router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await signIn(email, password)
      if (result.error) {
        setError(result.error)
      } else {
        router.push('/dashboard')
      }
    } catch {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .auth-notice {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 20px;
          background: rgba(201, 169, 97, 0.1);
          border: 1px solid rgba(201, 169, 97, 0.3);
          border-radius: 12px;
          margin-bottom: 24px;
        }
        .auth-notice-icon {
          width: 24px;
          height: 24px;
          min-width: 24px;
          color: #C9A961;
        }
        .auth-notice-text {
          font-size: 14px;
          color: #555;
          line-height: 1.6;
          margin: 0;
        }
        .auth-error {
          padding: 12px 16px;
          background: rgba(220, 53, 69, 0.08);
          border: 1px solid rgba(220, 53, 69, 0.25);
          border-radius: 8px;
          color: #dc3545;
          font-size: 13px;
          font-weight: 500;
          margin: 0;
        }
        .auth-success {
          padding: 12px 16px;
          background: rgba(45, 95, 63, 0.08);
          border: 1px solid rgba(45, 95, 63, 0.25);
          border-radius: 8px;
          color: #2D5F3F;
          font-size: 13px;
          font-weight: 500;
          margin: 0;
        }
        .form-submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
        .form-submit-btn:disabled:hover {
          background-color: #2D5F3F;
          transform: none;
        }
      ` }} />

      {/* ==================== D1 - Header + Hero ==================== */}
      <div className="D D1 D1-short">
        <Navbar />
        <section className="page-hero">
          <h1 className="page-hero-title">Welcome Back</h1>
          <p className="page-hero-subtitle">
            Sign in to access your Aroyan student portal
          </p>
        </section>
      </div>

      {/* ==================== D2 - Login Form ==================== */}
      <div className="D D2 D2-auto D2-center">
        <section className="auth-section">
          <div className="auth-card">
            <div className="auth-card-header">
              <img
                src="/InShot_20260507_212731657.jpg"
                alt="Aroyan Logo"
                className="auth-logo"
              />
              <h2 className="auth-title">Sign In</h2>
              <p className="auth-subtitle">Enter your credentials to continue</p>
            </div>

            {!isSupabaseConfigured ? (
              <div className="auth-notice">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="auth-notice-icon">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <p className="auth-notice-text">
                  Authentication will be available once the backend is connected. Please check back soon.
                </p>
              </div>
            ) : (
              <form className="auth-form" onSubmit={handleSubmit}>
                {signupSuccess && (
                  <p className="auth-success">
                    Account created successfully! Please sign in with your credentials.
                  </p>
                )}

                {error && (
                  <p className="auth-error">{error}</p>
                )}

                <div className="form-group">
                  <label htmlFor="email" className="form-label">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    className="form-input"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    type="password"
                    id="password"
                    className="form-input"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="role" className="form-label">I am signing in as...</label>
                  <select
                    id="role"
                    className="form-input form-select"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    disabled={loading}
                  >
                    <option value="student">Student</option>
                    <option value="parent">Parent / Guardian</option>
                    <option value="teacher">Teacher</option>
                    <option value="management">Management</option>
                  </select>
                </div>

                <div className="form-row">
                  <label className="form-checkbox-label">
                    <input type="checkbox" className="form-checkbox" />
                    <span>Remember me</span>
                  </label>
                  <a href="#" className="form-link">Forgot Password?</a>
                </div>

                <button
                  type="submit"
                  className="form-submit-btn"
                  disabled={loading}
                >
                  {loading ? 'Signing in...' : 'Login'}
                </button>
              </form>
            )}

            <div className="auth-footer">
              <p>Don&apos;t have an account? <a href="/signup" className="form-link-bold">Sign Up</a></p>
            </div>
          </div>
        </section>
      </div>

      {/* ==================== D3 - Footer ==================== */}
      <Footer />
    </>
  )
}
