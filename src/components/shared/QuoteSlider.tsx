'use client'

import { useState, useEffect } from 'react'

interface QuoteItem {
  text: string
  source: string
  type: 'hadith' | 'quran' | 'wisdom'
}

const QUOTES: QuoteItem[] = [
  {
    text: 'The seeking of knowledge is obligatory upon every Muslim.',
    source: 'Prophet Muhammad (PBUH) — Sunan Ibn Majah',
    type: 'hadith',
  },
  {
    text: 'Whoever treads a path in search of knowledge, Allah will make easy for him the path to Paradise.',
    source: 'Prophet Muhammad (PBUH) — Sahih Muslim',
    type: 'hadith',
  },
  {
    text: 'Read! In the name of your Lord who created.',
    source: 'Quran 96:1',
    type: 'quran',
  },
  {
    text: 'The best among you are those who have the best manners and character.',
    source: 'Prophet Muhammad (PBUH) — Sahih Bukhari',
    type: 'hadith',
  },
  {
    text: 'Education is the most powerful weapon which you can use to change the world.',
    source: 'Nelson Mandela',
    type: 'wisdom',
  },
  {
    text: 'The ink of the scholar is more holy than the blood of the martyr.',
    source: 'Prophet Muhammad (PBUH)',
    type: 'hadith',
  },
  {
    text: 'Indeed, with hardship comes ease.',
    source: 'Quran 94:6',
    type: 'quran',
  },
  {
    text: 'Seek knowledge from the cradle to the grave.',
    source: 'Prophet Muhammad (PBUH)',
    type: 'hadith',
  },
  {
    text: 'The beautiful thing about learning is that nobody can take it away from you.',
    source: 'B.B. King',
    type: 'wisdom',
  },
  {
    text: 'Whoever does not thank people, does not thank Allah.',
    source: 'Prophet Muhammad (PBUH) — Sunan Abi Dawud',
    type: 'hadith',
  },
]

export default function QuoteSlider() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % QUOTES.length)
        setIsAnimating(false)
      }, 400)
    }, 8000)

    return () => clearInterval(interval)
  }, [])

  const quote = QUOTES[currentIndex]

  const typeLabel = quote.type === 'hadith' ? 'Hadith' : quote.type === 'quran' ? 'Quran' : 'Wisdom'
  const typeColor = quote.type === 'hadith' ? '#C9A961' : quote.type === 'quran' ? '#2D5F3F' : '#6B7280'
  const typeBg = quote.type === 'hadith' ? 'rgba(201, 169, 97, 0.12)' : quote.type === 'quran' ? 'rgba(45, 95, 63, 0.1)' : 'rgba(107, 114, 128, 0.1)'

  return (
    <div style={{
      background: 'linear-gradient(135deg, #1F3D2A 0%, #2D5F3F 50%, #1F3D2A 100%)',
      borderRadius: '14px',
      padding: '20px 28px',
      marginBottom: '24px',
      position: 'relative',
      overflow: 'hidden',
      border: '1px solid rgba(201, 169, 97, 0.15)',
    }}>
      {/* Decorative mosque silhouette */}
      <div style={{
        position: 'absolute',
        right: '-10px',
        top: '-10px',
        opacity: 0.06,
        fontSize: '120px',
        color: '#C9A961',
        lineHeight: 1,
        pointerEvents: 'none',
      }}>
        ☪
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '14px',
        opacity: isAnimating ? 0 : 1,
        transform: isAnimating ? 'translateY(8px)' : 'translateY(0)',
        transition: 'all 0.4s ease',
      }}>
        {/* Quote icon */}
        <div style={{
          minWidth: '36px',
          height: '36px',
          background: 'rgba(201, 169, 97, 0.15)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#C9A961',
          fontSize: '18px',
          fontWeight: 700,
          fontFamily: 'Georgia, serif',
        }}>
          "
        </div>

        <div style={{ flex: 1 }}>
          <p style={{
            color: '#FFFFFF',
            fontSize: '15px',
            lineHeight: 1.7,
            margin: '0 0 10px',
            fontStyle: 'italic',
            fontWeight: 400,
          }}>
            {quote.text}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <span style={{
              display: 'inline-block',
              padding: '2px 10px',
              borderRadius: '12px',
              fontSize: '11px',
              fontWeight: 600,
              backgroundColor: typeBg,
              color: typeColor,
              border: `1px solid ${typeColor}33`,
            }}>
              {typeLabel}
            </span>
            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>
              — {quote.source}
            </span>
          </div>
        </div>
      </div>

      {/* Progress dots */}
      <div style={{
        display: 'flex',
        gap: '4px',
        justifyContent: 'center',
        marginTop: '14px',
      }}>
        {QUOTES.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setIsAnimating(true)
              setTimeout(() => {
                setCurrentIndex(i)
                setIsAnimating(false)
              }, 400)
            }}
            style={{
              width: i === currentIndex ? '16px' : '6px',
              height: '6px',
              borderRadius: '3px',
              backgroundColor: i === currentIndex ? '#C9A961' : 'rgba(255,255,255,0.25)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              padding: 0,
            }}
          />
        ))}
      </div>
    </div>
  )
}
