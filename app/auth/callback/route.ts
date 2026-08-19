import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/* Where the emailed sign-in link lands.
 *
 * Supabase sends the browser here with a one-time code, which is exchanged for
 * a session and set as cookies. The exchange has to happen on the server: the
 * cookies it writes are httpOnly, so a client component could not set them and
 * the session would not survive a reload. */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next');
  const dest = next && next.startsWith('/') && !next.startsWith('//') ? next : '/events';

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=missing_code`);
  }

  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.redirect(`${origin}/login`);
  }

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    /* Almost always an expired or already-used link, which is a normal thing
       for a person to do. Send them back to ask for a fresh one rather than
       showing a stack trace. */
    return NextResponse.redirect(`${origin}/login?error=link_expired`);
  }

  return NextResponse.redirect(`${origin}${dest}`);
}
