import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { resend, FROM_ADDRESS } from '@/lib/resend'
import { renderTemplate } from '@/lib/emails'

export const runtime = 'nodejs'

interface SendBody {
  template_key: string
  recipient_email?: string
  all_buyers?: boolean
  custom_subject?: string
}

async function sendOne(
  template_key: string,
  email: string,
  name: string,
  custom_subject?: string
): Promise<{ ok: boolean; error?: string }> {
  const result = renderTemplate(template_key, { nombre: name, email })
  if (!result) return { ok: false, error: 'Template not found' }

  const subject = custom_subject ?? result.subject

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: email,
      subject,
      html: result.html,
    })

    await supabaseAdmin.from('email_logs').insert({
      template_key,
      recipient_email: email,
      recipient_name: name || null,
      subject,
      status: error ? 'error' : 'sent',
      resend_id: data?.id ?? null,
    })

    if (error) return { ok: false, error: error.message }
    return { ok: true }
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    await supabaseAdmin.from('email_logs').insert({
      template_key,
      recipient_email: email,
      recipient_name: name || null,
      subject,
      status: 'error',
    })
    return { ok: false, error: msg }
  }
}

export async function POST(req: NextRequest) {
  const body: SendBody = await req.json()
  const { template_key, recipient_email, all_buyers, custom_subject } = body

  if (!template_key) {
    return NextResponse.json({ error: 'template_key required' }, { status: 400 })
  }

  const errors: string[] = []
  let sent = 0

  if (all_buyers) {
    const { data: buyers } = await supabaseAdmin
      .from('buyer_profiles')
      .select('email, name')
      .not('email', 'is', null)

    for (const buyer of buyers ?? []) {
      const res = await sendOne(template_key, buyer.email!, buyer.name ?? '', custom_subject)
      if (res.ok) sent++
      else errors.push(`${buyer.email}: ${res.error}`)
    }
  } else if (recipient_email) {
    const { data: buyer } = await supabaseAdmin
      .from('buyer_profiles')
      .select('name')
      .eq('email', recipient_email)
      .single()

    const res = await sendOne(template_key, recipient_email, buyer?.name ?? '', custom_subject)
    if (res.ok) sent++
    else errors.push(`${recipient_email}: ${res.error}`)
  } else {
    return NextResponse.json({ error: 'recipient_email or all_buyers required' }, { status: 400 })
  }

  return NextResponse.json({ sent, errors })
}
