import StudioEditor from './StudioEditor';
import { findTemplate, CATEGORY_BY_KEY, CATEGORIES } from '@/lib/templates';

export const metadata = {
  title: 'Studio',
  description:
    'Open a template and make it yours: names, date, venue, colours and type, ' +
    'with the real card redrawing as you edit.',
};

/* Resolution happens on the server so the first paint already shows the chosen
 * card. Doing it in the browser would flash a default design first, which is
 * exactly the moment a customer decides the tool is not really theirs. */
export default async function StudioPage({
  searchParams,
}: {
  searchParams: Promise<{ template?: string; category?: string }>;
}) {
  const { template: id, category } = await searchParams;
  const template = id ? findTemplate(id) : null;
  const cat = category && CATEGORY_BY_KEY[category] ? category : CATEGORIES[0].key;

  return <StudioEditor template={template} category={template?.category ?? cat} />;
}
