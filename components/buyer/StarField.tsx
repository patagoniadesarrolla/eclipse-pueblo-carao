'use client'

import { useEffect, useRef } from 'react'

interface Star {
  x: number
  y: number
  size: number
  opacity: number
  duration: number
  twinkle: boolean
}

export default function StarField() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const stars: Star[] = Array.from({ length: 150 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.7 + 0.3,
      duration: Math.random() * 3 + 2,
      twinkle: Math.random() > 0.6,
    }))

    stars.forEach((star) => {
      const el = document.createElement('div')
      el.style.cssText = `
        position: absolute;
        left: ${star.x}%;
        top: ${star.y}%;
        width: ${star.size}px;
        height: ${star.size}px;
        background: white;
        border-radius: 50%;
        opacity: ${star.opacity};
        pointer-events: none;
        ${star.twinkle ? `animation: starTwinkle ${star.duration}s ease-in-out infinite alternate;` : ''}
      `
      container.appendChild(el)
    })

    return () => { container.innerHTML = '' }
  }, [])

  return (
    <>
      <style>{`
        @keyframes starTwinkle {
          from { opacity: 0.3; }
          to   { opacity: 1;   }
        }
      `}</style>
      <div
        ref={containerRef}
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 0 }}
        aria-hidden="true"
      />
    </>
  )
}
