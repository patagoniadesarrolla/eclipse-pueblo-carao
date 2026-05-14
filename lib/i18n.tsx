'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import es from '@/messages/es.json'
import en from '@/messages/en.json'
import pt from '@/messages/pt.json'

export type Locale = 'es' | 'en' | 'pt'

const LOCALES: Locale[] = ['es', 'en', 'pt']
const LABELS: Record<Locale, string> = { es: 'ES', en: 'EN', pt: 'PT' }
const translations = { es, en, pt }

interface LanguageContextValue {
  locale: Locale
  setLocale: (l: Locale) => void
  labels: typeof LABELS
  locales: typeof LOCALES
}

const LanguageContext = createContext<LanguageContextValue>({
  locale: 'es',
  setLocale: () => {},
  labels: LABELS,
  locales: LOCALES,
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('es')

  useEffect(() => {
    const saved = localStorage.getItem('locale') as Locale
    if (saved && LOCALES.includes(saved)) setLocaleState(saved)
  }, [])

  const setLocale = (l: Locale) => {
    setLocaleState(l)
    localStorage.setItem('locale', l)
  }

  return (
    <LanguageContext.Provider value={{ locale, setLocale, labels: LABELS, locales: LOCALES }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useT<T = any>(namespace: keyof typeof es): T {
  const { locale } = useLanguage()
  return (translations[locale] as any)[namespace] as T
}
