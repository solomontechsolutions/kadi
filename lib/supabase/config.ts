/* Where the Supabase credentials come from, and what happens when they are not
 * there.
 *
 * Two names are accepted for the key. Supabase renamed the browser-safe key
 * from "anon" to "publishable", and its Vercel integration has created both
 * over time, so a project can legitimately end up with either or with both.
 * Accepting the pair here removes an entire category of "works locally, blank
 * in production" from the codebase.
 *
 * isConfigured exists because the marketing site must build and run without a
 * database. Most of Mwaliko is public pages that never touch Supabase, and a
 * missing environment variable should degrade the parts that need an account,
 * not take the whole site down.
 */
export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';

export const SUPABASE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  '';

export const isConfigured = Boolean(SUPABASE_URL && SUPABASE_KEY);

/* Thrown only from paths that genuinely cannot proceed, so the message says
   what to fix rather than surfacing a null dereference three frames deeper. */
export function assertConfigured() {
  if (!isConfigured) {
    throw new Error(
      'Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and ' +
      'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in the environment.'
    );
  }
}
