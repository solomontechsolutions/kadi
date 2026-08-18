import { createBrowserClient } from '@supabase/ssr';

/* Browser-side Supabase client.
 *
 * The publishable key is safe to ship -- it is designed to be public, and every
 * table it can reach is protected by row level security (see supabase/schema.sql).
 * The security boundary is RLS, never key secrecy. The service-role key must
 * never appear in anything under app/ or components/. */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}
