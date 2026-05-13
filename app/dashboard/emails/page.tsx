'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import { EMAIL_TEMPLATES, TemplateKey } from '@/lib/emails'

/* ── Tipos ───────────────────────────────────────────────────────────────── */

interface EmailLog {
  id: string
  template_key: string
  recipient_email: string
  recipient_name: string | null
  subject: string | null
  status: string
  resend_id: string | null
  sent_at: string
}

/* ── Modal Preview ────────────────────────────────────────────────────────── */

function PreviewModal({ templateKey, onClose }: { templateKey: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <div
        className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-2xl h-[80vh] flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h3 className="text-white font-semibold">Preview — {templateKey}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white text-xl leading-none">×</button>
        </div>
        <iframe
          src={`/api/emails/preview?template=${templateKey}`}
          className="flex-1 w-full rounded-b-2xl"
          title="Email preview"
        />
      </div>
    </div>
  )
}

/* ── Modal Envío ──────────────────────────────────────────────────────────── */

function SendModal({
  templateKey,
  defaultSubject,
  onClose,
}: {
  templateKey: string
  defaultSubject: string
  onClose: () => void
}) {
  const [mode, setMode]     = useState<'all' | 'one'>('all')
  const [email, setEmail]   = useState('')
  const [subject, setSubject] = useState(defaultSubject)
  const [sending, setSending] = useState(false)
  const [result, setResult]   = useState<{ sent: number; errors: string[] } | null>(null)

  const handleSend = async () => {
    setSending(true)
    const body: Record<string, unknown> = { template_key: templateKey, custom_subject: subject }
    if (mode === 'all') body.all_buyers = true
    else body.recipient_email = email

    const res = await fetch('/api/emails/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const json = await res.json()
    setResult(json)
    setSending(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <div
        className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-white font-bold text-lg">Enviar email</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white text-xl leading-none">×</button>
        </div>

        {result ? (
          <div className="text-center py-4">
            <p className="text-3xl mb-3">{result.errors.length === 0 ? '✅' : '⚠️'}</p>
            <p className="text-white font-bold text-lg mb-1">
              {result.sent} email{result.sent !== 1 ? 's' : ''} enviado{result.sent !== 1 ? 's' : ''}
            </p>
            {result.errors.length > 0 && (
              <div className="mt-3 text-left">
                <p className="text-xs text-red-400 font-bold mb-1">Errores:</p>
                {result.errors.map((e, i) => (
                  <p key={i} className="text-xs text-gray-500">{e}</p>
                ))}
              </div>
            )}
            <button onClick={onClose} className="mt-4 px-4 py-2 bg-gray-700 text-white rounded-lg text-sm hover:bg-gray-600 transition-colors">
              Cerrar
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="text-xs text-gray-400 font-medium block mb-2">Destinatario</label>
              <div className="grid grid-cols-2 gap-2">
                {(['all', 'one'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all ${
                      mode === m
                        ? 'bg-violet-600/20 border-violet-500/60 text-violet-300'
                        : 'bg-gray-800 border-gray-700 text-gray-400 hover:text-white'
                    }`}
                  >
                    {m === 'all' ? 'Todos los compradores' : 'Uno específico'}
                  </button>
                ))}
              </div>
            </div>

            {mode === 'one' && (
              <div>
                <label className="text-xs text-gray-400 font-medium block mb-1">Email del comprador</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="comprador@email.com"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-violet-500"
                />
              </div>
            )}

            <div>
              <label className="text-xs text-gray-400 font-medium block mb-1">Asunto</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-violet-500"
              />
            </div>

            <button
              onClick={handleSend}
              disabled={sending || (mode === 'one' && !email)}
              className="w-full py-2.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white text-sm font-bold rounded-lg transition-colors"
            >
              {sending ? 'Enviando…' : 'Confirmar envío'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

/* ── Tab Templates ────────────────────────────────────────────────────────── */

function TemplatesTab() {
  const [preview, setPreview]     = useState<string | null>(null)
  const [sending, setSending]     = useState<{ key: string; subject: string } | null>(null)
  const [subjects, setSubjects]   = useState<Record<string, string>>({})

  useEffect(() => {
    // Fetch default subjects for each template
    Promise.all(
      EMAIL_TEMPLATES.map(async (t) => {
        const res = await fetch(`/api/emails/preview?template=${t.key}`)
        // Subject comes from the page title — we store it from the API response header or just use defaults
        return [t.key, t.name]
      })
    ).then((entries) => setSubjects(Object.fromEntries(entries)))
  }, [])

  const DEFAULT_SUBJECTS: Record<string, string> = {
    bienvenida:       'Bienvenid@ al Eclipse del Dragón · Tu acceso está listo',
    preparacion_30d:  '30 días para el Eclipse del Dragón · Tu checklist de preparación',
    preparacion_7d:   '7 días · Punto de encuentro e instrucciones finales — Eclipse del Dragón',
    dia_evento:       'Hoy es el día · Eclipse del Dragón 2027',
    post_evento:      'El dragón volvió a dormir · Tu archivo de memoria',
  }

  return (
    <>
      <div className="space-y-3">
        {EMAIL_TEMPLATES.map((t) => (
          <div key={t.key} className="rounded-xl border border-gray-800 bg-gray-900/60 p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">{t.emoji}</span>
                <div>
                  <p className="text-white font-semibold text-sm">{t.name}</p>
                  <p className="text-gray-400 text-xs mt-0.5 mb-1">{t.description}</p>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-800 text-gray-500 border border-gray-700 uppercase tracking-wider">
                    {t.trigger}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => setPreview(t.key)}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700 transition-colors"
                >
                  Previsualizar
                </button>
                <button
                  onClick={() => setSending({ key: t.key, subject: DEFAULT_SUBJECTS[t.key] ?? t.name })}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-violet-600/20 hover:bg-violet-600/35 text-violet-300 border border-violet-500/25 transition-colors"
                >
                  Enviar ahora
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {preview && <PreviewModal templateKey={preview} onClose={() => setPreview(null)} />}
      {sending && (
        <SendModal
          templateKey={sending.key}
          defaultSubject={sending.subject}
          onClose={() => setSending(null)}
        />
      )}
    </>
  )
}

/* ── Tab Historial ────────────────────────────────────────────────────────── */

const TEMPLATE_LABELS: Record<string, string> = {
  bienvenida:      'Bienvenida',
  preparacion_30d: 'Preparación 30d',
  preparacion_7d:  'Preparación 7d',
  dia_evento:      'Día del evento',
  post_evento:     'Post-evento',
}

function HistorialTab() {
  const [logs, setLogs]               = useState<EmailLog[]>([])
  const [loading, setLoading]         = useState(true)
  const [filtroTemplate, setFiltroTemplate] = useState<TemplateKey | 'all'>('all')

  const fetchLogs = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()
    let query = supabase
      .from('email_logs')
      .select('*')
      .order('sent_at', { ascending: false })
      .limit(100)

    if (filtroTemplate !== 'all') query = query.eq('template_key', filtroTemplate)

    const { data } = await query
    setLogs(data ?? [])
    setLoading(false)
  }, [filtroTemplate])

  useEffect(() => { fetchLogs() }, [fetchLogs])

  const filterBtn = (active: boolean) =>
    `px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
      active ? 'bg-violet-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
    }`

  return (
    <>
      <div className="flex gap-2 flex-wrap mb-4">
        <button onClick={() => setFiltroTemplate('all')} className={filterBtn(filtroTemplate === 'all')}>
          Todos
        </button>
        {EMAIL_TEMPLATES.map((t) => (
          <button
            key={t.key}
            onClick={() => setFiltroTemplate(t.key as TemplateKey)}
            className={filterBtn(filtroTemplate === t.key)}
          >
            {t.name}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-gray-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800 bg-gray-900/60">
              {['Template', 'Destinatario', 'Asunto', 'Estado', 'Enviado'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs text-gray-500 font-semibold uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/60">
            {loading ? (
              <tr><td colSpan={5} className="text-center py-10 text-gray-600">Cargando…</td></tr>
            ) : logs.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-10 text-gray-600">Sin emails enviados aún</td></tr>
            ) : logs.map((log) => (
              <tr key={log.id} className="hover:bg-gray-800/30 transition-colors">
                <td className="px-4 py-3">
                  <span className="text-xs font-semibold text-violet-400">
                    {TEMPLATE_LABELS[log.template_key] ?? log.template_key}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <p className="text-white text-xs font-medium">{log.recipient_name ?? '—'}</p>
                  <p className="text-gray-500 text-xs">{log.recipient_email}</p>
                </td>
                <td className="px-4 py-3 text-gray-400 text-xs max-w-[180px] truncate">
                  {log.subject ?? '—'}
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
                    log.status === 'sent'
                      ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25'
                      : 'bg-red-500/15 text-red-400 border-red-500/25'
                  }`}>
                    {log.status === 'sent' ? 'Enviado' : 'Error'}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs">
                  {new Date(log.sent_at).toLocaleString('es-AR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

/* ── Página ───────────────────────────────────────────────────────────────── */

export default function EmailsPage() {
  const [tab, setTab] = useState<'templates' | 'historial'>('templates')

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Emails</h1>
        <p className="text-gray-500 text-sm mt-0.5">Templates transaccionales y historial de envíos</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-900 border border-gray-800 rounded-xl p-1 w-fit mb-6">
        {(['templates', 'historial'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all capitalize ${
              tab === t ? 'bg-violet-600 text-white' : 'text-gray-500 hover:text-white'
            }`}
          >
            {t === 'templates' ? 'Templates' : 'Historial'}
          </button>
        ))}
      </div>

      {tab === 'templates' ? <TemplatesTab /> : <HistorialTab />}
    </div>
  )
}
