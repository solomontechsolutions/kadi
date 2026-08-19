import { createBrowserClient } from '@supabase/ssr';
import { SUPABASE_URL, SUPABASE_KEY, assertConfigured } from './config';

/* Browser-side Supabase client.
 *
 * The publishable key is safe to ship. It is designed to be public, and every
 * table it can reach is protected by row level security (see
 * supabase/schema.sql). The security boundary is RLS, never key secrecy. The
 * service-role key must never appear in anything under app/ or components/. */
export function createClient() {
  assertConfigured();
  return createBrowserClient(SUPABASE_URL, SUPABASE_KEY);
}
