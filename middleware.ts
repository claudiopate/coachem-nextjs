import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
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

  const isAuthPage = request.nextUrl.pathname.startsWith('/auth/');
  const isApiPage = request.nextUrl.pathname.startsWith('/api/');

  // If the user is not signed in and the page is not an auth page or API route,
  // redirect to the sign-in page
  if (!user && !isAuthPage && !isApiPage) {
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }

  // If the user is signed in and trying to access an auth page,
  // redirect to the dashboard
  if (user && isAuthPage) {
    return NextResponse.redirect(new URL(`/profile/${user.id}/dashboard`, request.url));
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};