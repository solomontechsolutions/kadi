import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { SUPABASE_URL, SUPABASE_KEY, isConfigured } from '@/lib/supabase/config';

/* Refreshes the Supabase session on every matched request.
 *
 * Access tokens are short lived. Without a refresh in middleware, a signed-in
 * organiser gets silently logged out mid-edit as soon as their token expires,
 * which on a Studio page means losing whatever they had not saved. Server
 * components cannot write cookies, so this is the only place the refreshed
 * token can be persisted.
 *
 * getUser is called rather than getSession on purpose: getSession trusts
 * whatever is in the cookie, getUser verifies it with the auth server, and this
 * is the request where that verification belongs. */
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  if (!isConfigured) return response;

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options));
      },
    },
  });

  await supabase.auth.getUser();
  return response;
}

export const config = {
  /* Static assets and the engine are excluded: refreshing a session to serve a
     font or a card stylesheet is pure latency on every request. */
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|brand/|engine/|vendor/|.*\\.(?:png|jpg|jpeg|gif|svg|ico|css|js|json|html|webmanifest)$).*)',
  ],
};
