export const metadata = { title: 'Studio — Kadi' };

/* Placeholder. The studio is the next milestone: the genome picker, the guest
 * list and Supabase-backed saving all land here, replacing /studio-legacy.html. */
export default function StudioPage() {
  return (
    <div className="mx-auto w-full max-w-[1600px] px-6 py-24 lg:px-10">
      <h1 className="font-[family-name:var(--font-display)] text-[44px] text-ink">Studio</h1>
      <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-ink-soft">
        The new studio is being built on the genome engine. Until it lands, the
        existing editor is still available and fully working.
      </p>
      <a
        href="/studio-legacy.html"
        className="mt-8 inline-block rounded-lg bg-sage px-6 py-3.5 text-[14px] font-medium text-ivory hover:bg-sage-deep"
      >
        Open the current studio
      </a>
    </div>
  );
}
