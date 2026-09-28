-- Required because TypeORM schema synchronization is disabled.
-- Keep order rows after a product is deleted by allowing the product FK to be NULL.
ALTER TABLE `order` MODIFY `product_id` int NULL;