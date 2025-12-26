import { eq } from 'drizzle-orm';

import { db } from '@/lib/db';
import { sizes } from '@/db/schema';

import SizeForm from './components/size-form';

export default async function SizePage({
  params,
}: {
  params: Promise<{ sizeId: string }>;
}) {
  const { sizeId } = await params;
  const size = await db.query.sizes.findFirst({
    where: eq(sizes.id, sizeId),
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizeForm initialData={size || null} />
      </div>
    </div>
  );
}
