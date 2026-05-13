import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Eclipse en Pueblo Carao · 2027',
  description: 'Una noche que el universo preparó millones de años. Experiencia premium de astroturismo en Patagonia Argentina.',
  openGraph: {
    title: 'Eclipse en Pueblo Carao · 2027',
    description: 'Experiencia premium de astroturismo en Lago Puelo, Patagonia Argentina.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
