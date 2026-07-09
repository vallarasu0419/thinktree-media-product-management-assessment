-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: product_management
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'e.g. Electronics',
  `slug` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'URL-safe key, e.g. electronics',
  `description` text COLLATE utf8mb4_unicode_ci,
  `parent_id` bigint unsigned DEFAULT NULL COMMENT 'Self-reference for sub-categories',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `sort_order` int NOT NULL DEFAULT '0' COMMENT 'Manual ordering in menus',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_categories_name` (`name`),
  UNIQUE KEY `uq_categories_slug` (`slug`),
  KEY `idx_categories_parent` (`parent_id`),
  KEY `idx_categories_active` (`is_active`),
  CONSTRAINT `fk_categories_parent` FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Product categories (supports nested sub-categories)';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Electronics','electronics','Phones, laptops, accessories',NULL,1,1,'2026-07-07 07:47:10','2026-07-07 07:47:10'),(2,'Clothing','clothing','Men, women and kids apparel',NULL,1,2,'2026-07-07 07:47:10','2026-07-07 07:47:10'),(3,'Books','books','Fiction, non-fiction, academic',NULL,1,3,'2026-07-07 07:47:10','2026-07-07 07:47:10'),(4,'Home & Kitchen','home-kitchen','Appliances and home essentials',NULL,1,4,'2026-07-07 07:47:10','2026-07-07 07:47:10'),(5,'Foods','foods','Everyday food items across staples, snacks and fresh produce',NULL,1,1,'2026-07-09 06:36:26','2026-07-09 06:36:26'),(6,'Biscuits','biscuits','Sweet and savoury biscuits, cookies and crackers',NULL,1,2,'2026-07-09 06:36:26','2026-07-09 06:36:26'),(9,'Rice & Grains','rice-grains','Rice, wheat, millets and other grains',5,1,1,'2026-07-09 06:36:34','2026-07-09 06:36:34'),(10,'Pulses & Lentils','pulses-lentils','Dals, beans and legumes',5,1,2,'2026-07-09 06:36:34','2026-07-09 06:36:34'),(11,'Spices & Masalas','spices-masalas','Whole and ground spices, blended masalas',5,1,3,'2026-07-09 06:36:34','2026-07-09 06:36:34'),(12,'Cooking Oils','cooking-oils','Sunflower, groundnut, coconut and olive oils',5,1,4,'2026-07-09 06:36:34','2026-07-09 06:36:34'),(13,'Snacks & Namkeen','snacks-namkeen','Chips, mixtures, savoury snacks',5,1,5,'2026-07-09 06:36:34','2026-07-09 06:36:34'),(14,'Dairy & Eggs','dairy-eggs','Milk, curd, paneer, butter, cheese and eggs',5,1,6,'2026-07-09 06:36:34','2026-07-09 06:36:34'),(15,'Beverages','beverages','Tea, coffee, juices and soft drinks',5,1,7,'2026-07-09 06:36:34','2026-07-09 06:36:34'),(16,'Instant & Ready Mix','instant-ready-mix','Noodles, pasta, soups and ready-to-cook mixes',5,1,8,'2026-07-09 06:36:34','2026-07-09 06:36:34'),(17,'Cream Biscuits','cream-biscuits','Filled biscuits with cream centres',6,1,1,'2026-07-09 06:36:38','2026-07-09 06:36:38'),(18,'Cookies','cookies','Butter, choco-chip and nut cookies',6,1,2,'2026-07-09 06:36:38','2026-07-09 06:36:38'),(19,'Marie & Digestive','marie-digestive','Light tea biscuits and digestive varieties',6,1,3,'2026-07-09 06:36:38','2026-07-09 06:36:38'),(20,'Glucose Biscuits','glucose-biscuits','Classic glucose and milk biscuits',6,1,4,'2026-07-09 06:36:38','2026-07-09 06:36:38'),(21,'Crackers','crackers','Salted, cream and savoury crackers',6,1,5,'2026-07-09 06:36:38','2026-07-09 06:36:38'),(22,'Wafers','wafers','Layered wafer biscuits in assorted flavours',6,1,6,'2026-07-09 06:36:38','2026-07-09 06:36:38'),(23,'Rusk & Toast','rusk-toast','Baked rusks and toasted breads',6,1,7,'2026-07-09 06:36:38','2026-07-09 06:36:38'),(24,'Healthy Biscuits','healthy-biscuits','Oats, ragi, multigrain and sugar-free',6,1,8,'2026-07-09 06:36:38','2026-07-09 06:36:38');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_images`
--

DROP TABLE IF EXISTS `product_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_images` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `product_id` bigint unsigned NOT NULL,
  `image_url` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `alt_text` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Accessibility / SEO',
  `is_primary` tinyint(1) NOT NULL DEFAULT '0' COMMENT '1 = thumbnail shown on cards',
  `sort_order` int NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_prodimg_product` (`product_id`),
  KEY `idx_prodimg_primary` (`product_id`,`is_primary`),
  CONSTRAINT `fk_prodimg_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=58 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Multiple images per product (gallery)';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_images`
--

LOCK TABLES `product_images` WRITE;
/*!40000 ALTER TABLE `product_images` DISABLE KEYS */;
INSERT INTO `product_images` VALUES (3,1,'http://localhost:5000/product-images/product-1783421496918-862039300.jpg','Headphones front',1,0,'2026-07-07 11:36:17'),(4,1,'http://localhost:5000/product-images/product-1783424164969-586033804.jpg',NULL,0,1,'2026-07-07 11:36:17'),(5,1,'http://localhost:5000/product-images/product-1783424164974-874278751.jpg',NULL,0,2,'2026-07-07 11:36:17'),(6,1,'http://localhost:5000/product-images/product-1783424164976-278327114.jpg',NULL,0,3,'2026-07-07 11:36:17'),(7,2,'http://localhost:5000/product-images/product-1783424226659-290345052.jpg',NULL,1,0,'2026-07-07 11:37:36'),(8,2,'http://localhost:5000/product-images/product-1783424226660-48623682.jpg',NULL,0,1,'2026-07-07 11:37:36'),(9,2,'http://localhost:5000/product-images/product-1783424226662-519029708.jpg',NULL,0,2,'2026-07-07 11:37:36'),(10,2,'http://localhost:5000/product-images/product-1783424226664-493325348.jpg',NULL,0,3,'2026-07-07 11:37:36'),(19,4,'http://localhost:5000/product-images/product-1783424288610-738409919.jpg',NULL,1,0,'2026-07-07 11:50:01'),(20,4,'http://localhost:5000/product-images/product-1783424288611-566124381.jpg',NULL,0,1,'2026-07-07 11:50:01'),(21,4,'http://localhost:5000/product-images/product-1783424288611-161371829.jpg',NULL,0,2,'2026-07-07 11:50:01'),(22,4,'http://localhost:5000/product-images/product-1783424288614-981782468.jpg',NULL,0,3,'2026-07-07 11:50:01'),(23,3,'http://localhost:5000/product-images/product-1783424267716-266371458.jpg',NULL,1,0,'2026-07-09 06:38:34'),(24,3,'http://localhost:5000/product-images/product-1783424267717-914064266.jpg',NULL,0,1,'2026-07-09 06:38:34'),(25,3,'http://localhost:5000/product-images/product-1783424267748-282817948.jpg',NULL,0,2,'2026-07-09 06:38:34'),(26,3,'http://localhost:5000/product-images/product-1783424267749-683793789.jpg',NULL,0,3,'2026-07-09 06:38:34'),(27,5,'http://localhost:5000/product-images/product-1783421496918-862039300.jpg','Basmati Rice 5kg',1,0,'2026-07-09 07:21:37'),(28,6,'http://localhost:5000/product-images/product-1783424164969-586033804.jpg','Whole Wheat Atta 5kg',1,0,'2026-07-09 07:21:37'),(29,7,'http://localhost:5000/product-images/product-1783424164974-874278751.jpg','Foxtail Millet 1kg',1,0,'2026-07-09 07:21:37'),(30,8,'http://localhost:5000/product-images/product-1783424164976-278327114.jpg','Toor Dal 1kg',1,0,'2026-07-09 07:21:37'),(31,9,'http://localhost:5000/product-images/product-1783424226659-290345052.jpg','Moong Dal 1kg',1,0,'2026-07-09 07:21:37'),(32,10,'http://localhost:5000/product-images/product-1783424226660-48623682.jpg','Turmeric Powder 200g',1,0,'2026-07-09 07:21:37'),(33,11,'http://localhost:5000/product-images/product-1783424226662-519029708.jpg','Garam Masala 100g',1,0,'2026-07-09 07:21:37'),(34,12,'http://localhost:5000/product-images/product-1783424226664-493325348.jpg','Sunflower Oil 1L',1,0,'2026-07-09 07:21:37'),(35,13,'http://localhost:5000/product-images/product-1783424288610-738409919.jpg','Cold Pressed Coconut Oil 1L',1,0,'2026-07-09 07:21:37'),(36,14,'http://localhost:5000/product-images/product-1783424288611-566124381.jpg','Potato Chips Classic 150g',1,0,'2026-07-09 07:21:37'),(37,15,'http://localhost:5000/product-images/product-1783424288611-161371829.jpg','Mixture Namkeen 400g',1,0,'2026-07-09 07:21:37'),(38,16,'http://localhost:5000/product-images/product-1783424288614-981782468.jpg','Fresh Paneer 200g',1,0,'2026-07-09 07:21:37'),(39,17,'http://localhost:5000/product-images/product-1783424267716-266371458.jpg','Farm Eggs (Pack of 12)',1,0,'2026-07-09 07:21:37'),(40,18,'http://localhost:5000/product-images/product-1783424267717-914064266.jpg','Assam Tea 500g',1,0,'2026-07-09 07:21:37'),(41,19,'http://localhost:5000/product-images/product-1783424267748-282817948.jpg','Filter Coffee Powder 250g',1,0,'2026-07-09 07:21:37'),(42,20,'http://localhost:5000/product-images/product-1783424267749-683793789.jpg','Instant Noodles Masala (Pack of 6)',1,0,'2026-07-09 07:21:37'),(43,21,'http://localhost:5000/product-images/product-1783421496918-862039300.jpg','Tomato Soup Mix 60g',1,0,'2026-07-09 07:21:37'),(44,22,'http://localhost:5000/product-images/product-1783424164969-586033804.jpg','Chocolate Cream Biscuits 300g',1,0,'2026-07-09 07:21:37'),(45,23,'http://localhost:5000/product-images/product-1783424164974-874278751.jpg','Butter Cookies 250g',1,0,'2026-07-09 07:21:37'),(46,24,'http://localhost:5000/product-images/product-1783424164976-278327114.jpg','Marie Light Biscuits 250g',1,0,'2026-07-09 07:21:37'),(47,25,'http://localhost:5000/product-images/product-1783424226659-290345052.jpg','Glucose Biscuits 400g',1,0,'2026-07-09 07:21:37'),(48,26,'http://localhost:5000/product-images/product-1783424226660-48623682.jpg','Salted Crackers 200g',1,0,'2026-07-09 07:21:37'),(49,27,'http://localhost:5000/product-images/product-1783424226662-519029708.jpg','Vanilla Wafers 150g',1,0,'2026-07-09 07:21:37'),(50,28,'http://localhost:5000/product-images/product-1783424226664-493325348.jpg','Milk Rusk 300g',1,0,'2026-07-09 07:21:37'),(51,29,'http://localhost:5000/product-images/product-1783424288610-738409919.jpg','Ragi Multigrain Biscuits 250g',1,0,'2026-07-09 07:21:37');
/*!40000 ALTER TABLE `product_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `sku` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Stock Keeping Unit (unique business code)',
  `name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(220) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'URL-safe key for details page',
  `category_id` bigint unsigned NOT NULL,
  `short_description` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'One-line summary for cards',
  `description` text COLLATE utf8mb4_unicode_ci COMMENT 'Full description (details page)',
  `price` decimal(10,2) NOT NULL COMMENT 'Selling price',
  `compare_at_price` decimal(10,2) DEFAULT NULL COMMENT 'Original/MRP price for showing discounts',
  `currency` char(3) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'INR' COMMENT 'ISO 4217 currency code',
  `stock_quantity` int NOT NULL DEFAULT '0',
  `is_in_stock` tinyint(1) GENERATED ALWAYS AS ((`stock_quantity` > 0)) STORED COMMENT 'Generated: indexable stock-availability flag',
  `low_stock_threshold` int NOT NULL DEFAULT '5' COMMENT 'For low-stock alerts',
  `image_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('draft','active','archived') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `is_featured` tinyint(1) NOT NULL DEFAULT '0',
  `weight_grams` int DEFAULT NULL COMMENT 'Optional shipping weight',
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT NULL COMMENT 'Soft delete — non-null = deleted',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_products_sku` (`sku`),
  UNIQUE KEY `uq_products_slug` (`slug`),
  KEY `idx_products_category` (`category_id`),
  KEY `idx_products_price` (`price`),
  KEY `idx_products_instock` (`is_in_stock`),
  KEY `idx_products_name` (`name`),
  KEY `idx_products_deleted` (`deleted_at`),
  KEY `idx_products_listing` (`status`,`category_id`,`created_at`),
  KEY `idx_products_created_by` (`created_by`),
  KEY `idx_products_updated_by` (`updated_by`),
  FULLTEXT KEY `ft_products_search` (`name`,`short_description`,`description`),
  CONSTRAINT `fk_products_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_products_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_products_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `chk_products_compare` CHECK (((`compare_at_price` is null) or (`compare_at_price` >= 0))),
  CONSTRAINT `chk_products_price` CHECK ((`price` >= 0)),
  CONSTRAINT `chk_products_stock` CHECK ((`stock_quantity` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Products — listing, details and CRUD source of truth';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` (`id`, `sku`, `name`, `slug`, `category_id`, `short_description`, `description`, `price`, `compare_at_price`, `currency`, `stock_quantity`, `low_stock_threshold`, `image_url`, `status`, `is_featured`, `weight_grams`, `created_by`, `updated_by`, `created_at`, `updated_at`, `deleted_at`) VALUES (1,'ELEC-1001','Wireless Headphones','wireless-headphones',1,'Over-ear Bluetooth headphones with noise cancellation',NULL,2999.00,3999.00,'INR',50,5,'http://localhost:5000/product-images/product-1783421598017-726366690.jpg','active',1,100,1,1,'2026-07-07 07:47:10','2026-07-07 11:36:17',NULL),(2,'ELEC-1002','Smart Watch','smart-watch',1,'Fitness tracking smart watch with heart-rate sensor',NULL,4599.00,4300.00,'INR',0,5,'http://localhost:5000/product-images/product-1783421496918-862039300.jpg','active',0,1000,1,1,'2026-07-07 07:47:10','2026-07-07 11:37:36',NULL),(3,'BISCUITS-2001','Cream Biscuits','cream-biscuits',6,'A handbook of agile software craftsmanship',NULL,540.00,699.00,'INR',120,5,'http://localhost:5000/product-images/product-1783421496918-862039300.jpg','active',1,200,1,1,'2026-07-07 07:47:10','2026-07-09 06:38:34',NULL),(4,'CLTH-3001','Cotton T-Shirt','cotton-t-shirt',2,'100% cotton round-neck t-shirt',NULL,399.00,350.00,'INR',200,5,'http://localhost:5000/product-images/product-1783421496918-862039300.jpg','active',0,500,1,1,'2026-07-07 07:47:10','2026-07-07 11:38:22',NULL),(5,'SKU-RG-001','Basmati Rice 5kg','basmati-rice-5kg',9,'Long-grain aged basmati rice','Premium aged basmati rice with a delicate aroma. Ideal for biryani and pulao.',749.00,899.00,'INR',120,10,'http://localhost:5000/product-images/product-1783421496918-862039300.jpg','active',1,5000,1,1,'2026-07-09 07:21:11','2026-07-09 07:21:11',NULL),(6,'SKU-RG-002','Whole Wheat Atta 5kg','whole-wheat-atta-5kg',9,'Stone-ground chakki atta','100% whole wheat flour, stone ground for soft rotis.',285.00,320.00,'INR',200,20,'http://localhost:5000/product-images/product-1783424164969-586033804.jpg','active',0,5000,1,1,'2026-07-09 07:21:11','2026-07-09 07:21:11',NULL),(7,'SKU-RG-003','Foxtail Millet 1kg','foxtail-millet-1kg',9,'High-fibre foxtail millet','Naturally gluten-free millet, rich in fibre and minerals.',129.00,150.00,'INR',80,10,'http://localhost:5000/product-images/product-1783424164974-874278751.jpg','active',0,1000,1,1,'2026-07-09 07:21:11','2026-07-09 07:21:11',NULL),(8,'SKU-PL-001','Toor Dal 1kg','toor-dal-1kg',10,'Unpolished toor dal','Premium unpolished split pigeon peas. Cooks evenly.',165.00,185.00,'INR',150,15,'http://localhost:5000/product-images/product-1783424164976-278327114.jpg','active',0,1000,1,1,'2026-07-09 07:21:11','2026-07-09 07:21:11',NULL),(9,'SKU-PL-002','Moong Dal 1kg','moong-dal-1kg',10,'Split yellow moong dal','Light, easy-to-digest split moong dal.',148.00,170.00,'INR',140,15,'http://localhost:5000/product-images/product-1783424226659-290345052.jpg','active',0,1000,1,1,'2026-07-09 07:21:11','2026-07-09 07:21:11',NULL),(10,'SKU-SM-001','Turmeric Powder 200g','turmeric-powder-200g',11,'Pure ground turmeric','Single-origin turmeric with high curcumin content.',85.00,99.00,'INR',300,25,'http://localhost:5000/product-images/product-1783424226660-48623682.jpg','active',0,200,1,1,'2026-07-09 07:21:11','2026-07-09 07:21:11',NULL),(11,'SKU-SM-002','Garam Masala 100g','garam-masala-100g',11,'Aromatic blended masala','A balanced blend of twelve roasted whole spices.',95.00,110.00,'INR',220,20,'http://localhost:5000/product-images/product-1783424226662-519029708.jpg','active',0,100,1,1,'2026-07-09 07:21:11','2026-07-09 07:21:11',NULL),(12,'SKU-CO-001','Sunflower Oil 1L','sunflower-oil-1l',12,'Refined sunflower cooking oil','Light, neutral-tasting refined sunflower oil for everyday cooking.',175.00,199.00,'INR',180,20,'http://localhost:5000/product-images/product-1783424226664-493325348.jpg','active',0,1000,1,1,'2026-07-09 07:21:11','2026-07-09 07:21:11',NULL),(13,'SKU-CO-002','Cold Pressed Coconut Oil 1L','cold-pressed-coconut-oil-1l',12,'Virgin cold pressed coconut oil','Unrefined, chemical-free coconut oil pressed at low temperature.',420.00,480.00,'INR',60,10,'http://localhost:5000/product-images/product-1783424288610-738409919.jpg','active',1,1000,1,1,'2026-07-09 07:21:11','2026-07-09 07:21:11',NULL),(14,'SKU-SN-001','Potato Chips Classic 150g','potato-chips-classic-150g',13,'Lightly salted potato chips','Thin-cut potato chips fried in sunflower oil, lightly salted.',60.00,70.00,'INR',400,40,'http://localhost:5000/product-images/product-1783424288611-566124381.jpg','active',0,150,1,1,'2026-07-09 07:21:11','2026-07-09 07:21:11',NULL),(15,'SKU-SN-002','Mixture Namkeen 400g','mixture-namkeen-400g',13,'South Indian style mixture','Crunchy savoury mixture with sev, peanuts and curry leaves.',135.00,160.00,'INR',160,15,'http://localhost:5000/product-images/product-1783424288611-161371829.jpg','active',0,400,1,1,'2026-07-09 07:21:11','2026-07-09 07:21:11',NULL),(16,'SKU-DE-001','Fresh Paneer 200g','fresh-paneer-200g',14,'Soft cottage cheese block','Freshly made paneer, soft texture, no preservatives.',95.00,110.00,'INR',45,10,'http://localhost:5000/product-images/product-1783424288614-981782468.jpg','active',0,200,1,1,'2026-07-09 07:21:11','2026-07-09 07:21:11',NULL),(17,'SKU-DE-002','Farm Eggs (Pack of 12)','farm-eggs-pack-of-12',14,'Free-range brown eggs','Twelve free-range brown eggs from local farms.',110.00,125.00,'INR',90,12,'http://localhost:5000/product-images/product-1783424267716-266371458.jpg','active',0,720,1,1,'2026-07-09 07:21:11','2026-07-09 07:21:11',NULL),(18,'SKU-BV-001','Assam Tea 500g','assam-tea-500g',15,'Strong CTC Assam tea','Bold, malty CTC tea leaves from the Assam valley.',245.00,290.00,'INR',130,15,'http://localhost:5000/product-images/product-1783424267717-914064266.jpg','active',1,500,1,1,'2026-07-09 07:21:11','2026-07-09 07:21:11',NULL),(19,'SKU-BV-002','Filter Coffee Powder 250g','filter-coffee-powder-250g',15,'80:20 coffee chicory blend','Freshly roasted and ground coffee with chicory, made for filter brewing.',285.00,330.00,'INR',75,10,'http://localhost:5000/product-images/product-1783424267748-282817948.jpg','active',0,250,1,1,'2026-07-09 07:21:11','2026-07-09 07:21:11',NULL),(20,'SKU-IR-001','Instant Noodles Masala (Pack of 6)','instant-noodles-masala-pack-of-6',16,'Ready in two minutes','Six single-serve masala noodle packs with tastemaker.',144.00,168.00,'INR',260,25,'http://localhost:5000/product-images/product-1783424267749-683793789.jpg','active',0,420,1,1,'2026-07-09 07:21:11','2026-07-09 07:21:11',NULL),(21,'SKU-IR-002','Tomato Soup Mix 60g','tomato-soup-mix-60g',16,'Instant tomato soup','Just add hot water. Serves four.',55.00,65.00,'INR',180,20,'http://localhost:5000/product-images/product-1783421496918-862039300.jpg','active',0,60,1,1,'2026-07-09 07:21:11','2026-07-09 07:21:11',NULL),(22,'SKU-CB-001','Chocolate Cream Biscuits 300g','chocolate-cream-biscuits-300g',17,'Cocoa biscuits with cream','Crisp cocoa biscuits sandwiching a rich chocolate cream.',75.00,90.00,'INR',320,30,'http://localhost:5000/product-images/product-1783424164969-586033804.jpg','active',1,300,1,1,'2026-07-09 07:21:11','2026-07-09 07:21:11',NULL),(23,'SKU-CK-001','Butter Cookies 250g','butter-cookies-250g',18,'Danish style butter cookies','Buttery, crumbly cookies baked in small batches.',165.00,195.00,'INR',140,15,'http://localhost:5000/product-images/product-1783424164974-874278751.jpg','active',0,250,1,1,'2026-07-09 07:21:11','2026-07-09 07:21:11',NULL),(24,'SKU-MD-001','Marie Light Biscuits 250g','marie-light-biscuits-250g',19,'Classic light tea biscuit','Thin, crisp Marie biscuits. The everyday tea companion.',42.00,50.00,'INR',500,50,'http://localhost:5000/product-images/product-1783424164976-278327114.jpg','active',0,250,1,1,'2026-07-09 07:21:11','2026-07-09 07:21:11',NULL),(25,'SKU-GB-001','Glucose Biscuits 400g','glucose-biscuits-400g',20,'Energy-rich glucose biscuits','Wholesome glucose biscuits with added vitamins.',48.00,55.00,'INR',600,50,'http://localhost:5000/product-images/product-1783424226659-290345052.jpg','active',0,400,1,1,'2026-07-09 07:21:11','2026-07-09 07:21:11',NULL),(26,'SKU-CR-001','Salted Crackers 200g','salted-crackers-200g',21,'Crisp salted crackers','Light, flaky crackers with a hint of sea salt.',68.00,80.00,'INR',210,20,'http://localhost:5000/product-images/product-1783424226660-48623682.jpg','active',0,200,1,1,'2026-07-09 07:21:11','2026-07-09 07:21:11',NULL),(27,'SKU-WF-001','Vanilla Wafers 150g','vanilla-wafers-150g',22,'Layered vanilla cream wafers','Five crisp layers with smooth vanilla cream between them.',55.00,65.00,'INR',240,25,'http://localhost:5000/product-images/product-1783424226662-519029708.jpg','active',0,150,1,1,'2026-07-09 07:21:11','2026-07-09 07:21:11',NULL),(28,'SKU-RT-001','Milk Rusk 300g','milk-rusk-300g',23,'Twice baked milk rusk','Crunchy twice-baked rusk. Perfect for dunking.',72.00,85.00,'INR',190,20,'http://localhost:5000/product-images/product-1783424226664-493325348.jpg','active',0,300,1,1,'2026-07-09 07:21:11','2026-07-09 07:21:11',NULL),(29,'SKU-HB-001','Ragi Multigrain Biscuits 250g','ragi-multigrain-biscuits-250g',24,'No added sugar, high fibre','Baked with ragi, oats and five other grains. No added sugar.',115.00,135.00,'INR',110,15,'http://localhost:5000/product-images/product-1783424288610-738409919.jpg','active',1,250,1,1,'2026-07-09 07:21:11','2026-07-09 07:21:11',NULL);
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `refresh_tokens`
--

DROP TABLE IF EXISTS `refresh_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `refresh_tokens` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `token_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Store a HASH of the refresh token, not the token',
  `expires_at` datetime NOT NULL,
  `revoked_at` datetime DEFAULT NULL COMMENT 'Set on logout / rotation',
  `user_agent` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Supports IPv6',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_refresh_token_hash` (`token_hash`),
  KEY `idx_refresh_user` (`user_id`),
  KEY `idx_refresh_expiry` (`expires_at`),
  CONSTRAINT `fk_refresh_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Server-side registry of JWT refresh tokens';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `refresh_tokens`
--

LOCK TABLES `refresh_tokens` WRITE;
/*!40000 ALTER TABLE `refresh_tokens` DISABLE KEYS */;
INSERT INTO `refresh_tokens` VALUES (1,1,'95d486937d7f2449c59fc1d68752cbf536fde17a89c18f135897dc342ca7140b','2026-07-14 15:29:58','2026-07-07 16:20:54','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36','::1','2026-07-07 09:59:58'),(2,1,'e6532868b54c5f33cde5479e99fb50c0cf6b4e49dbc6c7bf2dd7e90832ae7328','2026-07-14 15:54:48',NULL,'curl/8.19.0','::1','2026-07-07 10:24:48'),(3,1,'125c93315e0de1bf902b92f0f3a0346ad7c7f896f4512a639cb4013f7f95b884','2026-07-14 15:54:57',NULL,'curl/8.19.0','::1','2026-07-07 10:24:57'),(4,1,'2ec9efdc1721a06ac32911ae50d317c13c8f2ac1a9235519e8689808bddf6eb7','2026-07-14 16:20:54','2026-07-07 17:04:50','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36','::1','2026-07-07 10:50:54'),(5,1,'4aa4acfdd885c25b908157fad36eac7838162ac5e0e0ca8250357fe0f83fc8c9','2026-07-14 17:04:50','2026-07-07 17:19:52','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36','::1','2026-07-07 11:34:50'),(6,1,'71595f3c85abb70d7b3b151d8d7103cffa31f60343811ba6d71475cb3c8e2c7d','2026-07-14 17:19:52',NULL,'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36','::1','2026-07-07 11:49:52'),(8,1,'f035c23e75b667c8e64dd9c37e453b9794e290c2a0e4d6e1000ed15f9d64a1b7','2026-07-16 10:39:36','2026-07-09 11:31:28','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36','::1','2026-07-09 05:09:36'),(9,1,'2b84ca7bebfebeb9039e95b44220401f5b84274063f9b356d42e67744dbea36f','2026-07-16 11:31:28','2026-07-09 11:58:40','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36','::1','2026-07-09 06:01:28'),(15,1,'bd7d64ef594e4ef803900d2e97125aef7740d630ee5ec89614b60289dfc657bf','2026-07-16 11:58:40','2026-07-09 12:23:53','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36','::1','2026-07-09 06:28:40'),(16,5,'a5534798f54700a7c2864ccd8646a9bfbdf0243c3e881bdc10699c8e89375375','2026-07-16 12:17:56','2026-07-09 12:22:52','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36','::1','2026-07-09 06:47:56'),(17,1,'70285f8694e51e5f6105e77ce29769bf946647814e8eac42403e02e53ea44bf9','2026-07-16 12:23:53','2026-07-09 12:52:41','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36','::1','2026-07-09 06:53:53'),(18,1,'45d8fdbb48ec1e9fccf21338657309f4c3f450d94747fc34363227020e2eb191','2026-07-16 12:26:50','2026-07-09 12:26:59','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36','::1','2026-07-09 06:56:50'),(19,1,'23b8d0ea770ccbe231d9c18c2c1b0cc80ae2c3ebf803cafaf55066f9c02a4b1b','2026-07-16 12:27:25','2026-07-09 12:32:42','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36','::1','2026-07-09 06:57:25'),(20,1,'725d13cc66e4ba65b84e1b6e569b6032e3f782a732a82dd4d5dc547a4b3c8fc9','2026-07-16 12:32:47','2026-07-09 12:34:35','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36','::1','2026-07-09 07:02:47'),(21,1,'d8345edf03cb560bb5c27c1dbf5b384f7c2ce57dfd0685708edae6db75c9662f','2026-07-16 12:34:49','2026-07-09 12:35:55','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36','::1','2026-07-09 07:04:49'),(22,1,'56d378f5131222bb81c22e53b0b6cb0734fe8720e14875b33e1cfbc42b554a06','2026-07-16 12:52:41',NULL,'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36','::1','2026-07-09 07:22:41'),(23,2,'6b0f361fc6e2574f5bb2385adc43c51758a793af177bb1054c0efad48ba6d7f3','2026-07-16 13:11:13',NULL,'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36','::1','2026-07-09 07:41:13');
/*!40000 ALTER TABLE `refresh_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('super_admin','admin','staff','user') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'user',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `last_login_at` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_users_email` (`email`),
  KEY `idx_users_role_active` (`role`,`is_active`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Super Admin','admin@example.com','$2b$10$3ozPzfobQ.5PJICG20cmoOhiOr/N.goz9bZ9iNx9vvJ1KM33uoSIC','super_admin',1,NULL,'2026-07-09 07:40:06','2026-07-09 07:40:06'),(2,'user','user@yopmail.com','$2a$10$gwjOIU3Iwqh.toaz04qn7umK77LkhhfXm.hWSfRhOrQCLyJbEYSOu','user',1,NULL,'2026-07-09 07:41:12','2026-07-09 07:41:12');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `vw_product_listing`
--

DROP TABLE IF EXISTS `vw_product_listing`;
/*!50001 DROP VIEW IF EXISTS `vw_product_listing`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_product_listing` AS SELECT 
 1 AS `id`,
 1 AS `sku`,
 1 AS `name`,
 1 AS `slug`,
 1 AS `price`,
 1 AS `compare_at_price`,
 1 AS `currency`,
 1 AS `stock_quantity`,
 1 AS `is_in_stock`,
 1 AS `image_url`,
 1 AS `status`,
 1 AS `is_featured`,
 1 AS `category_id`,
 1 AS `category_name`,
 1 AS `category_slug`,
 1 AS `created_at`*/;
SET character_set_client = @saved_cs_client;

--
-- Final view structure for view `vw_product_listing`
--

/*!50001 DROP VIEW IF EXISTS `vw_product_listing`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_product_listing` AS select `p`.`id` AS `id`,`p`.`sku` AS `sku`,`p`.`name` AS `name`,`p`.`slug` AS `slug`,`p`.`price` AS `price`,`p`.`compare_at_price` AS `compare_at_price`,`p`.`currency` AS `currency`,`p`.`stock_quantity` AS `stock_quantity`,`p`.`is_in_stock` AS `is_in_stock`,`p`.`image_url` AS `image_url`,`p`.`status` AS `status`,`p`.`is_featured` AS `is_featured`,`p`.`category_id` AS `category_id`,`c`.`name` AS `category_name`,`c`.`slug` AS `category_slug`,`p`.`created_at` AS `created_at` from (`products` `p` join `categories` `c` on((`c`.`id` = `p`.`category_id`))) where (`p`.`deleted_at` is null) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-09 13:14:26
