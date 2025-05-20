import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
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
        set(name: string, value: string, options: any) {
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          response.cookies.delete({
            name,
            ...options,
          })
        },
      },
    }
  )

  const { data: { session }, error } = await supabase.auth.getSession()

  if (!session && !request.nextUrl.pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL('/auth/signin', request.url))
  }

  if (session && request.nextUrl.pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL(`/profile/${session.user.id}/dashboard`, request.url))
  }

  if (session && request.nextUrl.pathname.startsWith('/profile/')) {
    const segments = request.nextUrl.pathname.split('/')
    const profileId = segments[2] // /profile/[profileId]/...
    
    if (profileId !== session.user.id) {
      return NextResponse.redirect(new URL(`/profile/${session.user.id}/dashboard`, request.url))
    }
  }

  return response
}