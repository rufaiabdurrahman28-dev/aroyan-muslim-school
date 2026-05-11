'use client'

import { useEffect } from 'react'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'

export default function Home() {
  useEffect(() => {
    const cards = document.querySelectorAll('.feature-card')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const card = entry.target as HTMLElement
            const cardIndex = Array.from(cards).indexOf(card)
            setTimeout(() => {
              card.classList.add('slide-in-visible')
            }, cardIndex * 200)
            observer.unobserve(card)
          }
        })
      },
      { threshold: 0.2 }
    )

    cards.forEach((card) => observer.observe(card))

    return () => {
      cards.forEach((card) => observer.unobserve(card))
    }
  }, [])

  // Get greeting based on time of day
  function getGreeting() {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 17) return 'Good Afternoon'
    return 'Good Evening'
  }

  return (
    <>
      {/* ==================== Welcome Greeting Banner ==================== */}
      <div className="welcome-greeting-banner">
        <div className="greeting-text">
          <span className="greeting-salam">As-salamu Alaykum!</span>{' '}
          <span className="greeting-time">{getGreeting()}</span> — Welcome to Aroyan Muslim School ☪
        </div>
        <div className="greeting-brand">
          <img
            src="/school-logo.png"
            alt="Aroyan Muslim School Logo"
            className="greeting-logo"
          />
          <span className="greeting-school-name">Aroyan Muslim School</span>
        </div>
      </div>

      {/* ==================== D1 - Header + Hero ==================== */}
      <div className="D D1">
        <Navbar />

        {/* Hero Section */}
        <section className="hero">
          <img
            src="/school-logo.png"
            alt="Aroyan Muslim School"
            className="aroyan-logo"
          />
          <h1 className="hero-headline">Aroyan Muslim School</h1>
          <h2 className="hero-subheadline">Quranic Memorization & Western Education Combined</h2>
          <p className="hero-intro">
            Aroyan is a Muslim school dedicated to Quranic memorization and Islamic disciplines
            alongside Western education. We provide a conducive learning environment for students
            to grow academically and spiritually through our Saturday and Sunday Madrasah programs.
          </p>
          <div className="hero-cta-buttons">
            <a href="/login" className="cta-btn cta-btn-outline">Login</a>
            <a href="/signup" className="cta-btn cta-btn-filled">Sign Up</a>
          </div>
        </section>
      </div>

      {/* ==================== D2 - Feature Cards ==================== */}
      <div className="D D2">
        <section className="features-section">
          <div className="feature-card">
            <div className="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feature-svg">
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
              </svg>
            </div>
            <h3 className="feature-title">Quranic Memorization</h3>
            <p className="feature-desc">
              Our dedicated Hifz program guides students through the complete memorization of the
              Holy Quran with certified Islamic scholars, ensuring proper Tajweed and deep understanding
              of the sacred text.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feature-svg">
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                <line x1="16" x2="16" y1="2" y2="6" />
                <line x1="8" x2="8" y1="2" y2="6" />
                <line x1="3" x2="21" y1="10" y2="10" />
              </svg>
            </div>
            <h3 className="feature-title">Saturday & Sunday Madrasah</h3>
            <p className="feature-desc">
              Our weekend Madrasah program offers flexible learning for students who attend
              conventional schools during the week, providing comprehensive Islamic education
              on Saturdays and Sundays.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feature-svg">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
            <h3 className="feature-title">Academic Excellence</h3>
            <p className="feature-desc">
              We blend rigorous Western academic curriculum with Islamic studies, producing
              well-rounded students who excel in both spheres and are prepared for future
              academic and professional challenges.
            </p>
          </div>
        </section>
      </div>

      {/* ==================== D3 - Footer ==================== */}
      <Footer />
    </>
  )
}
