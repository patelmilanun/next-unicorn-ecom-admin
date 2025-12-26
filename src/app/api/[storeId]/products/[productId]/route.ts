import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { and, eq } from 'drizzle-orm';

import { db } from '@/lib/db';
import { products, images, stores } from '@/db/schema';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;

    if (!productId) {
      return new NextResponse('Product id is required', { status: 400 });
    }

    const product = await db.query.products.findFirst({
      where: eq(products.id, productId),
      with: {
        images: true,
        category: true,
        size: true,
        color: true,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log('[PRODUCT_GET]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ productId: string; storeId: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 403 });
    }

    const { productId, storeId } = await params;

    if (!productId) {
      return new NextResponse('Product id is required', { status: 400 });
    }

    const storeByUserId = await db.query.stores.findFirst({
      where: and(eq(stores.id, storeId), eq(stores.userId, userId)),
    });

    if (!storeByUserId) {
      return new NextResponse('Unauthorized', { status: 405 });
    }

    const [product] = await db
      .delete(products)
      .where(eq(products.id, productId))
      .returning();

    return NextResponse.json(product);
  } catch (error) {
    console.log('[PRODUCT_DELETE]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ productId: string; storeId: string }> }
) {
  try {
    const { userId } = await auth();

    const body = await req.json();

    const {
      name,
      price,
      categoryId,
      images: productImages,
      colorId,
      sizeId,
      isFeatured,
      isArchived,
    } = body;

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 403 });
    }

    const { productId, storeId } = await params;

    if (!productId) {
      return new NextResponse('Product id is required', { status: 400 });
    }

    if (!name) {
      return new NextResponse('Name is required', { status: 400 });
    }

    if (!productImages || !productImages.length) {
      return new NextResponse('Images are required', { status: 400 });
    }

    if (!price) {
      return new NextResponse('Price is required', { status: 400 });
    }

    if (!categoryId) {
      return new NextResponse('Category id is required', { status: 400 });
    }

    if (!colorId) {
      return new NextResponse('Color id is required', { status: 400 });
    }

    if (!sizeId) {
      return new NextResponse('Size id is required', { status: 400 });
    }

    const storeByUserId = await db.query.stores.findFirst({
      where: and(eq(stores.id, storeId), eq(stores.userId, userId)),
    });

    if (!storeByUserId) {
      return new NextResponse('Unauthorized', { status: 405 });
    }

    const product = await db.transaction(async (tx) => {
      await tx
        .update(products)
        .set({
          name,
          price: parseFloat(price),
          categoryId,
          colorId,
          sizeId,
          isFeatured,
          isArchived,
        })
        .where(eq(products.id, productId));

      await tx.delete(images).where(eq(images.productId, productId));

      await tx.insert(images).values(
        productImages.map((image: { url: string }) => ({
          id: crypto.randomUUID(),
          productId: productId,
          url: image.url,
        }))
      );

      return await tx.query.products.findFirst({
        where: eq(products.id, productId),
        with: {
          images: true,
        },
      });
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log('[PRODUCT_PATCH]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
