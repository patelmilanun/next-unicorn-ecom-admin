import { UserButton } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';

import StoreSwitcher from '@/components/store-switcher';
import MainNav from '@/components/main-nav';
import { db } from '@/lib/db';
import { stores } from '@/db/schema';
import ThemeToggle from './theme-toggle';

export default async function Navbar() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const results = await db.query.stores.findMany({
    where: eq(stores.userId, userId),
  });

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <StoreSwitcher items={results} />
        <MainNav className="mx-6" />
        <div className="ml-auto flex items-center space-x-4">
          <ThemeToggle />
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </div>
  );
}
