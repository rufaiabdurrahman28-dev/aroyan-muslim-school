'use client'

import { useEffect, useState } from 'react'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'

/* ── Types ─────────────────────────────────────────── */
interface BannerContent {
  image?: string
  video?: string
  text?: string
}

interface Banner {
  id: string
  title: string
  description: string
  icon: string
  content: BannerContent
}

/* ── Default banners (used when no admin content saved) ── */
const DEFAULT_BANNERS: Banner[] = [
  {
    id: 'primary',
    title: 'Primary School',
    description:
      'Building a strong foundation in Quranic recitation, Islamic values, and core academics for young learners ages 6-12. Our nurturing environment helps children develop a love for learning and faith.',
    icon: 'primary',
    content: {
      text: 'Admission is open for Nursery 1 through Primary 6. We nurture young minds with a blend of Quranic studies and the national curriculum in a warm, caring atmosphere.',
    },
  },
  {
    id: 'junior',
    title: 'Junior Secondary',
    description:
      'Deepening knowledge and character for students ages 12-15. A balanced program of Islamic disciplines and junior WAEC preparation that builds confidence and academic skill.',
    icon: 'junior',
    content: {
      text: 'JSS 1-3 admission ongoing. Students receive comprehensive Islamic education alongside the junior secondary curriculum, preparing them for senior studies and beyond.',
    },
  },
  {
    id: 'senior',
    title: 'Senior Secondary',
    description:
      'Preparing future leaders ages 15-18 with advanced Islamic scholarship, WAEC/NECO readiness, and career guidance grounded in moral excellence and purpose.',
    icon: 'senior',
    content: {
      text: 'SSS 1-3 admission available. Choose from Science, Arts, or Commercial tracks while deepening your Quranic knowledge and Islamic understanding.',
    },
  },
]

const ADMIN_PASSWORD = 'aroyan2026'

/* ── Component ─────────────────────────────────────── */
export default function ApplyPage() {
  const [banners, setBanners] = useState<Banner[]>(DEFAULT_BANNERS)
  const [isAdminOpen, setIsAdminOpen] = useState(false)
  const [adminAuthenticated, setAdminAuthenticated] = useState(false)
  const [passwordInput, setPasswordInput] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null)
  const [editText, setEditText] = useState('')
  const [showApplyModal, setShowApplyModal] = useState<string | null>(null) // banner id

  /* Load saved banners from localStorage */
  useEffect(() => {
    const saved = localStorage.getItem('aroyan_banners')
    if (saved) {
      try {
        setBanners(JSON.parse(saved))
      } catch {
        setBanners(DEFAULT_BANNERS)
      }
    }
  }, [])

  /* Slide-in animation observer */
  useEffect(() => {
    const items = document.querySelectorAll('.admission-animate')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const item = entry.target as HTMLElement
            const index = Array.from(items).indexOf(item)
            setTimeout(() => {
              item.classList.add('slide-in-visible')
            }, index * 250)
            observer.unobserve(item)
          }
        })
      },
      { threshold: 0.15 }
    )

    items.forEach((item) => observer.observe(item))
    return () => {
      items.forEach((item) => observer.unobserve(item))
    }
  }, [isAdminOpen])

  /* ── Admin handlers ────────────────────────────────── */
  const handleAdminLogin = () => {
    if (passwordInput === ADMIN_PASSWORD) {
      setAdminAuthenticated(true)
      setPasswordError('')
      setPasswordInput('')
    } else {
      setPasswordError('Incorrect password. Please try again.')
    }
  }

  const saveBanners = (updated: Banner[]) => {
    setBanners(updated)
    localStorage.setItem('aroyan_banners', JSON.stringify(updated))
  }

  const openEditBanner = (banner: Banner) => {
    setEditingBanner(banner)
    setEditText(banner.content.text || '')
  }

  const handleDeleteContent = (bannerId: string, type: 'image' | 'video' | 'text') => {
    const updated = banners.map((b) => {
      if (b.id === bannerId) {
        const newContent = { ...b.content }
        delete newContent[type]
        return { ...b, content: newContent }
      }
      return b
    })
    saveBanners(updated)
  }

  /* ── Level icon SVGs ─────────────────────────────── */
  const LevelIcon = ({ type }: { type: string }) => {
    if (type === 'primary') {
      return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="banner-level-icon">
          <circle cx="32" cy="32" r="30" fill="rgba(45,95,63,0.08)" />
          <path d="M32 14l4 8h8l-6.5 5 2.5 8L32 30l-7.5 5 2.5-8L20.5 22h8l4-8z" fill="#C9A961" />
          <path d="M20 38v8h24v-8" stroke="#2D5F3F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M16 46h32" stroke="#2D5F3F" strokeWidth="2.5" strokeLinecap="round" />
          <rect x="24" y="34" width="16" height="4" rx="1" fill="#2D5F3F" opacity="0.3" />
        </svg>
      )
    }
    if (type === 'junior') {
      return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="banner-level-icon">
          <circle cx="32" cy="32" r="30" fill="rgba(45,95,63,0.08)" />
          <rect x="18" y="20" width="28" height="22" rx="3" stroke="#2D5F3F" strokeWidth="2.5" />
          <path d="M18 28h28" stroke="#2D5F3F" strokeWidth="2" />
          <path d="M26 20v-4h12v4" stroke="#2D5F3F" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="26" cy="36" r="2.5" fill="#C9A961" />
          <circle cx="38" cy="36" r="2.5" fill="#C9A961" />
          <path d="M16 42v4h32v-4" stroke="#2D5F3F" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      )
    }
    return (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="banner-level-icon">
        <circle cx="32" cy="32" r="30" fill="rgba(45,95,63,0.08)" />
        <path d="M32 16l3 6h7l-5.5 4.5 2 7L32 30l-6.5 3.5 2-7L22 22h7l3-6z" fill="#C9A961" />
        <path d="M22 36c0 6 4.5 12 10 12s10-6 10-12" stroke="#2D5F3F" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M26 40h12" stroke="#2D5F3F" strokeWidth="2" strokeLinecap="round" />
        <path d="M28 44h8" stroke="#2D5F3F" strokeWidth="2" strokeLinecap="round" />
        <path d="M16 48h32" stroke="#2D5F3F" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    )
  }

  return (
    <>
      {/* ==================== D1 - Header + Hero ==================== */}
      <div className="D D1 D1-short">
        <Navbar />
        <section className="page-hero">
          <h1 className="page-hero-title">Apply for Admission</h1>
          <p className="page-hero-subtitle">
            Choose a level and begin the application process for your child &mdash; no sign-up required
          </p>
        </section>
      </div>

      {/* ==================== D2 - Admission Banners ==================== */}
      <div className="D D2 D2-auto">
        <section className="admission-section">

          {/* ── 3 Banners ────────────────────────────────── */}
          <div className="admission-banners-grid">
            {banners.map((banner, idx) => (
              <div
                key={banner.id}
                className="admission-banner admission-animate"
                style={{ transitionDelay: `${idx * 0.15}s` }}
              >
                {/* Banner header with icon */}
                <div className="banner-header">
                  <LevelIcon type={banner.icon} />
                  <h3 className="banner-title">{banner.title}</h3>
                </div>

                {/* Banner description */}
                <p className="banner-description">{banner.description}</p>

                {/* Admin-posted content (image / video / text) */}
                <div className="banner-admin-content">
                  {banner.content.image && (
                    <div className="banner-content-item">
                      <img
                        src={banner.content.image}
                        alt={`${banner.title} content`}
                        className="banner-content-image"
                      />
                      {adminAuthenticated && (
                        <button
                          className="banner-content-delete"
                          onClick={() => handleDeleteContent(banner.id, 'image')}
                          title="Remove image"
                        >
                          &times;
                        </button>
                      )}
                    </div>
                  )}
                  {banner.content.video && (
                    <div className="banner-content-item">
                      <video
                        src={banner.content.video}
                        controls
                        className="banner-content-video"
                      />
                      {adminAuthenticated && (
                        <button
                          className="banner-content-delete"
                          onClick={() => handleDeleteContent(banner.id, 'video')}
                          title="Remove video"
                        >
                          &times;
                        </button>
                      )}
                    </div>
                  )}
                  {banner.content.text && (
                    <div className="banner-content-item">
                      <p className="banner-content-text">{banner.content.text}</p>
                      {adminAuthenticated && (
                        <button
                          className="banner-content-delete"
                          onClick={() => handleDeleteContent(banner.id, 'text')}
                          title="Remove text"
                        >
                          &times;
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Admin post content icons (visible when admin is logged in) */}
                {adminAuthenticated && (
                  <div className="banner-admin-actions">
                    <button
                      className="admin-post-icon"
                      onClick={() => {
                        setTimeout(() => {
                          document.getElementById(`img-upload-${banner.id}`)?.click()
                        }, 100)
                      }}
                      title="Upload Image"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                    </button>
                    <button
                      className="admin-post-icon"
                      onClick={() => {
                        setTimeout(() => {
                          document.getElementById(`vid-upload-${banner.id}`)?.click()
                        }, 100)
                      }}
                      title="Upload Video"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="23 7 16 12 23 17 23 7" />
                        <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                      </svg>
                    </button>
                    <button
                      className="admin-post-icon"
                      onClick={() => openEditBanner(banner)}
                      title="Add Text"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="17" y1="10" x2="3" y2="10" />
                        <line x1="21" y1="6" x2="3" y2="6" />
                        <line x1="21" y1="14" x2="3" y2="14" />
                        <line x1="17" y1="18" x2="3" y2="18" />
                      </svg>
                    </button>

                    {/* Hidden file inputs */}
                    <input
                      id={`img-upload-${banner.id}`}
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (!file) return
                        const reader = new FileReader()
                        reader.onloadend = () => {
                          const updated = banners.map((b) =>
                            b.id === banner.id
                              ? { ...b, content: { ...b.content, image: reader.result as string } }
                              : b
                          )
                          saveBanners(updated)
                        }
                        reader.readAsDataURL(file)
                      }}
                    />
                    <input
                      id={`vid-upload-${banner.id}`}
                      type="file"
                      accept="video/*"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (!file) return
                        const reader = new FileReader()
                        reader.onloadend = () => {
                          const updated = banners.map((b) =>
                            b.id === banner.id
                              ? { ...b, content: { ...b.content, video: reader.result as string } }
                              : b
                          )
                          saveBanners(updated)
                        }
                        reader.readAsDataURL(file)
                      }}
                    />
                  </div>
                )}

                {/* Apply button with animated pointing hand */}
                <div className="banner-apply-wrapper">
                  <button
                    className="banner-apply-btn"
                    onClick={() => setShowApplyModal(banner.id)}
                  >
                    <span className="apply-hand">👉</span> Apply
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ── Admin Panel Toggle ──────────────────────── */}
          <div className="admin-panel-toggle">
            <button
              className="admin-toggle-btn"
              onClick={() => {
                setIsAdminOpen(!isAdminOpen)
                if (!isAdminOpen) {
                  setAdminAuthenticated(false)
                  setPasswordInput('')
                  setPasswordError('')
                }
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="admin-toggle-icon">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              {isAdminOpen ? 'Close Admin Panel' : 'Admin Panel'}
            </button>
          </div>

          {/* ── Admin Panel ─────────────────────────────── */}
          {isAdminOpen && (
            <div className="admin-panel">
              {!adminAuthenticated ? (
                <div className="admin-login">
                  <h3 className="admin-login-title">Admin Access</h3>
                  <p className="admin-login-desc">Enter the admin password to manage banner content</p>
                  <div className="admin-login-form">
                    <input
                      type="password"
                      className="form-input"
                      placeholder="Enter admin password"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()}
                    />
                    {passwordError && <p className="admin-error">{passwordError}</p>}
                    <button className="form-submit-btn" onClick={handleAdminLogin}>
                      Unlock Admin
                    </button>
                  </div>
                </div>
              ) : (
                <div className="admin-dashboard">
                  <div className="admin-dashboard-header">
                    <h3 className="admin-dashboard-title">Banner Management</h3>
                    <button
                      className="admin-logout-btn"
                      onClick={() => {
                        setAdminAuthenticated(false)
                        setEditingBanner(null)
                      }}
                    >
                      Logout
                    </button>
                  </div>
                  <p className="admin-dashboard-desc">
                    Click the upload icons below each banner to add images or videos, or click the text icon to add or edit text content. You can also delete existing content with the &times; button.
                  </p>

                  {/* Edit text modal */}
                  {editingBanner && (
                    <div className="admin-edit-overlay">
                      <div className="admin-edit-modal">
                        <h4 className="admin-edit-title">Edit {editingBanner.title} - Text Content</h4>
                        <textarea
                          className="admin-edit-textarea"
                          rows={5}
                          placeholder="Enter text content for this banner..."
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                        />
                        <div className="admin-edit-actions">
                          <button
                            className="cta-btn cta-btn-outline"
                            onClick={() => {
                              setEditingBanner(null)
                              setEditText('')
                            }}
                          >
                            Cancel
                          </button>
                          <button
                            className="cta-btn cta-btn-filled"
                            onClick={() => {
                              if (!editingBanner) return
                              const updated = banners.map((b) =>
                                b.id === editingBanner.id
                                  ? { ...b, content: { ...b.content, text: editText } }
                                  : b
                              )
                              saveBanners(updated)
                              setEditingBanner(null)
                              setEditText('')
                            }}
                          >
                            Save Text
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </section>
      </div>

      {/* ==================== Apply Confirmation Modal ==================== */}
      {showApplyModal && (
        <div className="apply-modal-overlay" onClick={() => setShowApplyModal(null)}>
          <div className="apply-modal" onClick={(e) => e.stopPropagation()}>
            <button className="apply-modal-close" onClick={() => setShowApplyModal(null)}>
              &times;
            </button>
            <div className="apply-modal-icon">
              <LevelIcon type={banners.find((b) => b.id === showApplyModal)?.icon || 'primary'} />
            </div>
            <h3 className="apply-modal-title">
              {banners.find((b) => b.id === showApplyModal)?.title} Application
            </h3>
            <p className="apply-modal-desc">
              You are about to apply for the{' '}
              <strong>{banners.find((b) => b.id === showApplyModal)?.title}</strong> program.
              Click Continue to fill the application form. No sign-up required!
            </p>
            <div className="apply-modal-buttons">
              <a
                href={`/apply/${showApplyModal}`}
                className="cta-btn cta-btn-filled"
              >
                Continue to Application
              </a>
              <button
                className="cta-btn cta-btn-outline"
                onClick={() => setShowApplyModal(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== D3 - Footer ==================== */}
      <Footer />
    </>
  )
}
