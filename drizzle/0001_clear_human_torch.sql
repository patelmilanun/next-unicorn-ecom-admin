CREATE INDEX `billboards_storeId_idx` ON `billboards` (`storeId`);--> statement-breakpoint
CREATE INDEX `categories_storeId_idx` ON `categories` (`storeId`);--> statement-breakpoint
CREATE INDEX `categories_billboardId_idx` ON `categories` (`billboardId`);--> statement-breakpoint
CREATE INDEX `colors_storeId_idx` ON `colors` (`storeId`);--> statement-breakpoint
CREATE INDEX `images_productId_idx` ON `images` (`productId`);--> statement-breakpoint
CREATE INDEX `orderItems_orderId_idx` ON `orderItems` (`orderId`);--> statement-breakpoint
CREATE INDEX `orderItems_productId_idx` ON `orderItems` (`productId`);--> statement-breakpoint
CREATE INDEX `orders_storeId_idx` ON `orders` (`storeId`);--> statement-breakpoint
CREATE INDEX `products_storeId_idx` ON `products` (`storeId`);--> statement-breakpoint
CREATE INDEX `products_categoryId_idx` ON `products` (`categoryId`);--> statement-breakpoint
CREATE INDEX `products_sizeId_idx` ON `products` (`sizeId`);--> statement-breakpoint
CREATE INDEX `products_colorId_idx` ON `products` (`colorId`);--> statement-breakpoint
CREATE INDEX `sizes_storeId_idx` ON `sizes` (`storeId`);--> statement-breakpoint
CREATE INDEX `stores_userId_idx` ON `stores` (`userId`);