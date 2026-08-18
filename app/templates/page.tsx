import TemplateGallery from './TemplateGallery';
import { CATEGORY_BY_KEY, CATEGORIES } from '@/lib/templates';

export const metadata = {
  title: 'Card Templates — Kadi',
  description:
    'Browse digital invitation templates for weddings, send-offs, kitchen parties, ' +
    'birthdays, graduations, church events and corporate functions.',
};

export default async function TemplatesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const initial = category && CATEGORY_BY_KEY[category] ? category : CATEGORIES[0].key;
  return <TemplateGallery initialCategory={initial} />;
}
