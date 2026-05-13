export default function Footer() {
  return (
    <footer
      className="py-12 px-6"
      style={{
        background: '#050508',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <p className="text-white font-semibold text-lg tracking-tight">
              Eclipse en Pueblo Carao
            </p>
            <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
              Astroturismo premium · Patagonia Argentina
            </p>
          </div>

          <div className="text-center md:text-right">
            <p className="text-sm mb-1" style={{ color: 'rgba(255,255,255,0.35)' }}>
              ¿Tenés alguna pregunta?
            </p>
            <a
              href="mailto:hola@pueblocarao.com"
              className="font-semibold transition-opacity hover:opacity-75"
              style={{ color: '#d97706' }}
            >
              hola@pueblocarao.com
            </a>
          </div>
        </div>

        <div
          className="mt-8 pt-8 text-center text-xs"
          style={{
            color: 'rgba(255,255,255,0.15)',
            borderTop: '1px solid rgba(255,255,255,0.04)',
          }}
        >
          © 2027 Pueblo Carao. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  )
}
