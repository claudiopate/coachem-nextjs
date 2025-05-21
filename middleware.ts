import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Create a response object that we can modify
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Create a Supabase client configured to use cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set({
              name,
              value,
              ...options,
            });
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            });
            response.cookies.set({
              name,
              value,
              ...options,
            });
          });
        },
      },
    }
  );

  // Refresh the session
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();

  // Handle session errors
  if (sessionError) {
    console.error('Session error:', sessionError);
    return response;
  }

  const isAuthPage = request.nextUrl.pathname.startsWith('/auth/');
  const isPublicRoute = [
    '/_next',
    '/images',
    '/favicon.ico',
    '/api/auth',
    '/'
  ].some(route => request.nextUrl.pathname.startsWith(route));

  // If there's no session and we're not on a public route, redirect to signin
  if (!session && !isAuthPage && !isPublicRoute) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/auth/signin';
    redirectUrl.searchParams.set('redirectedFrom', request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // If we have a session and we're on an auth page, redirect to dashboard
  if (session?.user && isAuthPage) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = `/profile/${session.user.id}/dashboard`;
    return NextResponse.redirect(redirectUrl);
  }

  // If we have a session and trying to access another user's profile
  if (session?.user && request.nextUrl.pathname.startsWith('/profile/')) {
    const segments = request.nextUrl.pathname.split('/');
    const profileId = segments[2]; // /profile/[profileId]/...
    
    if (profileId !== session.user.id) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = `/profile/${session.user.id}/dashboard`;
      return NextResponse.redirect(redirectUrl);
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public|images).*)',
  ],
};