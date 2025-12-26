import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';

import { db } from '@/lib/db';
import { stores } from '@/db/schema';
import { eq } from 'drizzle-orm';

export default async function SetupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const store = await db.query.stores.findFirst({
    where: eq(stores.userId, userId),
  });

  if (store) {
    redirect(`/${store.id}`);
  }

  return <>{children}</>;
}
