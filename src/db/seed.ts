import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());

import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';
import { v4 as uuidv4 } from 'uuid';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const db = drizzle(client, { schema });

async function main() {
  console.log('Seeding database with real-world data from images...');

  const userId = process.env.CLERK_USER_ID;
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  if (!userId) {
    console.error('Error: CLERK_USER_ID environment variable is not set.');
    console.log(
      'Please add CLERK_USER_ID=your_user_id to your .env.local file.'
    );
    process.exit(1);
  }

  if (!cloudName) {
    console.error(
      'Error: NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME environment variable is not set.'
    );
    process.exit(1);
  }

  const getCloudinaryUrl = (
    publicId: string,
    extension: string = 'jpg',
    version?: string
  ) => {
    const v = version ? `v${version}/` : '';
    return `https://res.cloudinary.com/${cloudName}/image/upload/${v}next-unicorn-ecom/${publicId}.${extension}`;
  };

  // 1. Create a Store
  const storeId = uuidv4();
  await db.insert(schema.stores).values({
    id: storeId,
    name: 'UNICORN',
    userId: userId,
  });

  console.log(`Created store: ${storeId}`);

  // 2. Create Billboards
  const billboardJeansId = uuidv4();
  await db.insert(schema.billboards).values({
    id: billboardJeansId,
    storeId: storeId,
    label: 'Explore our premium jeans',
    imageUrl: getCloudinaryUrl('jq3zvh8ttfjvjwyo12n3', 'jpg', '1689932176'),
  });

  const billboardMainId = uuidv4();
  await db.insert(schema.billboards).values({
    id: billboardMainId,
    storeId: storeId,
    label: 'Pant',
    imageUrl: getCloudinaryUrl('vwg4hyf5vjgagiaida6i', 'jpg', '1688495791'),
  });

  console.log('Created billboards');

  // 3. Create Categories
  const categoryIds = {
    jeans: uuidv4(),
    sunglasses: uuidv4(),
    watch: uuidv4(),
  };

  await db.insert(schema.categories).values([
    {
      id: categoryIds.jeans,
      storeId: storeId,
      billboardId: billboardJeansId,
      name: 'Jeans',
    },
    {
      id: categoryIds.sunglasses,
      storeId: storeId,
      billboardId: billboardMainId,
      name: 'Sun Glasses',
    },
    {
      id: categoryIds.watch,
      storeId: storeId,
      billboardId: billboardMainId,
      name: 'Watch',
    },
  ]);

  console.log('Created categories');

  // 4. Create Sizes
  const sizeIds = {
    small: uuidv4(),
    medium: uuidv4(),
    large: uuidv4(),
    extraLarge: uuidv4(),
  };

  await db.insert(schema.sizes).values([
    { id: sizeIds.small, storeId: storeId, name: 'Small', value: 'Small' },
    { id: sizeIds.medium, storeId: storeId, name: 'Medium', value: 'Medium' },
    { id: sizeIds.large, storeId: storeId, name: 'Large', value: 'Large' },
    {
      id: sizeIds.extraLarge,
      storeId: storeId,
      name: 'Extra Large',
      value: 'Extra Large',
    },
  ]);

  console.log('Created sizes');

  // 5. Create Colors
  const colorIds = {
    red: uuidv4(),
    black: uuidv4(),
    yellow: uuidv4(),
    blue: uuidv4(),
  };

  await db.insert(schema.colors).values([
    { id: colorIds.red, storeId: storeId, name: 'Red', value: 'Red' },
    { id: colorIds.black, storeId: storeId, name: 'Black', value: 'Black' },
    { id: colorIds.yellow, storeId: storeId, name: 'Yellow', value: 'Yellow' },
    { id: colorIds.blue, storeId: storeId, name: 'Blue', value: 'Blue' },
  ]);

  console.log('Created colors');

  // 6. Create Products
  const productsData = [
    {
      id: uuidv4(),
      storeId: storeId,
      categoryId: categoryIds.jeans,
      name: 'Tapered Fit',
      price: 20.0,
      isFeatured: true,
      sizeId: sizeIds.large,
      colorId: colorIds.blue,
      images: [getCloudinaryUrl('scfxcznfadwnmdzj7do5', 'jpg', '1689934700')],
    },
    {
      id: uuidv4(),
      storeId: storeId,
      categoryId: categoryIds.watch,
      name: 'Apple iWatch',
      price: 60.0,
      isFeatured: true,
      sizeId: sizeIds.medium,
      colorId: colorIds.black,
      images: [getCloudinaryUrl('yq8iqt13oob0st7or3gx', 'jpg', '1689934436')],
    },
    {
      id: uuidv4(),
      storeId: storeId,
      categoryId: categoryIds.sunglasses,
      name: 'Gucci',
      price: 15.0,
      isFeatured: true,
      sizeId: sizeIds.small,
      colorId: colorIds.black,
      images: [getCloudinaryUrl('qrvyggkhfgxcdx55iper', 'jpg', '1689934113')],
    },
    {
      id: uuidv4(),
      storeId: storeId,
      categoryId: categoryIds.sunglasses,
      name: 'Lenskart',
      price: 10.0,
      isFeatured: true,
      sizeId: sizeIds.small,
      colorId: colorIds.black,
      images: [getCloudinaryUrl('bu2csy2mzrs4xfsbfp5h', 'jpg', '1689933809')],
    },
    {
      id: uuidv4(),
      storeId: storeId,
      categoryId: categoryIds.sunglasses,
      name: 'Fastrack Glairs',
      price: 45.0,
      isFeatured: true,
      sizeId: sizeIds.small,
      colorId: colorIds.black,
      images: [
        getCloudinaryUrl('orkpd9etewamzax0okpj', 'jpg', '1689933056'),
        getCloudinaryUrl('a39oddehuoflgs5dztat', 'jpg', '1689932671'),
      ],
    },
    {
      id: uuidv4(),
      storeId: storeId,
      categoryId: categoryIds.watch,
      name: 'Titan Watch',
      price: 120.0,
      isFeatured: true,
      sizeId: sizeIds.medium,
      colorId: colorIds.black,
      images: [
        getCloudinaryUrl('jiqojzwtlbu3gnadaqta', 'jpg', '1689932975'),
        getCloudinaryUrl('gsovtl6lzrzrvsn4yg0y', 'jpg', '1689932793'),
      ],
    },
    {
      id: uuidv4(),
      storeId: storeId,
      categoryId: categoryIds.jeans,
      name: 'Denim Jeans',
      price: 55.0,
      isFeatured: true,
      sizeId: sizeIds.large,
      colorId: colorIds.black,
      images: [
        getCloudinaryUrl('trmp5uhqezzu2ivy7od3', 'jpg', '1689932243'),
        getCloudinaryUrl('i26afqcusbu1x8e5vbj3', 'webp', '1689932243'),
        getCloudinaryUrl('ynm8xbt7ctlq511fcu5c', 'webp', '1689489281'),
        getCloudinaryUrl('opyylrozczlqvh9nkpyw', 'jpg', '1689489281'),
      ],
    },
  ];

  for (const product of productsData) {
    const { images: productImages, ...productData } = product;
    await db.insert(schema.products).values(productData);

    for (const url of productImages) {
      await db.insert(schema.images).values({
        id: uuidv4(),
        productId: product.id,
        url: url,
      });
    }
  }

  console.log('Created products and images');
  console.log('Seeding completed successfully!');
  process.exit(0);
}

main().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
