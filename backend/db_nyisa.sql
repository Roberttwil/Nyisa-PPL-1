-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Apr 10, 2025 at 08:20 AM
-- Server version: 8.0.41
-- PHP Version: 8.2.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_nyisa`
--

-- --------------------------------------------------------

--
-- Table structure for table `cart`
--

CREATE TABLE `cart` (
  `cart_id` int NOT NULL,
  `booking_code` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `user_id` int NOT NULL,
  `restaurant_id` int NOT NULL,
  `food_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cart`
--

INSERT INTO `cart` (`cart_id`, `booking_code`, `user_id`, `restaurant_id`, `food_id`) VALUES
(1, 'DhDaAgBSwb', 4, 4, 1),
(2, 'DzPcuUyhGn', 1, 5, 8),
(3, 'MFafbPCIIZ', 1, 5, 8),
(4, 'Bp07FV1OXa', 1, 1, 15),
(5, 'wb166NxfPJ', 5, 4, 14),
(6, '15Mz2dCIdG', 2, 4, 1),
(7, 'SajlN5nCxm', 4, 1, 5),
(8, 'NHy9svrwaR', 2, 1, 7),
(9, 'nWpiqDt606', 3, 1, 7),
(10, 'GhPKjMi6SW', 5, 5, 8),
(13, 'AAAAAAA', 1, 4, 1);

-- --------------------------------------------------------

--
-- Table structure for table `food`
--

CREATE TABLE `food` (
  `food_id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `type` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `price` int NOT NULL,
  `photo` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `quantity` int NOT NULL,
  `restaurant_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `food`
--

INSERT INTO `food` (`food_id`, `name`, `type`, `price`, `photo`, `quantity`, `restaurant_id`) VALUES
(1, 'Oriental Ceramic Pizza', 'Main Course', 53478, 'https://picsum.photos/seed/Zgyw6naP6/573/2481', 16, 4),
(2, 'Bespoke Plastic Pizza', 'Main Course', 89454, 'https://picsum.photos/seed/im5CZxC8/643/2593', 16, 3),
(3, 'Handmade Granite Bike', 'Main Course', 99543, 'https://picsum.photos/seed/Ck4WNtIVj2/3822/843', 7, 3),
(4, 'Sleek Ceramic Pants', 'Snack', 26256, 'https://loremflickr.com/932/731?lock=2306681204342106', 3, 5),
(5, 'Licensed Bronze Ball', 'Snack', 69332, 'https://loremflickr.com/3460/2645?lock=6081097202074361', 21, 1),
(6, 'Licensed Concrete Shoes', 'Main Course', 43091, 'https://picsum.photos/seed/Y1cOvpoBuh/258/3956', 45, 3),
(7, 'Gorgeous Marble Ball', 'Snack', 77555, 'https://loremflickr.com/3973/2972?lock=8321368911983550', 36, 1),
(8, 'Sleek Concrete Tuna', 'Main Course', 93360, 'https://picsum.photos/seed/uDYx3/811/3762', 13, 5),
(9, 'Unbranded Concrete Ball', 'Drink', 85382, 'https://picsum.photos/seed/A1QsGKdE/2440/3977', 29, 3),
(10, 'Electronic Cotton Table', 'Drink', 56943, 'https://loremflickr.com/21/1633?lock=3340469842796603', 37, 1),
(11, 'Oriental Steel Ball', 'Drink', 22818, 'https://loremflickr.com/3084/370?lock=4713116069184932', 11, 2),
(12, 'Recycled Bronze Bacon', 'Snack', 87516, 'https://picsum.photos/seed/pxbRyI6/1996/2483', 44, 1),
(13, 'Oriental Gold Hat', 'Main Course', 81997, 'https://picsum.photos/seed/AARtX/402/1032', 47, 5),
(14, 'Elegant Bronze Pants', 'Snack', 46498, 'https://picsum.photos/seed/plEmmaWFe/2559/795', 43, 4),
(15, 'Awesome Bamboo Sausages', 'Drink', 35100, 'https://picsum.photos/seed/jbipF6/669/515', 21, 1);

-- --------------------------------------------------------

--
-- Table structure for table `restaurant`
--

CREATE TABLE `restaurant` (
  `restaurant_id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `address` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `phone` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `restaurant_type` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `photo` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `rating` float NOT NULL,
  `longitude` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `latitude` varchar(255) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `restaurant`
--

INSERT INTO `restaurant` (`restaurant_id`, `name`, `address`, `phone`, `email`, `restaurant_type`, `photo`, `rating`, `longitude`, `latitude`) VALUES
(1, 'Weimann - Lubowitz', '3602 Eliezer Mission', '936-333-3110 x7441', 'Stevie.Williamson42@yahoo.com', 'Warung', 'https://loremflickr.com/3403/1694?lock=444486960928092', 4.94583, '4.9607', '-4.361'),
(2, 'Shanahan, Bartoletti and Kuvalis', '7751 Cummings View', '403.606.0868', 'Hanna.Abshire92@gmail.com', 'Warung', 'https://loremflickr.com/2505/1317?lock=5181137673552609', 3.55609, '170.0146', '17.6271'),
(3, 'Rosenbaum and Sons', '3362 Kole Ports', '(917) 271-4728 x628', 'Melvin.Hand92@hotmail.com', 'Resto', 'https://loremflickr.com/1569/2206?lock=1866216806232384', 3.5453, '-145.7219', '72.3065'),
(4, 'Dibbert - Lang', '7640 West Tunnel', '(580) 862-5080', 'Maida29@hotmail.com', 'Warung', 'https://loremflickr.com/754/257?lock=8629652725795092', 4.81976, '37.0023', '46.4648'),
(5, 'Lindgren - Cormier', '2349 Woodside', '1-973-490-9633 x62606', 'Marjorie_Fisher@yahoo.com', 'Warung', 'https://loremflickr.com/1884/2473?lock=8758299766362323', 4.35607, '-89.1357', '53.7273');

-- --------------------------------------------------------

--
-- Table structure for table `transaction`
--

CREATE TABLE `transaction` (
  `transaction_id` int NOT NULL,
  `booking_code` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `user_id` int NOT NULL,
  `restaurant_id` int NOT NULL,
  `food_id` int NOT NULL,
  `total` float NOT NULL,
  `status` int NOT NULL,
  `date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `transaction`
--

INSERT INTO `transaction` (`transaction_id`, `booking_code`, `user_id`, `restaurant_id`, `food_id`, `total`, `status`, `date`) VALUES
(1, 'U9OaAEIg2z', 3, 1, 5, 207997, 0, '2025-04-06 10:52:06'),
(2, 'oOD6oY5zxs', 2, 1, 5, 69332.4, 1, '2025-04-06 20:26:17'),
(3, 'o8fN01r0am', 1, 4, 14, 139495, 1, '2025-04-06 13:26:39'),
(4, 'XFQRclNMYK', 5, 4, 1, 160434, 0, '2025-04-06 13:44:29'),
(5, 'YEXLMFC9Yv', 4, 1, 7, 155109, 0, '2025-04-06 00:10:03'),
(6, 'FpR2d5Nz7s', 2, 5, 8, 93359.5, 0, '2025-04-06 05:19:27'),
(7, 'vNbWOBQYt9', 3, 3, 9, 170763, 1, '2025-04-06 04:42:24'),
(8, 'LqYU3KZkPV', 1, 3, 9, 256145, 1, '2025-04-06 10:49:20'),
(9, 'zxbDYNbQlZ', 1, 4, 14, 139495, 1, '2025-04-06 15:49:47'),
(10, 'LOt8cnrbnu', 4, 1, 15, 105299, 0, '2025-04-06 02:09:31'),
(11, 'ABCDEF', 1, 4, 1, 99976, 0, '2025-04-07 00:26:49'),
(12, 'ABCDEF', 1, 4, 14, 99976, 0, '2025-04-07 00:26:49');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `user_id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `phone` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `address` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `status` int NOT NULL,
  `username` varchar(255) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`user_id`, `name`, `phone`, `email`, `address`, `status`, `username`) VALUES
(1, 'Marco Bednar-Goyette', '333-368-5688', 'Marietta.Muller@hotmail.com', '628 O\'Conner Hollow', 0, 'Eldon75'),
(2, 'Stewart Donnelly', '595-472-4016 x7582', 'Alize_Kulas98@yahoo.com', '69849 Ike Streets', 0, 'Orrin25'),
(3, 'Lauren Mosciski', '(933) 235-1277 x31937', 'Sibyl_Spinka@gmail.com', '4838 Kilback Cove', 0, 'Rubie.Mills47'),
(4, 'Judy Schiller', '831.814.6454', 'Jessika.Runolfsdottir43@yahoo.com', '681 Flossie Drives', 1, 'Trenton65'),
(5, 'Leah Swift', '585-436-6563 x63324', 'Madalyn40@yahoo.com', '307 Schmeler Pines', 0, 'Ettie_Leuschke47');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `username` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `otp` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `otp_expires_at` datetime DEFAULT NULL,
  `is_verified` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`username`, `password`, `otp`, `otp_expires_at`, `is_verified`) VALUES
('Eldon75', '$2b$10$puave1Ii2im3IwOmfEMEWuzzGmXuZNTPErQk8Tjfrcg4uYA41x2sy', NULL, NULL, 0),
('Ettie_Leuschke47', '$2b$10$Z8uq87gfthd4SLsTUJg8Qe/4LLqXbovh/fXjhA/.DFkJ0e1ucpqbi', NULL, NULL, 0),
('Orrin25', '$2b$10$.PL5r.eh6z1VC1mauScr/OA9/WwxYwHh2Oe6u13ZfYG7IBn7BxgHm', NULL, NULL, 0),
('Rubie.Mills47', '$2b$10$ppQ9p53wMwSqv1whSK/oLOgyaOW31dsai3xt96D0W7bwKz31s81rK', NULL, NULL, 0),
('Trenton65', '$2b$10$pHAcY21WpQadrI6MZwDP1eCqfj..YOboUbuJSRpSkiwwbaEXqB.fO', NULL, NULL, 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`cart_id`);

--
-- Indexes for table `food`
--
ALTER TABLE `food`
  ADD PRIMARY KEY (`food_id`);

--
-- Indexes for table `restaurant`
--
ALTER TABLE `restaurant`
  ADD PRIMARY KEY (`restaurant_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `transaction`
--
ALTER TABLE `transaction`
  ADD PRIMARY KEY (`transaction_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cart`
--
ALTER TABLE `cart`
  MODIFY `cart_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `food`
--
ALTER TABLE `food`
  MODIFY `food_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `restaurant`
--
ALTER TABLE `restaurant`
  MODIFY `restaurant_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `transaction`
--
ALTER TABLE `transaction`
  MODIFY `transaction_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `user_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
