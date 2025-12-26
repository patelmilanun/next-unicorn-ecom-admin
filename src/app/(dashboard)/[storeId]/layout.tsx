import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';

import Navbar from '@/components/navbar';
import { db } from '@/lib/db';
import { stores } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ storeId: string }>;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const { storeId } = await params;

  const store = await db.query.stores.findFirst({
    where: and(eq(stores.id, storeId), eq(stores.userId, userId)),
  });

  if (!store) {
    redirect('/');
  }

  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
