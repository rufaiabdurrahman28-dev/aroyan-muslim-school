'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'

interface PortalCardData {
  key: string
  name: string
  path: string
  description: string
  icon: React.ReactNode
}

const portalCards: PortalCardData[] = [
  {
    key: 'management',
    name: 'Management Portal',
    path: '/portal/management',
    description: 'Manage sections, review files, approve admissions',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 28, height: 28 }}>
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
  },
  {
    key: 'school',
    name: 'School Portal',
    path: '/portal/school',
    description: 'Upload files, manage class content',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 28, height: 28 }}>
        <path d="M3 21h18" />
        <path d="M5 21V7l8-4v18" />
        <path d="M19 21V11l-6-4" />
        <path d="M9 9h1" />
        <path d="M9 13h1" />
        <path d="M9 17h1" />
      </svg>
    ),
  },
  {
    key: 'teacher',
    name: 'Teacher Portal',
    path: '/portal/teacher',
    description: 'Track students, manage grades, attendance',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 28, height: 28 }}>
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
  },
  {
    key: 'student',
    name: 'Student Portal',
    path: '/portal/student',
    description: 'View assignments, results, report cards',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 28, height: 28 }}>
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
      </svg>
    ),
  },
  {
    key: 'helpdesk',
    name: 'Helpdesk',
    path: '/portal/helpdesk',
    description: 'Send messages, get support',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 28, height: 28 }}>
        <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
        <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
      </svg>
    ),
  },
]

export default function DashboardPage() {
  const router = useRouter()
  const { profile, portalAccess, loading, signOut, user } = useAuth()

  useEffect(() => {
    if (!loading && !profile && !user) {
      router.push('/login')
    }
  }, [loading, profile, user, router])

  function handleCardClick(card: PortalCardData) {
    if (!portalAccess || !portalAccess[card.key as keyof typeof portalAccess]) {
      alert("You don't have access to this portal")
      return
    }
    router.push(card.path)
  }

  async function handleLogout() {
    await signOut()
    router.push('/login')
  }

  if (loading) {
    return (
      <>
        <div className="D D1 D1-short">
          <Navbar />
          <section className="page-hero">
            <h1 className="page-hero-title">Dashboard</h1>
          </section>
        </div>
        <div className="D D2 D2-auto D2-center">
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ color: '#777', fontSize: '16px' }}>Loading...</p>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  if (!profile && !user) {
    return null
  }

  // If user is logged in but profile isn't loaded yet, wait a bit
  if (!profile && user) {
    return (
      <>
        <div className="D D1 D1-short">
          <Navbar />
          <section className="page-hero">
            <h1 className="page-hero-title">Dashboard</h1>
          </section>
        </div>
        <div className="D D2 D2-auto D2-center">
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ color: '#777', fontSize: '16px' }}>Setting up your profile...</p>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  const roleLabel = profile.role.charAt(0).toUpperCase() + profile.role.slice(1)

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          max-width: 1000px;
          width: 100%;
          padding: 40px 24px;
        }
        @media (max-width: 900px) {
          .dashboard-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 580px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
          }
        }
        .portal-card {
          background: #FFFFFF;
          border: 1.5px solid #E8E8E8;
          border-radius: 16px;
          padding: 28px 24px;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          min-height: 200px;
        }
        .portal-card:hover {
          border-color: #2D5F3F;
          box-shadow: 0 8px 28px rgba(45, 95, 63, 0.12);
          transform: translateY(-4px);
        }
        .portal-card-locked {
          opacity: 0.5;
          cursor: not-allowed;
          position: relative;
        }
        .portal-card-locked:hover {
          border-color: #DDD;
          box-shadow: none;
          transform: none;
        }
        .portal-card-locked::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 16px;
          pointer-events: none;
        }
        .portal-card-icon {
          width: 64px;
          height: 64px;
          background: linear-gradient(135deg, rgba(45, 95, 63, 0.1), rgba(201, 169, 97, 0.15));
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
          color: #2D5F3F;
        }
        .portal-card-title {
          font-size: 18px;
          font-weight: 700;
          color: #2D5F3F;
          margin: 0 0 8px;
        }
        .portal-card-desc {
          font-size: 14px;
          color: #777;
          line-height: 1.6;
          margin: 0;
        }
        .portal-card-lock-icon {
          position: absolute;
          top: 14px;
          right: 14px;
          width: 20px;
          height: 20px;
          color: #BBB;
        }
        .dashboard-welcome {
          text-align: center;
          max-width: 600px;
          margin: 0 auto;
          padding: 40px 24px 0;
        }
        .dashboard-welcome-name {
          font-size: 28px;
          font-weight: 700;
          color: #2D5F3F;
          margin: 0 0 8px;
        }
        .dashboard-welcome-sub {
          font-size: 16px;
          color: #555;
          margin: 0;
        }
        .role-badge {
          display: inline-block;
          padding: 4px 14px;
          background: linear-gradient(135deg, #2D5F3F, #1F4A2E);
          color: #FFFFFF;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          margin-left: 8px;
          vertical-align: middle;
        }
        .dashboard-logout-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 18px;
          background: transparent;
          border: 1.5px solid rgba(255, 255, 255, 0.4);
          border-radius: 8px;
          color: #FFFFFF;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-top: 12px;
        }
        .dashboard-logout-btn:hover {
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(255, 255, 255, 0.7);
        }
        .dashboard-logout-btn svg {
          width: 16px;
          height: 16px;
        }
      ` }} />

      {/* ==================== D1 - Header + Hero ==================== */}
      <div className="D D1 D1-short">
        <Navbar />
        <section className="page-hero" style={{ paddingBottom: '32px' }}>
          <h1 className="page-hero-title">Dashboard</h1>
          <p className="page-hero-subtitle">
            Your central hub for all Aroyan portals
          </p>
          <button className="dashboard-logout-btn" onClick={handleLogout}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Logout
          </button>
        </section>
      </div>

      {/* ==================== D2 - Dashboard Content ==================== */}
      <div className="D D2 D2-auto" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div className="dashboard-welcome">
          <h2 className="dashboard-welcome-name">
            Welcome back, {profile.full_name}
            <span className="role-badge">{roleLabel}</span>
          </h2>
          <p className="dashboard-welcome-sub">Select a portal to get started</p>
        </div>

        <div className="dashboard-grid">
          {portalCards.map((card) => {
            const isAccessible = portalAccess ? portalAccess[card.key as keyof typeof portalAccess] : false

            return (
              <div
                key={card.key}
                className={`portal-card${!isAccessible ? ' portal-card-locked' : ''}`}
                onClick={() => handleCardClick(card)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    handleCardClick(card)
                  }
                }}
              >
                {!isAccessible && (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="portal-card-lock-icon">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                )}
                <div className="portal-card-icon">
                  {card.icon}
                </div>
                <h3 className="portal-card-title">{card.name}</h3>
                <p className="portal-card-desc">{card.description}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* ==================== D3 - Footer ==================== */}
      <Footer />
    </>
  )
}
