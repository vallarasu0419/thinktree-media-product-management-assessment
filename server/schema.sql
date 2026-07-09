-- =============================================================================
--  PRODUCT MANAGEMENT — MySQL Schema
--  Requirements: MySQL 8.0.16+  (CHECK constraints + generated columns)
--  Engine/Charset: InnoDB / utf8mb4  |  Collation: utf8mb4_unicode_ci
-- =============================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

CREATE DATABASE IF NOT EXISTS `product_management`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `product_management`;

-- =============================================================================
-- 1) USERS
-- =============================================================================
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id`             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name`           VARCHAR(100)    NOT NULL,
  `email`          VARCHAR(191)    NOT NULL,
  `password_hash`  VARCHAR(255)    NOT NULL,
  `role`           ENUM('super_admin','admin','staff','user') NOT NULL DEFAULT 'user',
  `is_active`      TINYINT(1)      NOT NULL DEFAULT 1,
  `last_login_at`  DATETIME        NULL     DEFAULT NULL,
  `created_at`     TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`     TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP
                                            ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_users_email` (`email`),
  KEY `idx_users_role_active` (`role`, `is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- 2) CATEGORIES
-- =============================================================================
DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `id`           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name`         VARCHAR(100)    NOT NULL,
  `slug`         VARCHAR(120)    NOT NULL,
  `description`  TEXT            NULL     DEFAULT NULL,
  `parent_id`    BIGINT UNSIGNED NULL     DEFAULT NULL,
  `is_active`    TINYINT(1)      NOT NULL DEFAULT 1,
  `sort_order`   INT             NOT NULL DEFAULT 0,
  `created_at`   TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`   TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP
                                          ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_categories_name` (`name`),
  UNIQUE KEY `uq_categories_slug` (`slug`),
  KEY `idx_categories_parent` (`parent_id`),
  KEY `idx_categories_active` (`is_active`),
  CONSTRAINT `fk_categories_parent`
    FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- 3) PRODUCTS
-- =============================================================================
DROP TABLE IF EXISTS `products`;
CREATE TABLE `products` (
  `id`                BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `sku`               VARCHAR(64)     NOT NULL,
  `name`              VARCHAR(200)    NOT NULL,
  `slug`              VARCHAR(220)    NOT NULL,
  `category_id`       BIGINT UNSIGNED NOT NULL,
  `short_description` VARCHAR(500)    NOT NULL,
  `description`       TEXT            NULL     DEFAULT NULL,
  `price`             DECIMAL(10,2)   NOT NULL,
  `compare_at_price`  DECIMAL(10,2)   NOT NULL,
  `currency`          CHAR(3)         NOT NULL DEFAULT 'INR',
  `stock_quantity`    INT             NOT NULL DEFAULT 0,
  `is_in_stock`       TINYINT(1)      AS (`stock_quantity` > 0) STORED,
  `low_stock_threshold` INT           NOT NULL DEFAULT 5,
  `status`            ENUM('active','inactive') NOT NULL DEFAULT 'active',
  `is_featured`       TINYINT(1)      NOT NULL DEFAULT 0,
  `weight_grams`      INT             NOT NULL,
  `created_by`        BIGINT UNSIGNED NULL     DEFAULT NULL,
  `updated_by`        BIGINT UNSIGNED NULL     DEFAULT NULL,
  `created_at`        TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`        TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP
                                               ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at`        DATETIME        NULL     DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_products_sku`  (`sku`),
  UNIQUE KEY `uq_products_slug` (`slug`),
  KEY `idx_products_category`  (`category_id`),
  KEY `idx_products_price`     (`price`),
  KEY `idx_products_instock`   (`is_in_stock`),
  KEY `idx_products_name`      (`name`),
  KEY `idx_products_deleted`   (`deleted_at`),
  KEY `idx_products_listing`   (`status`, `category_id`, `created_at`),
  KEY `idx_products_created_by`(`created_by`),
  KEY `idx_products_updated_by`(`updated_by`),
  FULLTEXT KEY `ft_products_search` (`name`, `short_description`, `description`),
  CONSTRAINT `chk_products_price`   CHECK (`price` >= 0),
  CONSTRAINT `chk_products_compare` CHECK (`compare_at_price` >= 0),
  CONSTRAINT `chk_products_stock`   CHECK (`stock_quantity` >= 0),
  CONSTRAINT `chk_products_weight`  CHECK (`weight_grams` >= 0),
  CONSTRAINT `fk_products_category`
    FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_products_created_by`
    FOREIGN KEY (`created_by`) REFERENCES `users` (`id`)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_products_updated_by`
    FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- 4) PRODUCT_IMAGES
-- =============================================================================
DROP TABLE IF EXISTS `product_images`;
CREATE TABLE `product_images` (
  `id`          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `product_id`  BIGINT UNSIGNED NOT NULL,
  `image_url`   VARCHAR(500)    NOT NULL,
  `alt_text`    VARCHAR(200)    NULL     DEFAULT NULL,
  `is_primary`  TINYINT(1)      NOT NULL DEFAULT 0,
  `sort_order`  INT             NOT NULL DEFAULT 0,
  `created_at`  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_prodimg_product` (`product_id`),
  KEY `idx_prodimg_primary` (`product_id`, `is_primary`),
  CONSTRAINT `fk_prodimg_product`
    FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- 5) REFRESH_TOKENS
-- =============================================================================
DROP TABLE IF EXISTS `refresh_tokens`;
CREATE TABLE `refresh_tokens` (
  `id`          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id`     BIGINT UNSIGNED NOT NULL,
  `token_hash`  VARCHAR(255)    NOT NULL,
  `expires_at`  DATETIME        NOT NULL,
  `revoked_at`  DATETIME        NULL     DEFAULT NULL,
  `user_agent`  VARCHAR(255)    NULL     DEFAULT NULL,
  `ip_address`  VARCHAR(45)     NULL     DEFAULT NULL,
  `created_at`  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_refresh_token_hash` (`token_hash`),
  KEY `idx_refresh_user` (`user_id`),
  KEY `idx_refresh_expiry` (`expires_at`),
  CONSTRAINT `fk_refresh_user`
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- 6) VIEW — flattened listing
-- =============================================================================
DROP VIEW IF EXISTS `vw_product_listing`;
CREATE VIEW `vw_product_listing` AS
SELECT
  p.`id`, p.`sku`, p.`name`, p.`slug`, p.`price`, p.`compare_at_price`,
  p.`currency`, p.`stock_quantity`, p.`is_in_stock`,
  (SELECT pi.`image_url` FROM `product_images` pi
    WHERE pi.`product_id` = p.`id`
    ORDER BY pi.`is_primary` DESC, pi.`sort_order` ASC LIMIT 1) AS `primary_image_url`,
  (SELECT COUNT(*) FROM `product_images` pi2 WHERE pi2.`product_id` = p.`id`) AS `image_count`,
  p.`status`, p.`is_featured`, p.`category_id`,
  c.`name` AS `category_name`, c.`slug` AS `category_slug`,
  p.`short_description`, p.`created_at`
FROM `products` p
JOIN `categories` c ON c.`id` = p.`category_id`
WHERE p.`deleted_at` IS NULL;

SET FOREIGN_KEY_CHECKS = 1;

-- =============================================================================
-- 7) SEED DATA
-- =============================================================================
-- Default admin. password_hash is a bcrypt hash of 'Admin@123'.
INSERT INTO `users` (`name`, `email`, `password_hash`, `role`, `is_active`) VALUES
('Super Admin', 'admin@example.com',
 '$2b$10$3ozPzfobQ.5PJICG20cmoOhiOr/N.goz9bZ9iNx9vvJ1KM33uoSIC', 'super_admin', 1);

INSERT INTO `categories` (`name`, `slug`, `description`, `sort_order`) VALUES
('Electronics', 'electronics', 'Phones, laptops, accessories', 1),
('Clothing',    'clothing',    'Men, women and kids apparel',   2),
('Books',       'books',       'Fiction, non-fiction, academic', 3),
('Home & Kitchen', 'home-kitchen', 'Appliances and home essentials', 4),
('Sports & Fitness', 'sports-fitness', 'Gym gear, activewear and equipment', 5),
('Toys & Games', 'toys-games', 'Toys, puzzles and board games', 6),
('Beauty & Personal Care', 'beauty-personal-care', 'Skincare, haircare and grooming', 7),
('Furniture', 'furniture', 'Living room, bedroom and office furniture', 8),
('Groceries', 'groceries', 'Everyday essentials and pantry staples', 9),
('Automotive', 'automotive', 'Car and bike accessories', 10),
('Health & Wellness', 'health-wellness', 'Supplements and wellness products', 11),
('Music & Instruments', 'music-instruments', 'Instruments and audio gear', 12);

INSERT INTO `products`
  (`sku`, `name`, `slug`, `category_id`, `short_description`,
   `price`, `compare_at_price`, `stock_quantity`, `low_stock_threshold`,
   `weight_grams`, `status`, `is_featured`, `created_by`)
VALUES
('ELEC-1001', 'Wireless Headphones', 'wireless-headphones',
   (SELECT id FROM categories WHERE slug='electronics'),
   'Over-ear Bluetooth headphones with noise cancellation',
   2999.00, 3999.00, 50, 5, 320, 'active', 1, 1),
('ELEC-1002', 'Smart Watch', 'smart-watch',
   (SELECT id FROM categories WHERE slug='electronics'),
   'Fitness tracking smart watch with heart-rate sensor',
   4599.00, 5999.00, 0, 5, 45, 'active', 0, 1),
('BOOK-2001', 'Clean Code', 'clean-code',
   (SELECT id FROM categories WHERE slug='books'),
   'A handbook of agile software craftsmanship',
   540.00, 699.00, 120, 10, 450, 'active', 1, 1),
('CLTH-3001', 'Cotton T-Shirt', 'cotton-t-shirt',
   (SELECT id FROM categories WHERE slug='clothing'),
   '100% cotton round-neck t-shirt',
   399.00, 599.00, 200, 20, 180, 'active', 0, 1);

INSERT INTO `product_images` (`product_id`, `image_url`, `alt_text`, `is_primary`, `sort_order`) VALUES
((SELECT id FROM products WHERE sku='ELEC-1001'), 'https://picsum.photos/seed/headphones/600/400',  'Headphones front', 1, 0),
((SELECT id FROM products WHERE sku='ELEC-1001'), 'https://picsum.photos/seed/headphones2/600/400', 'Headphones side',  0, 1),
((SELECT id FROM products WHERE sku='ELEC-1002'), 'https://picsum.photos/seed/smartwatch/600/400',  'Smart watch front', 1, 0),
((SELECT id FROM products WHERE sku='BOOK-2001'),  'https://picsum.photos/seed/cleancode/600/400',   'Clean Code cover',  1, 0),
((SELECT id FROM products WHERE sku='CLTH-3001'),  'https://picsum.photos/seed/tshirt/600/400',      'Cotton t-shirt',    1, 0);
