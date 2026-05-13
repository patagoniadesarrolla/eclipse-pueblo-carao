'use client'

import { useEffect } from 'react'

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const

export default function UTMCapture() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const hasUtm = UTM_KEYS.some((k) => params.has(k))
    if (!hasUtm) return
    UTM_KEYS.forEach((k) => {
      const v = params.get(k)
      if (v) localStorage.setItem(k, v)
      else localStorage.removeItem(k)
    })
  }, [])

  return null
}

export function readStoredUTMs() {
  if (typeof window === 'undefined') return {}
  return {
    utm_source:   localStorage.getItem('utm_source')   ?? undefined,
    utm_medium:   localStorage.getItem('utm_medium')   ?? undefined,
    utm_campaign: localStorage.getItem('utm_campaign') ?? undefined,
  }
}
