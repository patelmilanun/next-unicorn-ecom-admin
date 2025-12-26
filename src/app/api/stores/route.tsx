import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

import { db } from '@/lib/db';
import { stores } from '@/db/schema';

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const body = await req.json();

    const { name } = body;

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 403 });
    }

    if (!name) {
      return new NextResponse('Name is required', { status: 400 });
    }

    const [store] = await db
      .insert(stores)
      .values({
        id: crypto.randomUUID(),
        name,
        userId,
      })
      .returning();

    return NextResponse.json(store);
  } catch (error) {
    console.error('[STORES_POST]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
