-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 19, 2024 at 03:27 PM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 8.2.0

SET FOREIGN_KEY_CHECKS=0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `student_attendance`
--
CREATE DATABASE IF NOT EXISTS `student_attendance` DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci;
USE `student_attendance`;

-- --------------------------------------------------------

--
-- Table structure for table `instructor`
--

DROP TABLE IF EXISTS `instructor`;
CREATE TABLE IF NOT EXISTS `instructor` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `nrc` varchar(45) NOT NULL,
  `gender` enum('MALE','FEMALE') NOT NULL,
  `date_of_birth` date NOT NULL,
  `phone` varchar(45) NOT NULL,
  `address` varchar(500) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `nrc_UNIQUE` (`nrc`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `student`
--

DROP TABLE IF EXISTS `student`;
CREATE TABLE IF NOT EXISTS `student` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `nrc` varchar(45) NOT NULL,
  `role_no` varchar(45) NOT NULL,
  `phone` varchar(45) NOT NULL,
  `family_phone` varchar(45) NOT NULL,
  `gender` enum('MALE','FEMALE') NOT NULL,
  `date_of_birth` date NOT NULL,
  `address` varchar(500) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nrc_UNIQUE` (`nrc`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `subject`
--

DROP TABLE IF EXISTS `subject`;
CREATE TABLE IF NOT EXISTS `subject` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(45) NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `code_UNIQUE` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `term`
--

DROP TABLE IF EXISTS `term`;
CREATE TABLE IF NOT EXISTS `term` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `name_UNIQUE` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `term_has_student`
--

DROP TABLE IF EXISTS `term_has_student`;
CREATE TABLE IF NOT EXISTS `term_has_student` (
  `term_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  PRIMARY KEY (`term_id`,`student_id`),
  KEY `fk_term_has_student_student1_idx` (`student_id`),
  KEY `fk_term_has_student_term1_idx` (`term_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `term_has_subject`
--

DROP TABLE IF EXISTS `term_has_subject`;
CREATE TABLE IF NOT EXISTS `term_has_subject` (
  `term_id` int(11) NOT NULL,
  `subject_id` int(11) NOT NULL,
  PRIMARY KEY (`term_id`,`subject_id`),
  KEY `fk_term_has_subject_subject1_idx` (`subject_id`),
  KEY `fk_term_has_subject_term_idx` (`term_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` varchar(100) NOT NULL,
  `role` enum('ADMIN','INSTRUCTOR','STUDENT') NOT NULL,
  `status` enum('ACTIVE','INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `email`, `password`, `role`, `status`, `created_at`) VALUES
(1, 'admin@gmail.com', '21232f297a57a5a743894a0e4a801fc3', 'ADMIN', 'ACTIVE', '2024-08-19 13:23:43');

--
-- Constraints for dumped tables
--

--
-- Constraints for table `term_has_student`
--
ALTER TABLE `term_has_student`
  ADD CONSTRAINT `fk_term_has_student_student1` FOREIGN KEY (`student_id`) REFERENCES `student` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_term_has_student_term1` FOREIGN KEY (`term_id`) REFERENCES `term` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints for table `term_has_subject`
--
ALTER TABLE `term_has_subject`
  ADD CONSTRAINT `fk_term_has_subject_subject1` FOREIGN KEY (`subject_id`) REFERENCES `subject` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_term_has_subject_term` FOREIGN KEY (`term_id`) REFERENCES `term` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
SET FOREIGN_KEY_CHECKS=1;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;


INSERT INTO user (id, email, password, role, status) VALUES
(2, 'mathinyanantsoe1@gmail.com', 'e2e4d4b4aa8721c7f49a44e1f0a93fdc', 'STUDENT', 'ACTIVE'),
(3, 'ayeyuaung2@gmail.com', 'e2e4d4b4aa8721c7f49a44e1f0a93fdc', 'STUDENT', 'ACTIVE'),
(4, 'mgzawhtetaung3@gmail.com', 'e2e4d4b4aa8721c7f49a44e1f0a93fdc', 'STUDENT', 'ACTIVE'),
(5, 'sumonthwe4@gmail.com', 'e2e4d4b4aa8721c7f49a44e1f0a93fdc', 'STUDENT', 'ACTIVE'),
(6, 'masumyatnoe5@gmail.com', 'e2e4d4b4aa8721c7f49a44e1f0a93fdc', 'STUDENT', 'ACTIVE'),
(7, 'khinpyaephyothaw6@gmail.com', 'e2e4d4b4aa8721c7f49a44e1f0a93fdc', 'STUDENT', 'ACTIVE'),
(8, 'mashwepwinteain7@gmail.com', 'e2e4d4b4aa8721c7f49a44e1f0a93fdc', 'STUDENT', 'ACTIVE'),
(9, 'mathirilwin8@gmail.com', 'e2e4d4b4aa8721c7f49a44e1f0a93fdc', 'STUDENT', 'ACTIVE'),
(10, 'aungsi9@gmail.com', 'e2e4d4b4aa8721c7f49a44e1f0a93fdc', 'STUDENT', 'ACTIVE'),
(11, 'maphooeishwesin10@gmail.com', 'e2e4d4b4aa8721c7f49a44e1f0a93fdc', 'STUDENT', 'ACTIVE'),
(12, 'khinemyatthwe11@gmail.com', 'e2e4d4b4aa8721c7f49a44e1f0a93fdc', 'STUDENT', 'ACTIVE'),
(13, 'mahninmonkyaw12@gmail.com', 'e2e4d4b4aa8721c7f49a44e1f0a93fdc', 'STUDENT', 'ACTIVE'),
(14, 'maymyatmon13@gmail.com', 'e2e4d4b4aa8721c7f49a44e1f0a93fdc', 'STUDENT', 'ACTIVE'),
(15, 'mathwelhmueeain14@gmail.com', 'e2e4d4b4aa8721c7f49a44e1f0a93fdc', 'STUDENT', 'ACTIVE'),
(16, 'maleileiphyoe15@gmail.com', 'e2e4d4b4aa8721c7f49a44e1f0a93fdc', 'STUDENT', 'ACTIVE'),
(17, 'thandarhtetaung16@gmail.com', 'e2e4d4b4aa8721c7f49a44e1f0a93fdc', 'STUDENT', 'ACTIVE'),
(18, 'nanshwe17@gmail.com', 'e2e4d4b4aa8721c7f49a44e1f0a93fdc', 'STUDENT', 'ACTIVE'),
(19, 'mgswanaungnaing18@gmail.com', 'e2e4d4b4aa8721c7f49a44e1f0a93fdc', 'STUDENT', 'ACTIVE'),
(20, 'mathawtaraung19@gmail.com', 'e2e4d4b4aa8721c7f49a44e1f0a93fdc', 'STUDENT', 'ACTIVE'),
(21, 'naylinaung20@gmail.com', 'e2e4d4b4aa8721c7f49a44e1f0a93fdc', 'STUDENT', 'ACTIVE'),
(22, 'khanthtetpaing22@gmail.com', 'e2e4d4b4aa8721c7f49a44e1f0a93fdc', 'STUDENT', 'ACTIVE'),
(23, 'hsuleihin24@gmail.com', 'e2e4d4b4aa8721c7f49a44e1f0a93fdc', 'STUDENT', 'ACTIVE'),
(24, 'mgshinkhantkyaw25@gmail.com', 'e2e4d4b4aa8721c7f49a44e1f0a93fdc', 'STUDENT', 'ACTIVE'),
(25, 'maymyatnoe26@gmail.com', 'e2e4d4b4aa8721c7f49a44e1f0a93fdc', 'STUDENT', 'ACTIVE'),
(26, 'shinthanto27@gmail.com', 'e2e4d4b4aa8721c7f49a44e1f0a93fdc', 'STUDENT', 'ACTIVE'),
(27, 'mawuthmoneaye28@gmail.com', 'e2e4d4b4aa8721c7f49a44e1f0a93fdc', 'STUDENT', 'ACTIVE'),
(28, 'thetngonephuu29@gmail.com', 'e2e4d4b4aa8721c7f49a44e1f0a93fdc', 'STUDENT', 'ACTIVE'),
(29, 'davidvanroceu30@gmail.com', 'e2e4d4b4aa8721c7f49a44e1f0a93fdc', 'STUDENT', 'ACTIVE'),
(30, 'swelaenandar31@gmail.com', 'e2e4d4b4aa8721c7f49a44e1f0a93fdc', 'STUDENT', 'ACTIVE'),
(31, 'htetlinnhtoo32@gmail.com', 'e2e4d4b4aa8721c7f49a44e1f0a93fdc', 'STUDENT', 'ACTIVE'),
(32, 'mgsoemyattun33@gmail.com', 'e2e4d4b4aa8721c7f49a44e1f0a93fdc', 'STUDENT', 'ACTIVE'),
(33, 'kaungkhantkyaw34@gmail.com', 'e2e4d4b4aa8721c7f49a44e1f0a93fdc', 'STUDENT', 'ACTIVE'),
(34, 'ingyinaaye35@gmail.com', 'e2e4d4b4aa8721c7f49a44e1f0a93fdc', 'STUDENT', 'ACTIVE'),
(35, 'sailinnhtut36@gmail.com', 'e2e4d4b4aa8721c7f49a44e1f0a93fdc', 'STUDENT', 'ACTIVE'),
(36, 'mamadfoyas37@gmail.com', 'e2e4d4b4aa8721c7f49a44e1f0a93fdc', 'STUDENT', 'ACTIVE'),
(37, 'mgnyanlintun38@gmail.com', 'e2e4d4b4aa8721c7f49a44e1f0a93fdc', 'STUDENT', 'ACTIVE'),
(38, 'zawminaung39@gmail.com', 'e2e4d4b4aa8721c7f49a44e1f0a93fdc', 'STUDENT', 'ACTIVE'),
(39, 'htooaungwin40@gmail.com', 'e2e4d4b4aa8721c7f49a44e1f0a93fdc', 'STUDENT', 'ACTIVE'),
(40, 'minbamaw41@gmail.com', 'e2e4d4b4aa8721c7f49a44e1f0a93fdc', 'STUDENT', 'ACTIVE'),
(41, 'winpapaaung42@gmail.com', 'e2e4d4b4aa8721c7f49a44e1f0a93fdc', 'STUDENT', 'ACTIVE'),
(42, 'htunwinlatt43@gmail.com', 'e2e4d4b4aa8721c7f49a44e1f0a93fdc', 'STUDENT', 'ACTIVE'),
(43, 'mgaungzayphyo44@gmail.com', 'e2e4d4b4aa8721c7f49a44e1f0a93fdc', 'STUDENT', 'ACTIVE'),
(44, 'minkhaingthant45@gmail.com', 'e2e4d4b4aa8721c7f49a44e1f0a93fdc', 'STUDENT', 'ACTIVE'),
(45, 'mykyawthuraaung46@gmail.com', 'e2e4d4b4aa8721c7f49a44e1f0a93fdc', 'STUDENT', 'ACTIVE'),
(46, 'mgnaingtayza48@gmail.com', 'e2e4d4b4aa8721c7f49a44e1f0a93fdc', 'STUDENT', 'ACTIVE'),
(47, 'nyominmaungmaung49@gmail.com', 'e2e4d4b4aa8721c7f49a44e1f0a93fdc', 'STUDENT', 'ACTIVE'),
(48, 'mgminmyatthu52@gmail.com', 'e2e4d4b4aa8721c7f49a44e1f0a93fdc', 'STUDENT', 'ACTIVE'),
(49, 'phyonaingsoe53@gmail.com', 'e2e4d4b4aa8721c7f49a44e1f0a93fdc', 'STUDENT', 'ACTIVE'),
(50, 'cherrywin54@gmail.com', 'e2e4d4b4aa8721c7f49a44e1f0a93fdc', 'STUDENT', 'ACTIVE'),
(51, 'maythinikhine55@gmail.com', 'e2e4d4b4aa8721c7f49a44e1f0a93fdc', 'STUDENT', 'ACTIVE'),
(52, 'maphuephuezin56@gmail.com', 'e2e4d4b4aa8721c7f49a44e1f0a93fdc', 'STUDENT', 'ACTIVE'),
(53, 'zinmyotun57@gmail.com', 'e2e4d4b4aa8721c7f49a44e1f0a93fdc', 'STUDENT', 'ACTIVE'),
(54, 'mgphyomyatmin58@gmail.com', 'e2e4d4b4aa8721c7f49a44e1f0a93fdc', 'STUDENT', 'ACTIVE'),
(55, 'mahninayeayewai59@gmail.com', 'e2e4d4b4aa8721c7f49a44e1f0a93fdc', 'STUDENT', 'ACTIVE'),
(56, 'bhonemyatthu60@gmail.com', 'e2e4d4b4aa8721c7f49a44e1f0a93fdc', 'STUDENT', 'ACTIVE'),
(57, 'paingheinkyaw61@gmail.com', 'e2e4d4b4aa8721c7f49a44e1f0a93fdc', 'STUDENT', 'ACTIVE'),
(58, 'mathidaayemin62@gmail.com', 'e2e4d4b4aa8721c7f49a44e1f0a93fdc', 'STUDENT', 'ACTIVE');


INSERT INTO student (id, name, nrc, role_no, phone, family_phone, gender, date_of_birth, address) VALUES
(2, 'Ma Thin Yanant Soe', '12/KAMA(N)348726', 'II IT-1', '09123456789', '09123456789', 'FEMALE', '2003-05-14', '123 Main St, Yangon'),
(3, 'Aye Yu Aung', '12/BAHA(N)124579', 'II IT-2', '09234567890', '09234567890', 'MALE', '2002-11-23', '456 Elm St, Yangon'),
(4, 'Mg Zaw Htet Aung', '12/INSE(N)563214', 'II IT-3', '09345678901', '09345678901', 'MALE', '2003-08-07', '789 Pine St, Yangon'),
(5, 'Su Mon Thwe', '12/HLAI(N)762134', 'II IT-4', '09456789012', '09456789012', 'FEMALE', '2003-02-15', '101 Maple St, Yangon'),
(6, 'Ma Su Myat Noe', '12/DAGO(N)891236', 'II IT-5', '09567890123', '09567890123', 'FEMALE', '2003-07-29', '202 Oak St, Yangon'),
(7, 'Khin Pyae Phyo Thaw', '12/TAMA(N)237849', 'II IT-6', '09678901234', '09678901234', 'MALE', '2002-12-03', '303 Birch St, Yangon'),
(8, 'Ma Shwe Pwint Eain', '12/KAMA(N)654231', 'II IT-7', '09789012345', '09789012345', 'FEMALE', '2003-09-16', '404 Cedar St, Yangon'),
(9, 'Ma Thiri Lwin', '12/BAHA(N)914783', 'II IT-8', '09890123456', '09890123456', 'FEMALE', '2003-06-25', '505 Walnut St, Yangon'),
(10, 'Aung Si Phyo', '12/INSE(N)482167', 'II IT-9', '09901234567', '09901234567', 'MALE', '2002-10-12', '606 Chestnut St, Yangon'),
(11, 'Ma Phoo Ei Shwe Sin', '12/HLAI(N)375829', 'II IT-10', '09112345678', '09112345678', 'FEMALE', '2003-01-18', '707 Fir St, Yangon'),
(12, 'Khine Myat Thwe', '12/DAGO(N)134789', 'II IT-11', '09223456789', '09223456789', 'MALE', '2002-05-09', '808 Spruce St, Yangon'),
(13, 'Ma Hnin Mon Kyaw', '12/TAMA(N)586921', 'II IT-12', '09334567890', '09334567890', 'FEMALE', '2003-03-22', '909 Redwood St, Yangon'),
(14, 'May Myat Mon', '4/CHANYE(N)738416', 'II IT-13', '09445678901', '09445678901', 'FEMALE', '2003-08-05', '1001 Ash St, Yangon'),
(15, 'Ma Thwel Hmue Eain', '4/AUNGMY(N)297583', 'II IT-14', '09556789012', '09556789012', 'FEMALE', '2003-04-14', '1102 Willow St, Yangon'),
(16, 'Ma Lei Lei Phyoe', '4/MAHA(N)647923', 'II IT-15', '09667890123', '09667890123', 'FEMALE', '2003-07-30', '1203 Poplar St, Yangon'),
(17, 'Thandar Htet Aung', '4/PYIGYI(N)349781', 'II IT-16', '09778901234', '09778901234', 'MALE', '2002-11-12', '1304 Elm St, Yangon'),
(18, 'Nan Shwe Sin', '4/CHANYE(N)582396', 'II IT-17', '09889012345', '09889012345', 'FEMALE', '2003-05-26', '1405 Oak St, Yangon'),
(19, 'Mg Swan Aung Naing', '4/AUNGMY(N)438752', 'II IT-18', '09990123456', '09990123456', 'MALE', '2002-09-19', '1506 Birch St, Yangon'),
(20, 'Ma thaw tar aung', '4/MAHA(N)695824', 'II IT-19', '09123456780', '09123456780', 'MALE', '2003-02-22', '1607 Cedar St, Yangon'),
(21, 'Nay Lin Aung', '4/PYIGYI(N)127653', 'II IT-20', '09234567801', '09234567801', 'MALE', '2003-03-08', '1708 Walnut St, Yangon'),
(22, 'Khant Htet Paing', '9/PATHA(N)846529', 'II IT-22', '09345678912', '09345678912', 'MALE', '2002-12-21', '1809 Chestnut St, Yangon'),
(23, 'Hsu Lei Hnin', '9/HINTHA(N)918274', 'II IT-24', '09456789023', '09456789023', 'FEMALE', '2003-06-01', '1910 Fir St, Yangon'),
(24, 'Mg Shin Khant Kyaw', '9/MAUBI(N)378492', 'II IT-25', '09567890134', '09567890134', 'MALE', '2002-10-20', '2021 Spruce St, Yangon'),
(25, 'May Myat Noe', '9/MYAUN(N)264718', 'II IT-26', '09678901245', '09678901245', 'FEMALE', '2003-01-30', '2122 Redwood St, Yangon'),
(26, 'Shin Thant Oo', '9/PATHA(N)539672', 'II IT-27', '09789012356', '09789012356', 'MALE', '2003-07-12', '2223 Ash St, Yangon'),
(27, 'Ma Wut Hmone Aye', '9/HINTHA(N)784621', 'II IT-28', '09890123467', '09890123467', 'FEMALE', '2003-02-09', '2324 Willow St, Yangon'),
(28, 'Thet Ngone Phuu', '9/MAUBI(N)316498', 'II IT-29', '09901234578', '09901234578', 'MALE', '2003-05-17', '789 Elm St, Yangon'),
(29, 'David Van Ro Ceu', '9/MYAUN(N)932647', 'II IT-30', '09123456791', '09123456791', 'MALE', '2003-08-09', '1011 Cedar St, Yangon'),
(30, 'Swe Lae Nandar', '12/KAMA(N)728134', 'II IT-31', '09234567892', '09234567892', 'FEMALE', '2003-04-21', '1213 Maple St, Yangon'),
(31, 'Htet Linn Htoo', '12/BAHA(N)451927', 'II IT-32', '09345678923', '09345678923', 'MALE', '2003-07-19', '1415 Oak St, Yangon'),
(32, 'Mg Soe Myat Tun', '12/INSE(N)368549', 'II IT-33', '09456789034', '09456789034', 'MALE', '2003-06-13', '1617 Birch St, Yangon'),
(33, 'Kaung Khant Kyaw', '12/HLAI(N)591283', 'II IT-34', '09567890145', '09567890145', 'MALE', '2003-05-30', '1819 Pine St, Yangon'),
(34, 'Ingyin Aye', '12/DAGO(N)278435', 'II IT-35', '09678901256', '09678901256', 'FEMALE', '2003-08-12', '2021 Elm St, Yangon'),
(35, 'Sailinnhtut', '12/TAMA(N)439672', 'II IT-36', '09999999935', '09123456789', 'MALE', '2003-11-03', '2223 Cedar St, Yangon'),
(36, 'Mamad Foyas', '14/MYIT(N)156839', 'II IT-37', '09999999936', '09123456788', 'MALE', '2002-10-23', '2425 Oak St, Yangon'),
(37, 'Mg Nyan Lin Tun', '14/BHAM(N)892637', 'II IT-38', '09999999937', '09123456787', 'MALE', '2002-12-08', '2627 Birch St, Yangon'),
(38, 'Zaw Min Aung', '14/PUTA(N)734256', 'II IT-39', '09999999938', '09123456786', 'MALE', '2003-02-05', '2829 Pine St, Yangon'),
(39, 'Htoo Aung Win', '14/MOHN(N)589134', 'II IT-40', '09999999939', '09123456785', 'MALE', '2003-01-19', '3031 Elm St, Yangon'),
(40, 'Min Ba Maw', '14/MYIT(N)613742', 'II IT-41', '09999999940', '09123456784', 'MALE', '2002-11-29', '3233 Cedar St, Yangon'),
(41, 'Win Pa Pa Aung', '14/BHAM(N)529781', 'II IT-42', '09999999941', '09123456783', 'MALE', '2002-09-10', '3435 Oak St, Yangon'),
(42, 'Htun Win Latt', '14/PUTA(N)874329', 'II IT-43', '09999999942', '09123456782', 'MALE', '2003-03-22', '3637 Birch St, Yangon'),
(43, 'Mg Aung Zay Phyo', '14/MOHN(N)365872', 'II IT-44', '09999999943', '09123456781', 'MALE', '2003-04-11', '3839 Pine St, Yangon'),
(44, 'Min Khaing Thant', '14/MYIT(N)498251', 'II IT-45', '09999999944', '09123456780', 'MALE', '2002-08-06', '4041 Elm St, Yangon'),
(45, 'My Kyaw Thura Aung', '14/BHAM(N)234569', 'II IT-46', '09999999945', '09123456779', 'MALE', '2003-02-27', '4243 Cedar St, Yangon'),
(46, 'Mg Naing Tayza', '14/PUTA(N)891372', 'II IT-48', '09999999946', '09123456778', 'MALE', '2002-10-12', '4445 Oak St, Yangon'),
(47, 'Nyo Min Maung Maung', '14/MOHN(N)517638', 'II IT-49', '09999999947', '09123456777', 'MALE', '2003-07-20', '4647 Birch St, Yangon'),
(48, 'Mg Min Myat Thu', '7/BAGO(N)296754', 'II IT-52', '09999999948', '09123456776', 'MALE', '2004-01-15', '4849 Pine St, Yangon'),
(49, 'Phyo Naing Soe', '7/THARY(N)674328', 'II IT-53', '09999999949', '09123456775', 'MALE', '2003-12-09', '5051 Elm St, Yangon'),
(50, 'Cherry Win', '7/PAUNG(N)438251', 'II IT-54', '09999999950', '09123456774', 'FEMALE', '2003-11-21', '5253 Cedar St, Yangon'),
(51, 'MayThinKhine', '7/NYAUN(N)519374', 'II IT-55', '09999999951', '09123456773', 'FEMALE', '2003-10-14', '5455 Oak St, Yangon'),
(52, 'Ma Phue Phue Zin', '7/BAGO(N)287134', 'II IT-56', '09999999952', '09123456772', 'FEMALE', '2003-05-04', '5657 Birch St, Yangon'),
(53, 'Zin Myo Tun', '7/THARY(N)394587', 'II IT-57', '09999999953', '09123456771', 'MALE', '2003-06-19', '5859 Pine St, Yangon'),
(54, 'Mg Phyo Myat Min', '7/PAUNG(N)645182', 'II IT-58', '09999999954', '09123456770', 'MALE', '2003-09-09', '6061 Birch St, Yangon'),
(55, 'Ma Hnin Aye Aye Wai', '7/NYAUN(N)812365', 'II IT-59', '09999999955', '09123456769', 'FEMALE', '2003-07-30', '6263 Oak St, Yangon'),
(56, 'Bhone Myat Thu', '7/BAGO(N)529348', 'II IT-60', '09999999956', '09123456768', 'MALE', '2003-06-25', '6465 Pine St, Yangon'),
(57, 'Paing Hein Kyaw', '1/MONY(N)368294', 'II IT-ext 2', '09999999957', '09123456767', 'MALE', '2004-03-15', '6667 Elm St, Yangon'),
(58, 'Ma Thida Aye Min', '1/SHWE(N)491837', 'II IT-Ext 3', '09999999958', '09123456766', 'FEMALE', '2004-02-20', '6869 Birch St, Yangon');


INSERT INTO `subject` (`id`, `code`, `name`, `created_at`) VALUES
(1, '1111', 'Java', '2024-08-19 15:08:12'),
(2, '2222', 'C++', '2024-08-19 15:08:20'),
(3, '3333', 'Software Engineering', '2024-08-19 15:08:34'),
(4, '4444', 'Maths', '2024-08-19 15:08:47'),
(5, '5555', 'English', '2024-08-19 15:08:55'),
(6, '6666', 'Physics', '2024-08-19 15:09:01'),
(7, '7777', 'Drawing', '2024-08-19 15:09:07'),
(8, '8888', 'Networking', '2024-08-19 15:09:20');