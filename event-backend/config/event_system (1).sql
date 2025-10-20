-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 18, 2025 at 02:32 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `event_system`
--

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `date` date NOT NULL,
  `time` time DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `capacity` int(11) DEFAULT NULL,
  `image_path` varchar(255) DEFAULT NULL,
  `organizer_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`id`, `title`, `description`, `date`, `time`, `location`, `capacity`, `image_path`, `organizer_id`) VALUES
(1, 'Tech Conference', 'A conference on technology', '2023-12-01', '10:00:00', 'Convention Center', 50, 'uploads/event-1-1760786639.jpg', 2),
(2, 'Music Festival', 'Live music event', '2023-12-15', '18:00:00', 'Stadium', 500, 'uploads/event-2-1760786982.jpg', 2),
(4, 'Wedding', 'Forever starts now. 💍', '2025-10-29', '16:11:00', 'San Agustin Church (Manila)', 40, 'uploads/event-4-1760787075.jpg', 5),
(5, 'Seminars', ' Educational events focused on a specific topic.', '2025-10-30', '08:00:00', 'Annex , Pinamalayan, Oriental Mindoro', 100, 'uploads/event-5-1760789776.jpg', 5);

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `type` varchar(50) NOT NULL,
  `title` varchar(150) NOT NULL,
  `message` text DEFAULT NULL,
  `data_json` text DEFAULT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `user_id`, `type`, `title`, `message`, `data_json`, `is_read`, `created_at`) VALUES
(1, 7, 'reservation_status', 'Reservation Approved', 'Your reservation is approved. Present this code on entry: FP3UFD', '{\"reservation_id\":7,\"code\":\"FP3UFD\"}', 0, '2025-10-18 11:46:59'),
(2, 7, 'reservation_status', 'Reservation Approved', 'Your reservation is approved. Present this code on entry: 8U2TW2', '{\"reservation_id\":7,\"code\":\"8U2TW2\"}', 0, '2025-10-18 11:47:03'),
(3, 7, 'reservation_status', 'Reservation Cancelled', 'Your reservation has been cancelled by the organizer.', '{\"reservation_id\":7}', 0, '2025-10-18 11:47:05'),
(4, 7, 'reservation_status', 'Reservation Approved', 'Your reservation is approved. Present this code on entry: GS9YH8', '{\"reservation_id\":7,\"code\":\"GS9YH8\"}', 0, '2025-10-18 11:47:17'),
(5, 7, 'reservation_status', 'Reservation Approved', 'Your reservation is approved. Present this code on entry: B2Z42K', '{\"reservation_id\":7,\"code\":\"B2Z42K\"}', 0, '2025-10-18 11:49:58'),
(6, 7, 'reservation_status', 'Reservation Approved', 'Your reservation is approved. Present this code on entry: GXR3M6', '{\"reservation_id\":8,\"code\":\"GXR3M6\"}', 0, '2025-10-18 11:50:28'),
(7, 7, 'reservation_status', 'Reservation Approved', 'Your reservation is approved. Present this code on entry: VE8UH8', '{\"reservation_id\":8,\"code\":\"VE8UH8\"}', 0, '2025-10-18 11:52:59'),
(8, 7, 'reservation_status', 'Reservation Approved', 'Your reservation is approved. Present this code on entry: RY386F', '{\"reservation_id\":8,\"code\":\"RY386F\"}', 0, '2025-10-18 11:53:01'),
(9, 7, 'reservation_status', 'Reservation Approved', 'Your reservation is approved. Present this code on entry: KVXD9K', '{\"reservation_id\":8,\"code\":\"KVXD9K\"}', 0, '2025-10-18 12:03:20'),
(10, 7, 'reservation_status', 'Reservation Cancelled', 'Your reservation has been cancelled by the organizer.', '{\"reservation_id\":8}', 0, '2025-10-18 12:03:24'),
(11, 7, 'reservation_status', 'Reservation Approved', 'Your reservation is approved. Present this code on entry: HGFNJX', '{\"reservation_id\":7,\"code\":\"HGFNJX\"}', 0, '2025-10-18 12:03:32'),
(12, 7, 'reservation_status', 'Reservation Approved', 'Your reservation is approved. Present this code on entry: Y4A233', '{\"reservation_id\":7,\"code\":\"Y4A233\"}', 0, '2025-10-18 12:08:10'),
(13, 7, 'reservation_status', 'Reservation Approved', 'Your reservation is approved. Present this code on entry: M2AVWN', '{\"reservation_id\":7,\"code\":\"M2AVWN\"}', 0, '2025-10-18 12:08:12'),
(14, 7, 'reservation_status', 'Reservation Approved', 'Your reservation is approved. Present this code on entry: 4G676E', '{\"reservation_id\":7,\"code\":\"4G676E\"}', 0, '2025-10-18 12:08:16'),
(15, 7, 'reservation_status', 'Reservation Approved', 'Your reservation is approved. Present this code on entry: N3NDQB', '{\"reservation_id\":5,\"code\":\"N3NDQB\"}', 0, '2025-10-18 12:08:18'),
(16, 7, 'reservation_status', 'Reservation Approved', 'Your reservation is approved. Present this code on entry: SXM6HV', '{\"reservation_id\":7,\"code\":\"SXM6HV\"}', 0, '2025-10-18 12:11:09'),
(17, 7, 'reservation_status', 'Reservation Updated', 'Your reservation status has been updated.', '{\"reservation_id\":7}', 1, '2025-10-18 12:11:13'),
(18, 7, 'reservation_status', 'Reservation Cancelled', 'Your reservation has been cancelled by the organizer.', '{\"reservation_id\":7}', 0, '2025-10-18 12:11:15'),
(19, 7, 'reservation_status', 'Reservation Approved', 'Your reservation is approved. Present this code on entry: 887ZYV', '{\"reservation_id\":7,\"code\":\"887ZYV\"}', 0, '2025-10-18 12:11:19'),
(20, 3, 'reservation_status', 'Reservation Approved', 'Your reservation is approved. Present this code on entry: T7DQYH', '{\"reservation_id\":1,\"code\":\"T7DQYH\"}', 0, '2025-10-18 12:17:53'),
(21, 3, 'reservation_status', 'Reservation Approved', 'Your reservation is approved. Present this code on entry: 3TMYSZ', '{\"reservation_id\":2,\"code\":\"3TMYSZ\"}', 0, '2025-10-18 12:17:56'),
(22, 6, 'reservation_status', 'Reservation Approved', 'Your reservation is approved. Present this code on entry: K9BKEQ', '{\"reservation_id\":4,\"code\":\"K9BKEQ\"}', 0, '2025-10-18 12:20:57'),
(23, 3, 'reservation_status', 'Reservation Approved', 'Your reservation is approved. Present this code on entry: SWES9Q', '{\"reservation_id\":1,\"code\":\"SWES9Q\"}', 0, '2025-10-18 12:20:59'),
(24, 6, 'reservation_status', 'Reservation Approved', 'Your reservation is approved. Present this code on entry: 4UXAD9', '{\"reservation_id\":4,\"code\":\"4UXAD9\"}', 0, '2025-10-18 12:22:50'),
(25, 3, 'reservation_status', 'Reservation Approved', 'Your reservation is approved. Present this code on entry: CWX87A', '{\"reservation_id\":1,\"code\":\"CWX87A\"}', 0, '2025-10-18 12:22:51'),
(26, 7, 'reservation_status', 'Reservation Approved', 'Your reservation is approved. Present this code on entry: V5ES9H', '{\"reservation_id\":8,\"code\":\"V5ES9H\"}', 0, '2025-10-18 12:22:57'),
(27, 7, 'reservation_status', 'Reservation Approved', 'Your reservation is approved. Present this code on entry: E5C3MX', '{\"reservation_id\":7,\"code\":\"E5C3MX\"}', 0, '2025-10-18 12:23:00'),
(28, 7, 'reservation_status', 'Reservation Cancelled', 'Your reservation has been cancelled by the organizer.', '{\"reservation_id\":8}', 0, '2025-10-18 12:23:03'),
(29, 8, 'reservation_status', 'Reservation Approved', 'Your reservation is approved. Present this code on entry: NQ6WQ2', '{\"reservation_id\":9,\"code\":\"NQ6WQ2\"}', 0, '2025-10-18 12:28:04');

-- --------------------------------------------------------

--
-- Table structure for table `reservations`
--

CREATE TABLE `reservations` (
  `id` int(11) NOT NULL,
  `event_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `status` enum('pending','confirmed','cancelled') DEFAULT 'pending',
  `approval_code` varchar(32) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reservations`
--

INSERT INTO `reservations` (`id`, `event_id`, `user_id`, `status`, `approval_code`, `created_at`) VALUES
(1, 1, 3, '', 'CWX87A', '2025-10-18 03:42:08'),
(2, 2, 3, '', '3TMYSZ', '2025-10-18 03:42:08'),
(4, 2, 6, '', '4UXAD9', '2025-10-18 07:53:00'),
(5, 2, 7, '', 'N3NDQB', '2025-10-18 08:16:42'),
(7, 4, 7, '', 'E5C3MX', '2025-10-18 11:41:37'),
(8, 4, 7, 'cancelled', 'V5ES9H', '2025-10-18 11:50:13'),
(9, 5, 8, '', 'NQ6WQ2', '2025-10-18 12:27:47');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','organizer','attendee') DEFAULT 'attendee'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`) VALUES
(1, 'Admin User', 'admin@example.com', '$2y$10$examplehashedpassword', 'admin'),
(2, 'Organizer User', 'organizer@example.com', '$2y$10$examplehashedpassword', 'organizer'),
(3, 'Attendee User', 'attendee@example.com', '$2y$10$examplehashedpassword', 'attendee'),
(4, 'try', 'try@gmail.com', '$2y$10$aQKACdt1NJVws3koOpMIqOzBXOdk3cImHOKyWTCeO5GyUxOdPuFe2', 'attendee'),
(5, 'admin', 'admin@gmail.com', '$2y$10$GCKO0eYV9oK9Y0kO4AIsa.ZrY43WheZkkTt61k5Y/Y2y39iqawyr6', 'organizer'),
(6, 'dan', 'yelsales01@gmail.com', '$2y$10$FKkMQfVm8/WUkcB1qsSNjeNU.OdNkmhLpBa4Q7SoG44JTmnsQeCXG', 'attendee'),
(7, 'dan', 'dan@gmail.com', '$2y$10$WzxhGNSQxXFGSdSRWxck7OpaSPgnplQUey7ODF5mHbQAAgATmj65.', 'attendee'),
(8, 'Clyde', 'clyde@gmsil.com', '$2y$10$bGZlTyIvOFuqUcYdNqRrU.gx.le1ZqKty.YuvTZb2vYNRzVUwvqIO', 'attendee');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`),
  ADD KEY `organizer_id` (`organizer_id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `is_read` (`is_read`);

--
-- Indexes for table `reservations`
--
ALTER TABLE `reservations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `event_id` (`event_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `reservations`
--
ALTER TABLE `reservations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `events`
--
ALTER TABLE `events`
  ADD CONSTRAINT `events_ibfk_1` FOREIGN KEY (`organizer_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `reservations`
--
ALTER TABLE `reservations`
  ADD CONSTRAINT `reservations_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`),
  ADD CONSTRAINT `reservations_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
