import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

type CookieToSet = { name: string; value: string; options?: Record<string, unknown> }

export async function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-pathname', request.nextUrl.pathname)

  let supabaseResponse = NextResponse.next({ request: { headers: requestHeaders } })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: CookieToSet[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request: { headers: requestHeaders } })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresca la sesión si expiró
  const { data: { user } } = await supabase.auth.getUser()

  // Protege /mi-experiencia (excepto login y sin-acceso)
  if (
    !user &&
    request.nextUrl.pathname.startsWith('/mi-experiencia') &&
    !request.nextUrl.pathname.startsWith('/mi-experiencia/login') &&
    !request.nextUrl.pathname.startsWith('/mi-experiencia/sin-acceso')
  ) {
    const url = request.nextUrl.clone()
    url.pathname = '/mi-experiencia/login'
    return NextResponse.redirect(url)
  }

  // Protege todas las rutas del dashboard excepto /login
  if (
    !user &&
    request.nextUrl.pathname.startsWith('/dashboard') &&
    !request.nextUrl.pathname.startsWith('/dashboard/login')
  ) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard/login'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
