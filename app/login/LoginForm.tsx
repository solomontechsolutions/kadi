'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

/* Magic link rather than a password.
 *
 * Organisers use Mwaliko a handful of times a year, around one event. A
 * password created in February is forgotten by August, so the realistic flows
 * are "reset password" or "create a second account", and both are worse than
 * emailing a link. It also means Mwaliko never stores a credential, which
 * removes the whole category of breach that matters most to a guest list. */
export default function LoginForm({ next }: { next: string }) {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState('sending');
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
        },
      });
      if (error) throw error;
      setState('sent');
    } catch (err) {
      setState('error');
      setMessage(err instanceof Error ? err.message : 'Could not send the link.');
    }
  }

  if (state === 'sent') {
    return (
      <div className="rounded-xl border border-line bg-paper p-6">
        <h2 className="font-[family-name:var(--font-display)] text-[24px] text-ink">Check your email</h2>
        <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">
          We sent a sign-in link to <strong className="text-ink">{email}</strong>. Open it on
          this device. The link works once and expires in an hour.
        </p>
        <button
          onClick={() => { setState('idle'); setEmail(''); }}
          className="mt-5 text-[13px] text-brand underline underline-offset-2"
        >
          Use a different address
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-xl border border-line bg-paper p-6">
      <label className="block">
        <span className="text-[11px] font-semibold uppercase tracking-[.14em] text-ink-faint">
          Email address
        </span>
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="mt-2 w-full rounded-lg border border-line bg-ivory px-3.5 py-3 text-[14px] text-ink outline-none transition-colors focus:border-brand"
        />
      </label>

      <button
        type="submit"
        disabled={state === 'sending'}
        className="btn-sheen btn-press mt-4 w-full rounded-lg bg-brand px-5 py-3 text-[14px] font-medium text-ivory hover:bg-brand-deep disabled:opacity-60"
      >
        {state === 'sending' ? 'Sending' : 'Email me a sign-in link'}
      </button>

      {state === 'error' && (
        <p role="alert" className="mt-3 text-[13px] text-ink-soft">
          {message}
        </p>
      )}

      <p className="mt-4 text-[12px] leading-relaxed text-ink-faint">
        No password to remember. We email you a link each time you sign in.
      </p>
    </form>
  );
}
