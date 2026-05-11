'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { isSupabaseConfigured } from '@/lib/supabase'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import type { Role } from '@/lib/types'

export default function SignupPage() {
  const router = useRouter()
  const { signUp, loading: authLoading, profile } = useAuth()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState<Role>('student')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!authLoading && profile) {
      router.push('/dashboard')
    }
  }, [authLoading, profile, router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.')
      return
    }

    setLoading(true)

    try {
      const result = await signUp(email, password, fullName, role)
      if (result.error) {
        setError(result.error)
      } else {
        router.push('/login?signup=success')
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
        .form-submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
        .form-submit-btn:disabled:hover {
          background-color: #2D5F3F;
          transform: none;
        }
        .signup-no-management {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          background: rgba(45, 95, 63, 0.04);
          border-radius: 8px;
          margin-top: -8px;
          margin-bottom: 4px;
        }
        .signup-no-management svg {
          width: 16px;
          height: 16px;
          min-width: 16px;
          color: #2D5F3F;
        }
        .signup-no-management span {
          font-size: 12px;
          color: #777;
          line-height: 1.4;
        }
      ` }} />

      {/* ==================== D1 - Header + Hero ==================== */}
      <div className="D D1 D1-short">
        <Navbar />
        <section className="page-hero">
          <h1 className="page-hero-title">Create Account</h1>
          <p className="page-hero-subtitle">
            Join Aroyan Muslim School and start your journey
          </p>
        </section>
      </div>

      {/* ==================== D2 - Sign Up Form ==================== */}
      <div className="D D2 D2-auto D2-center">
        <section className="auth-section">
          <div className="auth-card auth-card-wide">
            <div className="auth-card-header">
              <img
                src="/mosque-logo.jpg"
                alt="Aroyan Logo"
                className="auth-logo"
              />
              <h2 className="auth-title">Sign Up</h2>
              <p className="auth-subtitle">Create your account to get started</p>
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
                {error && (
                  <p className="auth-error">{error}</p>
                )}

                <div className="form-group">
                  <label htmlFor="fullName" className="form-label">Full Name</label>
                  <input
                    type="text"
                    id="fullName"
                    className="form-input"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="signupEmail" className="form-label">Email Address</label>
                  <input
                    type="email"
                    id="signupEmail"
                    className="form-input"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-row-2col">
                  <div className="form-group">
                    <label htmlFor="signupPassword" className="form-label">Password</label>
                    <input
                      type="password"
                      id="signupPassword"
                      className="form-input"
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      disabled={loading}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      className="form-input"
                      placeholder="Confirm password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={6}
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="role" className="form-label">I am a...</label>
                  <select
                    id="role"
                    className="form-input form-select"
                    value={role}
                    onChange={(e) => setRole(e.target.value as Role)}
                    required
                    disabled={loading}
                  >
                    <option value="student">Student</option>
                    <option value="parent">Parent / Guardian</option>
                    <option value="teacher">Teacher</option>
                  </select>
                </div>

                <div className="signup-no-management">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                  </svg>
                  <span>Management accounts are created by the admin only. Contact the school if you need a management account.</span>
                </div>

                <label className="form-checkbox-label">
                  <input type="checkbox" className="form-checkbox" required disabled={loading} />
                  <span>I agree to the terms and conditions of Aroyan Muslim School</span>
                </label>

                <button
                  type="submit"
                  className="form-submit-btn"
                  disabled={loading}
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
              </form>
            )}

            <div className="auth-footer">
              <p>Already have an account? <a href="/login" className="form-link-bold">Login</a></p>
            </div>
          </div>
        </section>
      </div>

      {/* ==================== D3 - Footer ==================== */}
      <Footer />
    </>
  )
}
