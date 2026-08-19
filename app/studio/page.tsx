import StudioEditor from './StudioEditor';
import { findTemplate, CATEGORY_BY_KEY, CATEGORIES } from '@/lib/templates';
import { createClient, currentUser } from '@/lib/supabase/server';

export const metadata = {
  title: 'Studio',
  description:
    'Open a template and make it yours: names, date, venue, colours and type, ' +
    'with the real card redrawing as you edit.',
};

export const dynamic = 'force-dynamic';

/* Resolution happens on the server so the first paint already shows the right
 * card. Doing it in the browser would flash a default design first, which is
 * exactly the moment a customer decides the tool is not really theirs.
 *
 * Two ways in: ?template=<id> opens a gallery card fresh, ?event=<id> reopens
 * something already saved. The saved design wins, because a stored event is a
 * decision the organiser already made. */
export default async function StudioPage({
  searchParams,
}: {
  searchParams: Promise<{ template?: string; category?: string; event?: string }>;
}) {
  const { template: templateId, category, event: eventId } = await searchParams;

  const user = await currentUser();
  const template = templateId ? findTemplate(templateId) : null;
  const cat = category && CATEGORY_BY_KEY[category] ? category : CATEGORIES[0].key;

  let saved: { id: string; title: string; design: Record<string, unknown> } | null = null;
  if (eventId && user) {
    const sb = await createClient();
    /* RLS scopes this to the signed-in owner, so a guessed event id returns
       nothing rather than somebody else's invitation. */
    const { data } = await sb!
      .from('events').select('id,title,design,category').eq('id', eventId).maybeSingle();
    if (data) saved = { id: data.id, title: data.title, design: (data.design ?? {}) as Record<string, unknown> };
  }

  return (
    <StudioEditor
      template={template}
      category={template?.category ?? cat}
      saved={saved as never}
      signedIn={Boolean(user)}
    />
  );
}
