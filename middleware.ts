import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Funzione per verificare se il dispositivo è mobile o se è l'app iOS
function isMobileOrApp(request: NextRequest) {
  const userAgent = request.headers.get('user-agent') || ''
  console.log('User Agent:', userAgent)
  
  // Se è l'app iOS, ritorna sempre true
  if (userAgent.includes('Coachem iOS App')) {
    return true
  }
  
  // Altrimenti controlla se è un dispositivo mobile
  return /Mobile|Android|iPhone|iPad|iPod/i.test(userAgent)
}

export async function middleware(request: NextRequest) {
  console.log('Middleware called for path:', request.nextUrl.pathname)
  
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.delete({
            name,
            ...options,
          })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const isMobile = isMobileOrApp(request)
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth/')
  const isApiPage = request.nextUrl.pathname.startsWith('/api/')
  const isHomePage = request.nextUrl.pathname === '/'
  const isPublicAsset = request.nextUrl.pathname.startsWith('/_next/') || 
                       request.nextUrl.pathname.startsWith('/images/') ||
                       request.nextUrl.pathname === '/favicon.ico'

  console.log('Is Mobile or App:', isMobile)
  console.log('Is Auth Page:', isAuthPage)
  console.log('Is API Page:', isApiPage)
  console.log('Is Home Page:', isHomePage)
  console.log('Is Public Asset:', isPublicAsset)
  console.log('User:', user?.id)

  // Se è un asset pubblico, permetti l'accesso
  if (isPublicAsset) {
    return response
  }

  // Se è l'app mobile o un dispositivo mobile
  if (isMobile) {
    // Se sta cercando di accedere alla home, redirect a signin
    if (isHomePage) {
      console.log('Redirecting mobile/app user from home to signin')
      return NextResponse.redirect(new URL('/auth/signin', request.url))
    }

    // Se l'utente non è autenticato e non è già nella pagina di signin, redirect al signin
    if (!user && !isAuthPage && !isApiPage) {
      console.log('Redirecting unauthenticated mobile/app user to signin')
      return NextResponse.redirect(new URL('/auth/signin', request.url))
    }
  }

  // Se l'utente non è autenticato e la pagina non è auth o API
  if (!user && !isAuthPage && !isApiPage) {
    console.log('Redirecting unauthenticated user to signin')
    return NextResponse.redirect(new URL('/auth/signin', request.url))
  }

  // Se l'utente è autenticato e sta cercando di accedere a una pagina di auth
  if (user && isAuthPage) {
    console.log('Redirecting authenticated user from auth page to dashboard')
    return NextResponse.redirect(new URL(`/profile/${user.id}/dashboard`, request.url))
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}