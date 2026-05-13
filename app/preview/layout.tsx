import { Bebas_Neue, Inter } from 'next/font/google'

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

export default function PreviewLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="es"
      className={`${bebasNeue.variable} ${inter.variable}`}
    >
      <body style={{ fontFamily: 'var(--font-body, Inter, sans-serif)', margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  )
}
