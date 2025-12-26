import { sqliteTable, text, integer, real, index } from 'drizzle-orm/sqlite-core';
import { relations, sql, InferSelectModel } from 'drizzle-orm';

export const stores = sqliteTable('stores', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  userId: text('userId').notNull(),
  createdAt: integer('createdAt', { mode: 'timestamp' }).default(
    sql`(strftime('%s', 'now'))`
  ),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).default(
    sql`(strftime('%s', 'now'))`
  ),
}, (table) => ({
  userIdIdx: index('stores_userId_idx').on(table.userId),
}));

export type Store = InferSelectModel<typeof stores>;

export const storesRelations = relations(stores, ({ many }) => ({
  billboards: many(billboards),
  categories: many(categories),
  sizes: many(sizes),
  colors: many(colors),
  products: many(products),
  orders: many(orders),
}));

export const billboards = sqliteTable('billboards', {
  id: text('id').primaryKey(),
  storeId: text('storeId')
    .notNull()
    .references(() => stores.id),
  label: text('label').notNull(),
  imageUrl: text('imageUrl').notNull(),
  createdAt: integer('createdAt', { mode: 'timestamp' }).default(
    sql`(strftime('%s', 'now'))`
  ),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).default(
    sql`(strftime('%s', 'now'))`
  ),
}, (table) => ({
  storeIdIdx: index('billboards_storeId_idx').on(table.storeId),
}));

export type Billboard = InferSelectModel<typeof billboards>;

export const billboardsRelations = relations(billboards, ({ one, many }) => ({
  store: one(stores, {
    fields: [billboards.storeId],
    references: [stores.id],
  }),
  categories: many(categories),
}));

export const categories = sqliteTable('categories', {
  id: text('id').primaryKey(),
  storeId: text('storeId')
    .notNull()
    .references(() => stores.id),
  billboardId: text('billboardId')
    .notNull()
    .references(() => billboards.id),
  name: text('name').notNull(),
  createdAt: integer('createdAt', { mode: 'timestamp' }).default(
    sql`(strftime('%s', 'now'))`
  ),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).default(
    sql`(strftime('%s', 'now'))`
  ),
}, (table) => ({
  storeIdIdx: index('categories_storeId_idx').on(table.storeId),
  billboardIdIdx: index('categories_billboardId_idx').on(table.billboardId),
}));

export type Category = InferSelectModel<typeof categories>;

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  store: one(stores, {
    fields: [categories.storeId],
    references: [stores.id],
  }),
  billboard: one(billboards, {
    fields: [categories.billboardId],
    references: [billboards.id],
  }),
  products: many(products),
}));

export const sizes = sqliteTable('sizes', {
  id: text('id').primaryKey(),
  storeId: text('storeId')
    .notNull()
    .references(() => stores.id),
  name: text('name').notNull(),
  value: text('value').notNull(),
  createdAt: integer('createdAt', { mode: 'timestamp' }).default(
    sql`(strftime('%s', 'now'))`
  ),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).default(
    sql`(strftime('%s', 'now'))`
  ),
}, (table) => ({
  storeIdIdx: index('sizes_storeId_idx').on(table.storeId),
}));

export type Size = InferSelectModel<typeof sizes>;

export const sizesRelations = relations(sizes, ({ one, many }) => ({
  store: one(stores, {
    fields: [sizes.storeId],
    references: [stores.id],
  }),
  products: many(products),
}));

export const colors = sqliteTable('colors', {
  id: text('id').primaryKey(),
  storeId: text('storeId')
    .notNull()
    .references(() => stores.id),
  name: text('name').notNull(),
  value: text('value').notNull(),
  createdAt: integer('createdAt', { mode: 'timestamp' }).default(
    sql`(strftime('%s', 'now'))`
  ),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).default(
    sql`(strftime('%s', 'now'))`
  ),
}, (table) => ({
  storeIdIdx: index('colors_storeId_idx').on(table.storeId),
}));

export type Color = InferSelectModel<typeof colors>;

export const colorsRelations = relations(colors, ({ one, many }) => ({
  store: one(stores, {
    fields: [colors.storeId],
    references: [stores.id],
  }),
  products: many(products),
}));

export const products = sqliteTable('products', {
  id: text('id').primaryKey(),
  storeId: text('storeId')
    .notNull()
    .references(() => stores.id),
  categoryId: text('categoryId')
    .notNull()
    .references(() => categories.id),
  name: text('name').notNull(),
  price: real('price').notNull(),
  isFeatured: integer('isFeatured', { mode: 'boolean' })
    .notNull()
    .default(false),
  isArchived: integer('isArchived', { mode: 'boolean' })
    .notNull()
    .default(false),
  sizeId: text('sizeId')
    .notNull()
    .references(() => sizes.id),
  colorId: text('colorId')
    .notNull()
    .references(() => colors.id),
  createdAt: integer('createdAt', { mode: 'timestamp' }).default(
    sql`(strftime('%s', 'now'))`
  ),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).default(
    sql`(strftime('%s', 'now'))`
  ),
}, (table) => ({
  storeIdIdx: index('products_storeId_idx').on(table.storeId),
  categoryIdIdx: index('products_categoryId_idx').on(table.categoryId),
  sizeIdIdx: index('products_sizeId_idx').on(table.sizeId),
  colorIdIdx: index('products_colorId_idx').on(table.colorId),
}));

export type Product = InferSelectModel<typeof products>;

export const productsRelations = relations(products, ({ one, many }) => ({
  store: one(stores, {
    fields: [products.storeId],
    references: [stores.id],
  }),
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  size: one(sizes, {
    fields: [products.sizeId],
    references: [sizes.id],
  }),
  color: one(colors, {
    fields: [products.colorId],
    references: [colors.id],
  }),
  images: many(images),
  orderItems: many(orderItems),
}));

export const images = sqliteTable('images', {
  id: text('id').primaryKey(),
  productId: text('productId')
    .notNull()
    .references(() => products.id, { onDelete: 'cascade' }),
  url: text('url').notNull(),
  createdAt: integer('createdAt', { mode: 'timestamp' }).default(
    sql`(strftime('%s', 'now'))`
  ),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).default(
    sql`(strftime('%s', 'now'))`
  ),
}, (table) => ({
  productIdIdx: index('images_productId_idx').on(table.productId),
}));

export type Image = InferSelectModel<typeof images>;

export const imagesRelations = relations(images, ({ one }) => ({
  product: one(products, {
    fields: [images.productId],
    references: [products.id],
  }),
}));

export const orders = sqliteTable('orders', {
  id: text('id').primaryKey(),
  storeId: text('storeId')
    .notNull()
    .references(() => stores.id),
  isPaid: integer('isPaid', { mode: 'boolean' }).notNull().default(false),
  phone: text('phone').notNull().default(''),
  address: text('address').notNull().default(''),
  createdAt: integer('createdAt', { mode: 'timestamp' }).default(
    sql`(strftime('%s', 'now'))`
  ),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).default(
    sql`(strftime('%s', 'now'))`
  ),
}, (table) => ({
  storeIdIdx: index('orders_storeId_idx').on(table.storeId),
}));

export type Order = InferSelectModel<typeof orders>;

export const ordersRelations = relations(orders, ({ one, many }) => ({
  store: one(stores, {
    fields: [orders.storeId],
    references: [stores.id],
  }),
  orderItems: many(orderItems),
}));

export const orderItems = sqliteTable('orderItems', {
  id: text('id').primaryKey(),
  orderId: text('orderId')
    .notNull()
    .references(() => orders.id),
  productId: text('productId')
    .notNull()
    .references(() => products.id),
}, (table) => ({
  orderIdIdx: index('orderItems_orderId_idx').on(table.orderId),
  productIdIdx: index('orderItems_productId_idx').on(table.productId),
}));

export type OrderItem = InferSelectModel<typeof orderItems>;

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));
