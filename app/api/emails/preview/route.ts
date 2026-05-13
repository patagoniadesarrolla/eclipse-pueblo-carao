import { NextRequest, NextResponse } from 'next/server'
import { renderTemplate } from '@/lib/emails'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get('template') ?? ''
  const result = renderTemplate(key)

  if (!result) {
    return NextResponse.json({ error: 'Template not found' }, { status: 404 })
  }

  return new NextResponse(result.html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}
