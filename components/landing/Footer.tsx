export default function Footer() {
  return (
    <footer className="py-12 px-6" style={{ background: '#050508', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <p className="text-white font-bold text-lg tracking-tight uppercase">
              Eclipse en Pueblo Carao
            </p>
            <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
              Astroturismo premium · 6 Feb 2027 · Esquel, Patagonia
            </p>
          </div>

          <div className="text-center md:text-right">
            <p className="text-sm mb-1" style={{ color: 'rgba(255,255,255,0.35)' }}>
              ¿Tenés alguna pregunta?
            </p>
            <a href="mailto:hola@pueblocarao.com"
              className="font-semibold transition-opacity hover:opacity-75"
              style={{ color: '#d97706' }}>
              hola@pueblocarao.com
            </a>
          </div>
        </div>

        {/* Partners */}
        <div className="mt-8 pt-8 flex flex-col items-center gap-3"
          style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
          <p className="text-xs uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.2)' }}>
            Con el apoyo de
          </p>
          <div className="flex items-center gap-6 flex-wrap justify-center">
            {['Pueblo Carao', 'Reina Mora', 'Trama'].map((p, i, arr) => (
              <span key={p} className="flex items-center gap-6">
                <span className="text-xs font-bold uppercase tracking-widest"
                  style={{ color: 'rgba(255,255,255,0.3)' }}>
                  {p}
                </span>
                {i < arr.length - 1 && (
                  <span style={{ color: 'rgba(220,38,38,0.4)' }}>·</span>
                )}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6 text-center text-xs" style={{ color: 'rgba(255,255,255,0.12)' }}>
          © 2027 Pueblo Carao. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  )
}
