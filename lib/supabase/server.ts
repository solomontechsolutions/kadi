import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { SUPABASE_URL, SUPABASE_KEY, isConfigured } from './config';

type CookieToSet = { name: string; value: string; options?: CookieOptions };

/* Server-side Supabase client, bound to the request's cookies so row level
 * security sees the signed-in organiser rather than an anonymous visitor.
 *
 * Returns null when Supabase is not configured instead of throwing. Callers are
 * server components on pages that must still render for a visitor with no
 * account, so "no database" has to be an ordinary branch rather than an
 * exception that takes the page down. */
export async function createClient() {
  if (!isConfigured) return null;
  const cookieStore = await cookies();

  return createServerClient(SUPABASE_URL, SUPABASE_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options));
        } catch {
          // Called from a Server Component, where cookies are read-only.
          // Session refresh happens in middleware.ts, so dropping the write
          // here is correct rather than a swallowed failure.
        }
      },
    },
  });
}

/* The signed-in user, or null. Every protected page starts here. */
export async function currentUser() {
  const sb = await createClient();
  if (!sb) return null;
  const { data } = await sb.auth.getUser();
  return data.user ?? null;
}
