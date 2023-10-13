-- CreateIndex
CREATE FULLTEXT INDEX `products_name_description_tags_idx` ON `products`(`name`, `description`, `tags`);
