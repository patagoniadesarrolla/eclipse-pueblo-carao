export default function SinAccesoPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: '#050508' }}>
      <div className="text-center max-w-sm">
        <div className="text-5xl mb-6">🔒</div>
        <h1 className="text-white font-bold text-xl mb-3">Acceso exclusivo</h1>
        <p className="text-sm leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.5)' }}>
          Esta zona es exclusiva para compradores del Eclipse del Dragón · Pueblo Carao 2027.
          Si adquiriste tu lugar y tenés problemas para ingresar, escribinos.
        </p>
        <a
          href="mailto:hola@pueblocarao.com"
          className="inline-block px-6 py-2.5 rounded-full text-sm font-semibold transition-colors"
          style={{ background: 'rgba(124,58,237,0.15)', color: '#a78bfa', border: '1px solid rgba(124,58,237,0.3)' }}
        >
          hola@pueblocarao.com
        </a>
      </div>
    </div>
  )
}
