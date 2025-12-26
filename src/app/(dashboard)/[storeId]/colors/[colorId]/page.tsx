import { eq } from 'drizzle-orm';

import { db } from '@/lib/db';
import { colors } from '@/db/schema';

import ColorForm from './components/color-form';

export default async function ColorPage({
  params,
}: {
  params: Promise<{ colorId: string }>;
}) {
  const { colorId } = await params;
  const color = await db.query.colors.findFirst({
    where: eq(colors.id, colorId),
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColorForm initialData={color || null} />
      </div>
    </div>
  );
}
