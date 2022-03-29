CREATE DATABASE  IF NOT EXISTS `infocenter` /*!40100 DEFAULT CHARACTER SET latin1 */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `infocenter`;
-- MySQL dump 10.13  Distrib 8.0.27, for Win64 (x86_64)
--
-- Host: localhost    Database: infocenter
-- ------------------------------------------------------
-- Server version	8.0.27

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
-- Table structure for table `access`
--

DROP TABLE IF EXISTS `access`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `access` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `access_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_474d43b1e67932ec788183a93a0` (`access_id`),
  CONSTRAINT `FK_474d43b1e67932ec788183a93a0` FOREIGN KEY (`access_id`) REFERENCES `user_access` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `access`
--

LOCK TABLES `access` WRITE;
/*!40000 ALTER TABLE `access` DISABLE KEYS */;
INSERT INTO `access` VALUES (1,'Announcements','2022-01-26 02:44:00.717968','2022-01-26 02:44:00.717968',NULL),(2,'Clubs/Classes','2022-01-26 02:44:11.453382','2022-01-26 02:44:11.453382',NULL),(3,'Enrollment','2022-01-26 02:44:19.136425','2022-01-26 02:44:19.136425',NULL),(4,'Homeroom Resources','2022-01-26 02:44:26.261271','2022-01-26 02:44:26.261271',NULL),(5,'Interventions','2022-01-26 02:44:34.271894','2022-01-26 02:44:34.271894',NULL),(6,'Reimbursements & Direct Orders','2022-01-26 02:44:42.942528','2022-01-26 02:44:42.942528',NULL);
/*!40000 ALTER TABLE `access` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cms_content`
--

DROP TABLE IF EXISTS `cms_content`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cms_content` (
  `content_id` int unsigned NOT NULL AUTO_INCREMENT,
  `path` varchar(256) NOT NULL DEFAULT '',
  `type` varchar(50) NOT NULL DEFAULT 'HTML',
  `location` varchar(50) NOT NULL DEFAULT 'Primary',
  `content` text,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `published` tinyint NOT NULL DEFAULT '1',
  `priority` tinyint unsigned NOT NULL DEFAULT '50',
  PRIMARY KEY (`content_id`),
  KEY `path` (`path`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cms_content`
--

LOCK TABLES `cms_content` WRITE;
/*!40000 ALTER TABLE `cms_content` DISABLE KEYS */;
/*!40000 ALTER TABLE `cms_content` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cms_nav`
--

DROP TABLE IF EXISTS `cms_nav`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cms_nav` (
  `nav` varchar(60) NOT NULL,
  `nav_item_id` int unsigned NOT NULL AUTO_INCREMENT,
  `order` int NOT NULL DEFAULT '0',
  `path` varchar(256) DEFAULT NULL,
  `title` varchar(60) DEFAULT NULL,
  `parent_nav_item_id` int unsigned DEFAULT NULL,
  `icon` varchar(90) DEFAULT NULL,
  PRIMARY KEY (`nav_item_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cms_nav`
--

LOCK TABLES `cms_nav` WRITE;
/*!40000 ALTER TABLE `cms_nav` DISABLE KEYS */;
/*!40000 ALTER TABLE `cms_nav` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `content`
--

DROP TABLE IF EXISTS `content`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `content` (
  `content_id` int unsigned NOT NULL AUTO_INCREMENT,
  `path` varchar(256) NOT NULL DEFAULT '',
  `type` varchar(50) NOT NULL DEFAULT 'HTML',
  `location` varchar(50) NOT NULL DEFAULT 'Primary',
  `content` text,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `published` tinyint NOT NULL DEFAULT '1',
  `priority` tinyint unsigned NOT NULL DEFAULT '50',
  PRIMARY KEY (`content_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `content`
--

LOCK TABLES `content` WRITE;
/*!40000 ALTER TABLE `content` DISABLE KEYS */;
/*!40000 ALTER TABLE `content` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `core_log`
--

DROP TABLE IF EXISTS `core_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `core_log` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `datetime` datetime DEFAULT NULL,
  `tag` varchar(255) DEFAULT NULL,
  `content` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `core_log`
--

LOCK TABLES `core_log` WRITE;
/*!40000 ALTER TABLE `core_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `core_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `core_settings`
--

DROP TABLE IF EXISTS `core_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `core_settings` (
  `name` varchar(60) NOT NULL,
  `category` varchar(60) NOT NULL DEFAULT '',
  `title` varchar(120) DEFAULT NULL,
  `type` varchar(50) NOT NULL,
  `value` longtext NOT NULL,
  `description` mediumtext,
  `user_changeable` tinyint NOT NULL DEFAULT '0',
  `date_changed` datetime NOT NULL,
  PRIMARY KEY (`name`,`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `core_settings`
--

LOCK TABLES `core_settings` WRITE;
/*!40000 ALTER TABLE `core_settings` DISABLE KEYS */;
INSERT INTO `core_settings` VALUES ('','',NULL,'Text','',NULL,0,'2021-03-17 17:00:48'),('2ndSemUpdatesRequiredReminder','Schedule','2nd Semester Deadline Reminder','Integer','5','<p>Number of days reminder is sent before 2nd semester deadline.</p>',1,'2020-07-08 18:53:07'),('2ndSemUpdatesRequiredReminder','Schedules','2nd Semester Deadline Reminder','Integer','2','<p>Number of days reminder is sent before 2nd semester deadline</p>',1,'2021-11-29 17:44:31'),('2ndSemUpdatesRequiredReminderEmail','Schedule','2nd Semester Auto Reminder Email Content','HTML','<p>Dear [PARENT],</p>\n           <p>This is a friendly reminder that you still need to submit the Student 2nd semester Schedule for [STUDENT] by <b>[DEADLINE]</b>.\n           </p><p>Please contact Amy at admin@mytechhigh.com if you have any questions.  Thanks!</p>\n           <p>--My Tech High</p>','<dl><dt>[PARENT]</dt>\n            <dd>Parent\'s first name</dd>\n            <dt>[STUDENT]</dt>\n            <dd>Student\'s first name</dd>\n            <dt>[DEADLINE]</dt>\n            <dd>The deadline is the 2nd Semester Schedule Submission End Date.</dd>\n          </dl>',1,'2020-07-08 18:53:07'),('2ndSemUpdatesRequiredReminderEmail','Schedules','2nd Semester Reminder Email Content','HTML','<p>Dear [PARENT],</p>\n\n<p>This is a friendly reminder that you still need to submit the Student 2nd semester Schedule for [STUDENT] by <strong>[DEADLINE]</strong>.</p>\n\n<p>If you don\'t need to make any updates, please login and select No Updates.</p>\n\n<p>Please contact usÂ at help@mytechhigh.com if you have any questions. Thanks!</p>\n\n<p>--My Tech High</p>\n\n<p>*This is just a test, please disregard if you receive this email* - MTH</p>\n','<dl><dt>[PARENT]</dt>\n            <dd>Parent\'s first name</dd>\n            <dt>[STUDENT]</dt>\n            <dd>Student\'s first name</dd>\n            <dt>[DEADLINE]</dt>\n            <dd>The deadline is the 2nd Semester Schedule Submission End Date.</dd>\n          </dl>',1,'2021-11-29 17:45:06'),('2ndSemUpdatesRequiredReminderSubject','Schedule','2nd Semester Auto Reminder Email Subject','Text','Reminder:  2nd Semester schedule needs update','',1,'2020-07-08 18:53:07'),('2ndSemUpdatesRequiredReminderSubject','Schedules','2nd Semester Auto Reminder Email Subject','Text','Reminder:  2nd Semester schedule needs update','',1,'2019-12-18 07:16:04'),('accessToken','mth_google',NULL,'RAW','{\"access_token\":\"ya29.a0ARrdaM8F9OsWGT9gy8ts9eca302buuTwY63PDZnNTwExNYmRZKDL96A885CP2kXBRxugiiSLHlDcDlWS8N-Gelh0NKje_odaCLg9sVpoY7Ntg-ZfRc4HZweVY3aUI8DQNFU0NdLyhfCOVws1gn9r1ZTZ5AabII4\",\"expires_in\":3599,\"scope\":\"https:\\/\\/www.googleapis.com\\/auth\\/drive\",\"token_type\":\"Bearer\",\"created\":1628814727}',NULL,0,'2021-08-12 18:32:07'),('accessTokenV2','DropBox',NULL,'Text','opXS24c-EzMAAAAAAAAAAVYdyMfDFXJIlA72H2U2Briw6tZsqK-8p9oZ6fgkD2bT',NULL,0,'2020-09-01 14:54:30'),('AccountID','',NULL,'Text','98485',NULL,0,'2015-03-23 05:00:09'),('AccountID','Canvas',NULL,'Text','98485',NULL,0,'2015-03-24 05:00:08'),('additionalEnrollmentContent','Enrollment','Additional Enrollment Information email content','HTML','<p>Hi, [PARENT],</p>\n\n<p>The 2018-19 school of enrollment for [STUDENT_FIRST] needs you to verify that the current enrollment packet information is up-to-date.This should take less than five minutes to complete.</p>\n\n<p><strong>Action required by 6/20/2018:</strong></p>\n\n<ul><li>Click on the customized link below to login to InfoCenter.</li>\n	<li>Verify that the information on each page iscomplete.</li>\n	<li>Resubmit the packet.</li>\n</ul><p>[LINK]</p>\n\n<p>Thanks for your help!</p>\n\n<p>- My Tech High</p>\n\n<p>*This is just a test, please disregard if you receive this email* - MTH</p>\n','<dl><dt>[PARENT]</dt>\n        <dd>Parent\'s first name</dd>\n        <dt>[STUDENT_FIRST]</dt>\n        <dd>Student\'s First Name</dd>\n        <dt>[LINK]</dt>\n        <dd>Enrollment Packet Link</dd>\n      </dl>',1,'2021-02-16 15:09:22'),('additionalEnrollmentSubject','Enrollment','Additional Enrollment Information email Subject','Text','Enrollment Packet Verification','',1,'2021-01-19 16:16:15'),('adminEmail','','Admin Email','Text','admin@mytechhigh.com','<p>This is admin email address</p>',1,'2021-07-28 16:19:00'),('AllowDiplomaSeekingQuestion','Diploma_seeking_question','Enable Diploma Seeking Question','Bool','0','Diploma Seeking Question',1,'2021-08-24 11:54:56'),('allow_none','schedule_period','Enable option None','Bool','1','Schedule Periods can be allowed to be set to none if this checkbox is checked.',1,'2021-06-29 15:22:30'),('allow_none_period_1','schedule_period','Period 1','Bool','0','Period 1',1,'2021-06-29 15:22:30'),('allow_none_period_2','schedule_period','Period 2','Bool','0','Period 2',1,'2021-06-29 15:22:30'),('allow_none_period_3','schedule_period','Period 3','Bool','0','Period 3',1,'2021-06-29 15:22:30'),('allow_none_period_4','schedule_period','Period 4','Bool','0','Period 4',1,'2021-06-29 15:22:30'),('allow_none_period_5','schedule_period','Period 5','Bool','0','Period 5',1,'2021-06-29 15:22:30'),('allow_none_period_6','schedule_period','Period 6','Bool','0','Period 6',1,'2021-06-29 15:22:30'),('allow_none_period_7','schedule_period','Period 7','Bool','1','Period 7',1,'2021-08-24 11:51:57'),('announcementsbcc','Announcements','Email BCC','Text','jen@mytechhigh.com','<p>Send an email copy to this email address.</p>',1,'2020-07-08 18:53:07'),('applicationAcceptedEmailContent','Applications','Application Accepted Email Content','HTML','<p>Hi, [PARENT],</p>\n\n<p>Congratulations!</p>\n\n<p>You are receiving this message as initial confirmation that [STUDENT] has been accepted to our [YEAR] My Tech High program.</p>\n\n<p>To finalize acceptance and reserve the spot, please complete the following by <strong>[DEADLINE]</strong>.</p>\n\n<ul><li>Review all program details and requirements posted at <a href=\"http://mytechhigh.com/utah\" target=\"_blank\">mytechhigh.com/utah</a>.</li>\n	<li>Complete and submit an Enrollment Packet for [STUDENT] (login to your parent account at <a href=\"http://mytechhigh.com/infocenter\" target=\"_blank\">mytechhigh.com/infocenter</a>).</li>\n</ul><p><strong>Important Notes:</strong></p>\n\n<ul><li>Students are <strong>NOT</strong> considered officially enrolled until all documents have been received, reviewed, and approved.</li>\n	<li>Once approved, we will send you a final acceptance notification for [STUDENT].</li>\n	<li>You will then be invited to submit a personalized course schedule for approval.</li>\n	<li>Join a live, online Q&amp;A Session with a Parent Support Specialist (see scheduleÂ atÂ <a href=\"https://www.mytechhigh.com/livechat/\" target=\"_blank\">mytechhigh.com/livechat</a>)Â to get all your program questions answered!</li>\n	<li>Feel free to contact Amy at admin@mytechhigh.com with questions.</li>\n</ul><p>Thank youÂ - weâ€™re excited to have [STUDENT] join our program!Â Â </p>\n\n<p>- My Tech High</p>\n\n<p>Â *This is just a test, please disregard if you receive this email* - MTH</p>\n','<p>When an application is accepted the parent will recieve this email. \n          You can use the following codes in the email content and subject which will be replaces with actual values:</p>\n          <dl><dt>[PARENT]</dt>\n          <dd>Parent\'s first name</dd>\n          <dt>[STUDENT]</dt>\n          <dd>Student\'s first name</dd>\n          <dt>[YEAR]</dt>\n          <dd>The school year they applied for (e.g. 2014-15)</dd>\n          <dt>[DEADLINE]</dt>\n          <dd>The deadline that the packet information must be all submitted</dd>\n          </dl>',1,'2021-04-14 17:31:53'),('applicationAcceptedEmailSubject','Applications','Application Accepted Email Subject','Text','Initial Letter of Acceptance to the [YEAR] My Tech High program','',1,'2021-04-14 17:31:53'),('applicationPacketsFixed','temp',NULL,'Text','1',NULL,0,'0000-00-00 00:00:00'),('aws_files_bucket','mthawss3',NULL,'Text','infocenter-staging-ut',NULL,0,'2020-07-08 18:53:08'),('aws_files_bucket_region','mthawss3',NULL,'Text','us-west-2',NULL,0,'2020-07-08 18:53:08'),('aws_key_id','mthawss3',NULL,'Text','AKIA5FMSFYXPF5KRY6YX',NULL,0,'2020-07-08 18:53:08'),('aws_key_secret','mthawss3',NULL,'Text','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',NULL,0,'2020-07-08 18:53:08'),('canvasAccount','User','Canvas Account','HTML','<p>There is a canvas account crated for [FIRST_NAME]. Please use the credential below and be sure to reset password after logging in.</p>\n\n<p>Email: [EMAIL]<br />\nPassword: [PASSWORD]</p>\n\n<p>*This is just a test, please disregard if you receive this email* - MTH</p>\n','',1,'2021-02-16 15:07:12'),('canvasAccountSubject','User','Canvas Account Subject','Text','Canvas Account Credential','',1,'2021-01-12 13:00:39'),('consecutiveExNoticeEmailContent','Interventions','Consecutive EX Content','HTML','<p>Hello [PARENT_FIRST],</p>\n\n<p>Our records indicate that [STUDENT_FIRST] has reached or exceeded the number of Excused Learning Logs (i.e. two consecutive or a total of four for the year). We want to help your student be successful in their personalized education program and remind you that submitting a full Learning Log every week is required to remain enrolled in the program.</p>\n\n<p>To check student progress, login to InfoCenter at <a href=\"https://infocenter.mytechhigh.com\" target=\"_blank\">https://infocenter.mytechhigh.com</a> and click on the Homeroom button.</p>\n\n<p>Please let us know if there\'s anything we can do to help.</p>\n\n<p>Thanks!<br />\nStephanie</p>\n\n<p>*This is just a test, please disregard if you receive this email* - MTH</p>\n','<p>[STUDENT_FIRST] - the student\'s  preferred first name<br />\n            [PARENT_FIRST] - the parent\'s  preferred first name<br /></p>',1,'2021-02-16 15:08:14'),('consecutiveExNoticeEmailSubject','Interventions','Consecutive Ex Subject','Text','Be sure to submit a full Learning Log this week!','',1,'2021-01-08 15:53:47'),('consumer_key','mth_wooCommerce',NULL,'Text','***REMOVED***',NULL,0,'2020-07-08 18:53:07'),('consumer_secret','mth_wooCommerce',NULL,'Text','***REMOVED***',NULL,0,'2020-07-08 18:53:07'),('CoreAdminMenuSet','',NULL,'Text','1',NULL,0,'0000-00-00 00:00:00'),('count-1-exsisting','mth_canvas_enrollment',NULL,'Integer','4360',NULL,0,'2014-10-15 12:29:58'),('count-1-new','mth_canvas_enrollment',NULL,'Integer','3',NULL,0,'2014-10-15 12:30:01'),('count-1-not_to_be_pushed','mth_canvas_user',NULL,'Integer','1995',NULL,0,'2014-09-16 13:24:03'),('count-1-to_be_pushed','mth_canvas_user',NULL,'Integer','49',NULL,0,'2014-09-16 13:24:03'),('count-4-exsisting','mth_canvas_enrollment',NULL,'Integer','5917',NULL,0,'2016-04-25 15:09:38'),('count-4-new','mth_canvas_enrollment',NULL,'Integer','3',NULL,0,'2016-04-25 15:09:39'),('count-5-exsisting','mth_canvas_enrollment',NULL,'Integer','0',NULL,0,'2016-08-09 07:33:35'),('count-5-new','mth_canvas_enrollment',NULL,'Integer','0',NULL,0,'2016-08-09 07:33:38'),('created_enrollments_222','mth_canvas_enrollment',NULL,'RAW','a:2:{i:1;a:0:{}i:2;a:0:{}}',NULL,0,'2017-10-06 23:27:57'),('created_enrollments_224','mth_canvas_enrollment',NULL,'RAW','a:2:{i:1;a:0:{}i:2;a:0:{}}',NULL,0,'2019-01-14 14:21:05'),('created_enrollments_231','mth_canvas_enrollment',NULL,'RAW','a:2:{i:1;a:0:{}i:2;a:0:{}}',NULL,0,'2017-10-06 22:28:20'),('created_enrollments_232','mth_canvas_enrollment',NULL,'RAW','a:2:{i:1;a:0:{}i:2;a:0:{}}',NULL,0,'2019-01-14 14:21:36'),('created_enrollments_234','mth_canvas_enrollment',NULL,'RAW','a:2:{i:1;a:0:{}i:2;a:0:{}}',NULL,0,'2019-01-14 14:21:07'),('created_enrollments_246','mth_canvas_enrollment',NULL,'RAW','a:2:{i:1;a:0:{}i:2;a:0:{}}',NULL,0,'2017-10-04 16:13:41'),('created_enrollments_247','mth_canvas_enrollment',NULL,'RAW','a:2:{i:1;a:0:{}i:2;a:0:{}}',NULL,0,'2021-01-12 12:48:22'),('created_enrollments_248','mth_canvas_enrollment',NULL,'RAW','a:2:{i:1;a:0:{}i:2;a:0:{}}',NULL,0,'2021-01-12 12:48:21'),('created_enrollments_250','mth_canvas_enrollment',NULL,'RAW','a:2:{i:1;a:0:{}i:2;a:0:{}}',NULL,0,'2019-01-14 14:21:31'),('created_enrollments_253','mth_canvas_enrollment',NULL,'RAW','a:2:{i:1;a:0:{}i:2;a:0:{}}',NULL,0,'2017-10-06 22:24:23'),('created_enrollments_271','mth_canvas_enrollment',NULL,'RAW','a:2:{i:1;a:0:{}i:2;a:0:{}}',NULL,0,'2021-01-12 12:48:20'),('created_enrollments_272','mth_canvas_enrollment',NULL,'RAW','a:2:{i:1;a:0:{}i:2;a:0:{}}',NULL,0,'2021-01-12 12:48:20'),('created_enrollments_273','mth_canvas_enrollment',NULL,'RAW','a:2:{i:1;a:0:{}i:2;a:0:{}}',NULL,0,'2019-12-04 20:19:55'),('created_enrollments_278','mth_canvas_enrollment',NULL,'RAW','a:2:{i:1;a:0:{}i:2;a:0:{}}',NULL,0,'2021-01-12 12:48:17'),('created_enrollments_281','mth_canvas_enrollment',NULL,'RAW','a:2:{i:1;a:0:{}i:2;a:0:{}}',NULL,0,'2021-01-12 12:48:19'),('created_enrollments_283','mth_canvas_enrollment',NULL,'RAW','a:2:{i:1;a:0:{}i:2;a:0:{}}',NULL,0,'2021-01-12 12:59:18'),('created_enrollments_284','mth_canvas_enrollment',NULL,'RAW','a:2:{i:1;a:0:{}i:2;a:0:{}}',NULL,0,'2019-01-14 14:20:53'),('created_enrollments_286','mth_canvas_enrollment',NULL,'RAW','a:2:{i:1;a:0:{}i:2;a:0:{}}',NULL,0,'2021-01-12 12:48:12'),('created_enrollments_293','mth_canvas_enrollment',NULL,'RAW','a:2:{i:1;a:0:{}i:2;a:0:{}}',NULL,0,'2019-01-14 14:20:54'),('created_enrollments_294','mth_canvas_enrollment',NULL,'RAW','a:2:{i:1;a:0:{}i:2;a:0:{}}',NULL,0,'2019-01-14 14:20:54'),('created_enrollments_295','mth_canvas_enrollment',NULL,'RAW','a:2:{i:1;a:0:{}i:2;a:0:{}}',NULL,0,'2019-01-14 14:20:55'),('created_enrollments_298','mth_canvas_enrollment',NULL,'RAW','a:2:{i:1;a:0:{}i:2;a:0:{}}',NULL,0,'2019-01-14 14:21:06'),('created_enrollments_299','mth_canvas_enrollment',NULL,'RAW','a:2:{i:1;a:0:{}i:2;a:0:{}}',NULL,0,'2019-01-14 14:21:21'),('created_enrollments_300','mth_canvas_enrollment',NULL,'RAW','a:2:{i:1;a:0:{}i:2;a:0:{}}',NULL,0,'2019-01-14 14:21:23'),('created_enrollments_301','mth_canvas_enrollment',NULL,'RAW','a:2:{i:1;a:0:{}i:2;a:0:{}}',NULL,0,'2019-01-14 14:21:46'),('created_enrollments_302','mth_canvas_enrollment',NULL,'RAW','a:2:{i:1;a:0:{}i:2;a:0:{}}',NULL,0,'2019-01-14 14:21:42'),('created_enrollments_309','mth_canvas_enrollment',NULL,'RAW','a:2:{i:1;a:0:{}i:2;a:0:{}}',NULL,0,'2021-01-12 12:48:11'),('created_enrollments_317','mth_canvas_enrollment',NULL,'RAW','a:2:{i:1;a:0:{}i:2;a:0:{}}',NULL,0,'2021-01-12 12:48:13'),('created_enrollments_325','mth_canvas_enrollment',NULL,'RAW','a:2:{i:1;a:0:{}i:2;a:0:{}}',NULL,0,'2021-01-12 12:48:14'),('created_enrollments_56','mth_canvas_enrollment',NULL,'RAW','a:2:{i:1;a:0:{}i:2;a:0:{}}',NULL,0,'2021-01-12 12:48:23'),('created_enrollments_59','mth_canvas_enrollment',NULL,'RAW','a:2:{i:1;a:0:{}i:2;a:0:{}}',NULL,0,'2021-01-12 12:48:15'),('created_enrollments_6','mth_canvas_enrollment',NULL,'RAW','a:2:{i:1;a:0:{}i:2;a:0:{}}',NULL,0,'2018-01-22 15:38:51'),('created_enrollments_60','mth_canvas_enrollment',NULL,'RAW','a:2:{i:1;a:0:{}i:2;a:0:{}}',NULL,0,'2021-01-12 12:48:16'),('created_enrollments_61','mth_canvas_enrollment',NULL,'RAW','a:2:{i:1;a:0:{}i:2;a:0:{}}',NULL,0,'2021-01-12 12:58:08'),('created_enrollments_62','mth_canvas_enrollment',NULL,'RAW','a:2:{i:1;a:0:{}i:2;a:0:{}}',NULL,0,'2021-01-12 12:48:17'),('created_enrollments_64','mth_canvas_enrollment',NULL,'RAW','a:2:{i:1;a:0:{}i:2;a:0:{}}',NULL,0,'2017-10-06 22:28:43'),('created_enrollments_65','mth_canvas_enrollment',NULL,'RAW','a:2:{i:1;a:0:{}i:2;a:0:{}}',NULL,0,'2019-01-14 14:21:08'),('created_enrollments_69','mth_canvas_enrollment',NULL,'RAW','a:2:{i:1;a:0:{}i:2;a:0:{}}',NULL,0,'2021-01-12 12:48:18'),('created_enrollments_7','mth_canvas_enrollment',NULL,'RAW','a:2:{i:1;a:0:{}i:2;a:0:{}}',NULL,0,'2018-01-22 15:28:21'),('created_enrollments_70','mth_canvas_enrollment',NULL,'RAW','a:2:{i:1;a:0:{}i:2;a:0:{}}',NULL,0,'2019-01-14 14:21:07'),('created_enrollments_71','mth_canvas_enrollment',NULL,'RAW','a:2:{i:1;a:0:{}i:2;a:0:{}}',NULL,0,'2020-10-26 17:14:43'),('created_enrollments_76','mth_canvas_enrollment',NULL,'RAW','a:2:{i:1;a:0:{}i:2;a:0:{}}',NULL,0,'2019-01-14 14:21:26'),('created_enrollments_78','mth_canvas_enrollment',NULL,'RAW','a:2:{i:1;a:1:{i:0;i:119854;}i:2;a:0:{}}',NULL,0,'2019-12-05 13:04:56'),('created_enrollments_8','mth_canvas_enrollment',NULL,'RAW','a:2:{i:1;a:0:{}i:2;a:0:{}}',NULL,0,'2017-11-01 20:01:29'),('created_enrollments_80','mth_canvas_enrollment',NULL,'RAW','a:2:{i:1;a:0:{}i:2;a:0:{}}',NULL,0,'2017-10-06 22:28:54'),('created_enrollments_81','mth_canvas_enrollment',NULL,'RAW','a:2:{i:1;a:0:{}i:2;a:0:{}}',NULL,0,'2021-01-12 12:48:14'),('DefaultMenuSet','',NULL,'Text','1',NULL,0,'0000-00-00 00:00:00'),('deleted-withdrawals-2017-18','withdrawals',NULL,'RAW','a:9:{i:9183;i:9183;i:9889;i:9889;i:9888;i:9888;i:10574;i:10574;i:5389;i:5389;i:2934;i:2934;i:9034;i:9034;i:6721;i:6721;i:6720;i:6720;}',NULL,0,'2018-05-09 07:52:05'),('deleted-withdrawals-2018-19','withdrawals',NULL,'RAW','a:2:{i:12797;i:12797;i:12880;i:12880;}',NULL,0,'2019-04-10 06:06:03'),('deleted-withdrawals-2020-21','withdrawals',NULL,'RAW','a:6:{i:15439;i:15439;i:15582;i:15582;i:15594;i:15594;i:15597;i:15597;i:15598;i:15598;i:15610;i:15610;}',NULL,0,'2020-10-16 09:11:04'),('DiplomaSeekingQuestionDefault','Diploma_seeking_question','Default value in diploma seeking question','Bool','1','Diploma Seeking Question',1,'2021-08-24 11:54:45'),('directOrderApprovalEmailContent','DirectOrders','Approval Email Content','HTML','<p><strong>Hi </strong>[PARENT_FIRST]Â [PARENT_LAST]<strong>,</strong></p>\n\n<p><strong>Your Request for a Direct Order has been approved:</strong></p>\n\n<p><strong>Submitted: </strong>[DIRECT_ORDER_SUBMITTED_DATE]</p>\n\n<p><strong>Amount: Â </strong>$[DIRECT_ORDER_AMOUNT]</p>\n\n<p><strong>Student:Â </strong>[STUDENT_FIRST]Â [STUDENT_LAST]</p>\n\n<p><strong>Class:Â </strong>[CLASS_PERIOD_DESCRIPTION]</p>\n\n<p><strong>For us to purchase the Direct Order, you MUST schedule 1-1 Zoom Meeting here:Â <a href=\"https://1qtsfyh4.r.us-west-2.awstrack.me/L0/https:%2F%2Fcalendly.com%2Fdirectorders-mth%2Fdirect-order-appointment/1/01010173eac1836e-e5c68d0c-6f72-4fb2-a23f-b2857e847ac2-000000/aKZxMQ3w5z7YniGxw-PGPQJPGoM=175\" target=\"_blank\">mth/direct-order-appointment</a></strong></p>\n\n<p>My Tech High</p>\n\n<p>*This is just a test, please disregard if you receive this email* - MTH</p>\n','<p>Direct Orders Approval Email Content</p>',1,'2021-02-16 15:10:06'),('directOrderApprovedEmailSubject','DirectOrders','Approval Email Subject','Text','Action Required - Direct Order Approved','<p>Email subject for Direct Order Approved email</p>',1,'2021-01-12 12:34:02'),('directOrderOrderConfirmationEmailContent','DirectOrders','Order Confirmation Email Content','HTML','<p>Hi [PARENT_FIRST_NAME],</p>\n\n<p>Your Request for a Direct Order has been placed:</p>\n\n<p><strong>Submitted:</strong> [DATE_DIRECT_ORDER_SUBMITTED]<br /><strong>Provider:</strong> [DIRECT_ORDER_WISHLIST_PROVIDER]<br /><strong>Wishlist Link:</strong> [DIRECT_ORDER_WISHLIST_LINK]<br /><strong>Amount:</strong> $[DIRECT_ORDER_AMOUNT]<br /><strong>Student:</strong> [STUDENT_FULL_NAME]<br />\n[STUDENT_SCHEDULE_PERIOD_DESCRIPTION]<br /><strong>Order Confirmation:</strong> Â [DIRECT_ORDER_CONFIRMATION]<br /><strong>My Tech High Team Member:</strong>Â  [ADMIN_USER_FULL_NAME] - [ADMIN_USER_EMAIL]</p>\n\n<p>My Tech High</p>\n\n<p>*This is just a test, please disregard if you receive this email* - MTH</p>\n','<p>Direct Orders Order Confirmed Email Content</p>',1,'2021-02-16 15:10:06'),('directOrderOrderConfirmationEmailSubject','DirectOrders','Order Confirmation Email Subject','Text','Direct Order Placed','<p>Email subject for Direct Order Order Confirmation email</p>',1,'2021-01-12 12:34:02'),('EmailChangeNoticeContent','Miscellaneous','Email Change Notification Content','HTML','<p>Our records indicate that one or more email addresses have been changed in your family\'s InfoCenter account. It\'s also important to keep all emails updated in Canvas as well.</p>\n\n<p><strong>Here are the steps to change an email in Canvas:</strong><br />\n1) Add the new email to the student account (see <a href=\"http://guides.instructure.com/m/4152/l/41471-how-do-i-add-an-additional-email-address-in-canvas\" target=\"_blank\">How To Guide</a>)<br />\n2) Change the new email to become the Default email by clicking the star next to it (see <a href=\"http://guides.instructure.com/m/4152/l/65392-how-do-i-change-my-default-email-address\" target=\"_blank\">How To Guide</a>)<br />\n3) Once changed, delete the old one by clicking on the Trash Can next to it</p>\n\n<p>These steps will make the new email the username to use when logging into Canvas.</p>\n\n<p>Thanks!</p>\n\n<p>*This is just a test, please disregard if you receive this email* - MTH</p>\n','<p>This email is sent to the parent when theirs or one of their student\'s emails are changed.</p>',1,'2021-02-16 15:05:25'),('EmailChangeNoticeSubject','Miscellaneous','Email Change Notification Subject','Text','Update email in Canvas','',1,'2021-01-08 15:09:50'),('exceedEXNoticeEmailContent','Interventions','Exceed EX Content','HTML','<p>Hello [PARENT_FIRST],</p>\n\n<p>Our records indicate that [STUDENT_FIRST] has submitted more than four total Excused Learning Logs for the year.</p>\n\n<p>To check student progress, <a href=\"http://mytechhigh.com/infocenter\" target=\"_blank\">login here to InfoCenter</a> and click on the Homeroom button.</p>\n\n<p>As Weekly Learning Logs are an essential requirement of our personalized education program, students who request more than a total of four Excused Logs in the school year will be withdrawn.</p>\n\n<p>ACTION REQUIRED by the end of the day [DUE_DATE].</p>\n\n<ul><li>Resubmit a previously excused Learning Log with additional details AND commit to submitting a complete Learning Log every week for the rest of the year to remain enrolled.</li>\n</ul><p>OR</p>\n\n<ul><li>If the My Tech High Learning Log requirements are not a good fit for your student this year, initiate the withdrawal process by completing this <a href=\"http://mytechhigh.com/withdraw\" target=\"_blank\">Withdrawal Form</a>.</li>\n</ul><p>Thank you for your attention to this important matter.</p>\n\n<p>Stephanie</p>\n\n<p>*This is just a test, please disregard if you receive this email* - MTH</p>\n','<p>[STUDENT_FIRST] - the student\'s  preferred first name<br />\n                [PARENT_FIRST] - the parent\'s  preferred first name<br />\n                [DUE_DATE] - the day when email falls due(3 days)\n                </p>',1,'2021-02-16 15:08:14'),('exceedEXNoticeEmailSubject','Interventions','Exceed EX Subject','Text','ACTION REQUIRED - Exceeded Maximum Number of Excused Learning Logs','',1,'2021-01-08 15:53:47'),('finalNoticeEmailContent','Interventions','Final Notice Email Content','HTML','<p>Hello [PARENT_FIRST],</p>\n\n<p>It looks like [STUDENT_FIRST] is still below 80% and/or is missing one or more Weekly Learning Logs. Students need to submit a Learning Log EVERY WEEK and maintain a grade of at least 80% to remain enrolled in the My Tech High program.</p>\n\n<p><strong>Action Required by [DUE_DATE]:</strong></p>\n\n<ul><li>\n	<p>Please help [STUDENT_FIRST] submit missing or resubmit low scoring Learning Logs by the end of day [DUE_DATE].</p>\n	</li>\n</ul><p>OR</p>\n\n<ul><li>\n	<p>Initiate the withdrawal process by contacting Amy (admin@mytechhigh.com). The details of the Withdrawal Policy are included <a href=\"https://www.mytechhigh.com/enrollment-packet-policies/\" target=\"_blank\">here</a>. Note that there may be fees associated with the Withdrawal.</p>\n	</li>\n</ul><p>Please let me know if you have any questions or need help with the Learning Logs.</p>\n\n<p>Thanks!</p>\n\n<p>Stephanie</p>\n\n<p>*This is just a test, please disregard if you receive this email* - MTH</p>\n','<p>[STUDENT_FIRST] - the student\'s  preferred first name<br />\n            [PARENT_FIRST] - the parent\'s  preferred first name<br />\n            [DUE_DATE] - the day when email falls due(3 days)\n            </p>',1,'2021-02-16 15:08:14'),('finalNoticeEmailSubject','Interventions','Final Notice Email Subject','Text','Withdrawal Notice - [DUE_DATE]','<p>[DUE_DATE] - the day when email falls due(3 days)</p>',1,'2021-01-08 15:53:47'),('firstNoticeEmailContent','Interventions','First Notice Email Content','HTML','<p>Hello [PARENT_FIRST],</p>\n\n<p>Our records indicate that [STUDENT_FIRST] is currently below 80% and/or is missing one or more Weekly Learning Logs. (To check student progress, <a href=\"https://infocenter.mytechhigh.com/\" target=\"_blank\">login here to InfoCenter</a> and click on the Homeroom button.).</p>\n\n<p>As a reminder, students need to submit a Learning Log EVERY WEEK and maintain a grade of at least 80% to remain enrolled in the My Tech High program.</p>\n\n<p><strong>ACTION REQUIRED:</strong></p>\n\n<p>Please help [STUDENT_FIRST] submit missing or resubmit low scoring Learning Logs by the end of day [DUE_DATE].</p>\n\n<p>Let me know if you have any questions or need help with this important requirement.</p>\n\n<p>Thanks!</p>\n\n<p>Stephanie</p>\n\n<p>*This is just a test, please disregard if you receive this email* - MTH</p>\n\n<p>Â </p>\n','<p>[STUDENT_FIRST] - the student\'s  preferred first name<br />\n            [PARENT_FIRST] - the parent\'s  preferred first name<br />\n            [DUE_DATE] - the day when email falls due(5 days)\n            </p>',1,'2021-02-16 15:08:14'),('firstNoticeEmailSubject','Interventions','First Notice Email Subject','Text','Action Required:  Notice of Possible Withdrawal - [DUE_DATE]','<p>[DUE_DATE] - the day when email falls due(5 days)</p>',1,'2021-01-08 15:53:47'),('forgotPasswordEmailContent','User','Forgot Password Email','HTML','<p>A request to reset the password for your account has been made at [SITENAME].</p>\n\n<p>Use this link to create a new password:</p>\n\n<p>[LINK]</p>\n\n<p>If you did not make a password reset request, delete this email and notify us at admin@mytechhigh.com.</p>\n\n<p>[SITENAME]</p>\n\n<p>*This is just a test, please disregard if you receive this email* - MTH</p>\n','<p>If a user forgets his or her password and requests to reset it this email will be sent to them. \n          You can include <b>[SITENAME]</b> in the content which will be replace with the site name. \n            You must include <b>[LINK]</b> or the user will not recieve the link to reset the password.<br /><em>Note: This WYSIWYG editor may have abuilities that will not work in an email. \n            For email it\'s best to keep it simple.</em></p>',1,'2021-02-16 15:07:12'),('forgotPasswordEmailSubject','User','Forgot Password Email Subject','Text','Password Forgotten - My Tech High','',1,'2021-01-12 13:00:39'),('GoogleAPIkey','',NULL,'Text','AIzaSyAxT4VIkgP5FS1gf5Heok4vCyPlNE27j5o',NULL,0,'2020-07-08 18:53:06'),('headsUpNoticeEmailContent','Interventions','Heads up Email Content','HTML','<p>Hello [PARENT_FIRST],</p>\n\n<p>You are receiving this notice to make sure you are aware that one or more of your children has not submitted all Weekly Learning Logs and/or has submitted Learning Logs without enough detail.</p>\n\n<p>Students are required to submit a Learning Log each week and maintain a grade of at least 80% to remain enrolled in the My Tech High program (see attached scoring guide).</p>\n\n<p>To check student progress, <a href=\"https://infocenter.mytechhigh.com/\" target=\"_blank\">login here to InfoCenter</a> and click on the Homeroom button.</p>\n\n<p>Please let me know if you have any questions or need help with the Learning Logs.</p>\n\n<p>Thanks!</p>\n\n<p>Stephanie</p>\n\n<p>*This is just a test, please disregard if you receive this email* - MTH</p>\n','<p>\n            [PARENT_FIRST] - the parent\'s  preferred first name\n            </p>',1,'2021-02-16 15:08:14'),('headsUpNoticeEmailSubject','Interventions','Heads up Email Subject','Text','Check your student&#039;s Homeroom progress','',1,'2021-02-16 15:08:14'),('homeroombcc','Homeroom','Homeroom Teacher Email BCC','Text','help@mytechhigh.com','<p>Send an email copy to this email address</p>',1,'2020-07-08 18:53:07'),('homeroomreminder','Homeroom','Learning Log Submission Reminder Subject','Text','Learning Log Submission Reminder','',1,'2021-01-08 12:59:46'),('homeroomremindercontent','Homeroom','Learning Log Submission Reminder Content','HTML','<p>Hello [PARENT_FIRST],</p>\n\n<p>This is a friendly reminder that [STUDENT_FIRST] need to submit a Learning Log for this week AND maintain a Homeroom grade of at least 80%.</p>\n\n<p>You can check your student\'s progress anytime via Homeroom in your <a href=\"http://dev-infocenter.mytechhigh.com\" target=\"_blank\">InfoCenter account</a>.</p>\n\n<p>We appreciate the efforts you and your student are making. Please let me know if you have any questions or need help with the Learning Logs.</p>\n\n<p>Thanks!<br />\n[TEACHER_FULL_NAME]</p>\n\n<p>*This is just a test, please disregard if you receive this email* - MTH</p>\n','',1,'2021-02-16 15:09:46'),('iep_documents','packet_settings','IEP/504 Documents','Bool','1','Allow 504/IEP upload button to be enabled and require a new document',1,'2021-06-23 16:59:19'),('iep_documents','re-enrollment_packet','IEP/504 Documents Information email content','Text','Please update your IEP/504 Documents - TEST MTH','',1,'2021-03-01 12:54:51'),('immunizations','packet_settings','Immunizations','Bool','1','Allow Immunization upload button to be enabled and require a new document',1,'2021-08-24 11:48:20'),('immunizations','re-enrollment_packet','Immunization Information email content','HTML','<p>As required by state law, all students must be fully immunized or submit a <a href=\"http://cdphe.colorado.gov/vaccine-exemptions\" target=\"_blank\">personal exemption form</a>. Our records indicate that [STUDENT_NAME] needs to update their immunization records for the [UPCOMING_GRADE_LEVEL]th grade based on one or both of the requirements below.Â </p>\n\n<ul><li>\n	<p>Any student who submitted an exemption form for the 2020-21 school year must submit a new <a href=\"http://cdphe.colorado.gov/vaccine-exemptions\" target=\"_blank\">exemption form</a> that was issued this year.</p>\n	</li>\n	<li>\n	<p>Any student entering the 6th grade must submit an immunization record or exemption form for Tdap.</p>\n	</li>\n</ul>','<dl><dt>[STUDENT_NAME]</dt>\n        <dd>Student\'s First Name</dd>\n        <dt>[UPCOMING_GRADE_LEVEL]</dt><dt>\n        </dt><dd>Upcoming grade Level</dd>\n    </dl>',1,'2021-03-12 09:49:21'),('interventionbcc','Interventions','Email BCC','Text','hess@mytechhigh.com','<p>Send an email copy to this email address</p>',1,'2020-07-08 18:53:07'),('interventionconsecutiveexbcc','Interventions','Consicutive EX Email BCC','Text','help@mytechhigh.com','<p>Send an email copy to this email address</p>',1,'2020-07-08 18:53:07'),('is_ssl','mth_wooCommerce',NULL,'Bool','1',NULL,0,'2020-07-08 18:53:08'),('LastCanvasCommand','',NULL,'Text','courses',NULL,0,'2021-09-24 05:00:12'),('learninglogs','advance','Allow Learning Logs without approved Schedule','Bool','1','Allow Learning Logs without approved Schedule',1,'2021-08-24 11:59:25'),('logDaysEditable','LearningLog','Days to submit early','Integer','90','<p>Number of days learning log can be submitted early.</p>',1,'2021-07-30 16:27:39'),('ManualPacketReminderContent','ManualPacketReminder','Packet Reminder Email Content','HTML','<p>Hi [PARENT],</p>\n    <p>Just a reminder to complete the following for [STUDENT]\'s My Tech High enrollment by [DEADLINE].</p>\n    <p>Please use the link below to submit the required document(s) and/or information:</p>\n    <p>[LINK]</p>\n    <p>Let us know if you have any questions by contacting us at <a href=\"help@mytechhigh.com\">help@mytechhigh.com</a>. We\'re happy to help in any wayÂ we can!</p>\n    <p>Thanks!</p>\n    <p>My Tech High</p>','<dl><dt>[PARENT]</dt>\n        <dd>Parent\'s First Name</dd>\n        <dt>[STUDENT]</dt>\n        <dd>Student\'s First Name</dd>\n        <dt>[LINK]</dt>\n        <dd>The link for the parent to access student\'s packet</dd>\n        <dt>[DEADLINE]</dt>\n        <dd>The deadline that the packet information must be all submitted</dd>\n    </dl>',1,'2021-04-29 07:24:40'),('ManualPacketReminderContent','Packets','Packet Manual Reminder Email Content','HTML','<p>Hi [PARENT],Â </p>\n\n<p>Just a reminder to complete the following for [STUDENT]\'s My Tech High enrollment by [DEADLINE].</p>\n\n<p>Please use the link below to submit the required document(s) and/or information:</p>\n\n<p>[LINK]</p>\n\n<p>Let us know if you have any questions by contacting us at <a href=\"help@mytechhigh.com\">help@mytechhigh.com</a>. We\'re happy to help in any wayÂ we can!</p>\n\n<p>Thanks!</p>\n\n<p>My Tech High</p>\n\n<p>*This is just a test, please disregard if you receive this email* - MTH</p>\n','<dl><dt>[PARENT]</dt>\n        <dd>Parent\'s First Name</dd>\n        <dt>[STUDENT]</dt>\n        <dd>Student\'s First Name</dd>\n        <dt>[LINK]</dt>\n        <dd>The link for the parent to access student\'s packet</dd>\n        <dt>[DEADLINE]</dt>\n        <dd>The deadline that the packet information must be all submitted</dd>\n    </dl>',1,'2021-07-15 15:45:27'),('ManualPacketReminderSubject','ManualPacketReminder','Packet Reminder Email Subject','Text','My Tech High Enrollment Packet - A Reminder','',1,'2021-04-29 07:24:40'),('ManualPacketReminderSubject','Packets','Packet Manual Reminder Email Subject','Text','My Tech High Enrollment Packet - A Manual Reminder [DEADLINE]','',1,'2021-06-29 15:22:30'),('missingLogContent','LearningLog','Missing Learning Log Email Content','HTML','<p>Hello!</p>\n\n<p>[STUDENT_FIRST]\'s Weekly Learning Log was not submitted this week. Please submit it today for partial points.</p>\n\n<p>Thanks!</p>\n\n<p>*This is just a test, please disregard if you receive this email* - MTH</p>\n','<dl><dt>[STUDENT_FIRST]</dt>\n        <dd>Student\'s first name</dd>\n    </dl>',1,'2021-07-30 16:27:39'),('missingLogNoticeEmailContent','Interventions','Missing Log Content','HTML','<p>Hello [PARENT_FIRST],</p>\n\n<p>This is a friendly reminder that all students in the My Tech High program need to submit a Learning Log every <em>week</em> AND maintain a Homeroom grade of at least 80%.</p>\n\n<p>We want to make you aware that [STUDENT_FIRST] is missing one or more Learning Logs or has a Log scored at 0%.Â </p>\n\n<p>You can check your student\'s progress anytime via Homeroom in your <a href=\"http://infocenter.mytechhigh.com\" target=\"_blank\">InfoCenter account</a>.</p>\n\n<p>We appreciate the efforts you and your student are making. Please let me know if you have any questions or need help with the Learning Logs.</p>\n\n<p>Thanks!<br />\nStephanie</p>\n\n<p>*This is just a test, please disregard if you receive this email* - MTH</p>\n','<p>[STUDENT_FIRST] - the student\'s  preferred first name<br />\n            [PARENT_FIRST] - the parent\'s  preferred first name&lt;\n            </p>',1,'2021-02-16 15:08:14'),('missingLogNoticeEmailSubject','Interventions','Missing Log Subject','Text','Reminder of Missing Learning Log','',1,'2021-01-08 15:53:47'),('missingLogSubject','LearningLog','Missing Learning Log Email Subject','Text','Notice of Missing Learning Log','',1,'2021-01-12 13:26:49'),('mth_schedule_cache_active','',NULL,'Text','1',NULL,0,'2015-12-30 19:03:20'),('mth_schedule_cache_active_1','',NULL,'Text','',NULL,0,'2016-06-27 16:52:10'),('mth_schedule_cache_active_2','',NULL,'Text','1',NULL,0,'2016-07-11 15:41:43'),('mustangreimbursement','advance','Enable Mustang Reimbursement Form','Bool','1','mth_reimbursement',1,'2021-07-20 09:38:44'),('newAccountEmailContent','User','New Account Email','HTML','<p>Thank you for submitting an application to the My Tech High program and confirming your email address.</p>\n\n<p>A parent account has now been created for you in InfoCenter. Your username is your email address; use this link to create your password:</p>\n\n<p>[LINK]</p>\n\n<p>In InfoCenter you can manage student information, applications, enrollments, schedules, and reimbursements.You can also read important announcements, view the program calendar, and check your student\'s progress.</p>\n\n<p><strong>Additional Notes:</strong></p>\n\n<ul><li>\n	<p>Be sure to add <a href=\"mailto:system@mytechhigh.com\">system@mytechhigh.com</a> and <a href=\"mailto:admin@mytechigh.com\">admin@mytechigh.com</a>Â to your email contacts so you won\'t miss important messages.</p>\n	</li>\n	<li>\n	<p>We typically send Letters of Acceptance based on date of application from mid-March through July.</p>\n	</li>\n	<li>\n	<p>You can always login to InfoCenter to check the status of your child\'s application.</p>\n	</li>\n</ul><p>Thank you - we look forward to being part of your family\'s educational journey!</p>\n\n<p>- My Tech High</p>\n\n<p>*This is just a test, please disregard if you receive this email* - MTH</p>\n','<p>When a new acount is created this email will be sent to the user so they can create their password. \n          You can include <b>[SITENAME]</b> in the content which will be replace with the site name. \n            You must include <b>[LINK]</b> or the user will not recieve the link to create a password.<br /><em>Note: This WYSIWYG editor may have abuilities that will not work in an email. \n            For email it\'s best to keep it simple.</em></p>',1,'2021-02-16 15:07:12'),('newAccountEmailSubject','User','New Account Email Subject','Text','Email confirmed! New Parent Account created','',1,'2021-01-12 13:00:39'),('oldreimbursement','advance','Enable Old Reimbursement Form','Bool','0','mth_reimbursement',1,'2021-08-24 11:57:58'),('packetAcceptedEmail','Packets','Packet Accepted Email Content','HTML','<p>Hi, [PARENT],</p>\n\n<p>[STUDENT]\'s complete packet has been received and approved. We are excited for [STUDENT] to participate in the 2021-22Â My Tech High program!Â </p>\n\n<p><strong>Next Steps:</strong></p>\n\n<ul><li>\n	<p><a href=\"https://infocenter.mytechhigh.com/\" target=\"_blank\">Login to InfoCenter</a> and click on the blue button labeled \"Parent Link\"</p>\n	</li>\n	<li>\n	<p>Review all the program details and demo videos, especially in the Scheduling and Reimbursement sections so you can submit [STUDENT]\'s personalized schedule for approval.</p>\n	</li>\n	<li>\n	<p>The Schedule Builder is found in <a href=\"https://infocenter.mytechhigh.com/\" target=\"_blank\">InfoCenter</a> and will be available from April 15 - July 31. Please submit [STUDENT]\'s schedule anytime during that window.</p>\n	</li>\n	<li>\n	<p>Join a live, online Q&amp;A Session with a Parent Support Specialist to get all your program questions answered! Check the current schedule at <a href=\"https://www.mytechhigh.com/livechat/\" target=\"_blank\">mytechhigh.com/livechat</a>.</p>\n	</li>\n</ul><p>As always, please contact us with questions at admin@mytechhigh.com.</p>\n\n<p>Have great day!</p>\n\n<p>- My Tech High</p>\n\n<p>*This is just a test, please disregard if you receive this email* - MTH</p>\n','<p>This is the email a parent recieves when the packet is accepted.\n          You can use the following codes in the email content and subject which will be replaced with actual values:</p>\n          <dl><dt>[PARENT]</dt>\n          <dd>Parent\'s first name</dd>\n          <dt>[STUDENT]</dt>\n          <dd>Student\'s first name</dd>\n          <dt>[YEAR]</dt>\n          <dd>The school year they applied for (e.g. 2014-15)</dd>\n          </dl>',1,'2021-07-15 15:45:27'),('packetAcceptedEmailSubject','Packets','Packet Accepted Email Subject','Text','Final Letter of Acceptance to the [YEAR] My Tech High program','',1,'2021-04-15 10:48:22'),('packetAgeIssueEmail','Packets','Packet Age Issue Email Content','HTML','<p>HiÂ [PARENT],</p>\n\n<p>[INSTRUCTIONS]</p>\n\n<p>Let us know if you have any questions by contacting Amy at admin@mytechhigh.com. We\'re happy to help however we can!</p>\n\n<p>My Tech High</p>\n','<p>This is the email a parent recieves if their packet is marked as age issue.\n          You can use the following codes in the email content which will be replaced with actual values:</p>\n          <dl><dt>[PARENT]</dt>\n          <dd>Parent\'s first name</dd>\n          <dt>[STUDENT]</dt>\n          <dd>Student\'s first name</dd>\n          <dt>[GRADE_LEVEL]</dt>\n          <dd>Student\'s grade level they are applying for</dd>\n          <dt>[YEAR]</dt>\n          <dd>The year they applied for (e.g. 2014-15)</dd>\n          <dt>[INSTRUCTIONS]</dt>\n          <dd>Where the specific instructions to the parent will be included in the email</dd>\n          </dl>',1,'2021-07-15 15:45:27'),('packetAgeIssueEmailSubject','Packets','Packet Age Issue Email Subject','Text','My Tech High Enrollment Packet - Age Issue','',1,'2021-07-12 18:52:47'),('packetAutoReminderEmail','Packets','Packet Auto Reminder Email Content','HTML','<p>Hi, [PARENT],</p>\n\n<p>Â  QA TEST [DEADLINE] -Â  [YEAR]Â </p>\n\n<p>This is a friendly reminder that [STUDENT]\'s Enrollment Packet is due byÂ <strong>[DEADLINE]</strong>. Login to your parent account atÂ <a href=\"http://mytechhigh.com/infocenter\" target=\"_blank\">mytechhigh.com/infocenter</a>Â to submit the packet.</p>\n\n<p><strong>NOTE:Â </strong>If your plans have changed and you are <em>not</em> planning to enroll [STUDENT] in our program, <em>please let us know ASAP</em> so we can offer the spot to another interested student.</p>\n\n<p>Please contact Amy at admin@mytechhigh.com if you have any questions. Thanks!</p>\n\n<p>- My Tech High</p>\n\n<p>*This is just a test, please disregard if you receive this email* - MTH</p>\n','<dl><dt>[PARENT]</dt>\n            <dd>Parent\'s first name</dd>\n            <dt>[STUDENT]</dt>\n            <dd>Student\'s first name</dd>\n            <dt>[YEAR]</dt>\n            <dd>The school year they applied for (e.g. 2014-15)</dd>\n            <dt>[DEADLINE]</dt>\n            <dd>The deadline that the packet information must be all submitted.</dd>\n          </dl>',1,'2021-07-15 15:45:27'),('packetAutoReminderEmailSubject','Packets','Packet Auto Reminder Email Subject','Text','Reminder:  Submit My Tech High Enrollment Packet','',1,'2021-04-15 10:48:22'),('packetAutoReminderEmailSubjectTwo','Packets','2nd Packet Auto Reminder Email Subject','Text','Action Required for My Tech High Enrollment [YEAR]','',1,'2021-04-15 10:48:22'),('packetAutoReminderEmailTwo','Packets','2nd Packet Auto Reminder Email Content','HTML','<p>Dear [PARENT],</p>\n\n<p>Just a reminder to complete the following for [STUDENT]\'s My Tech High enrollment by <strong>[DEADLINE]</strong>.</p>\n\n<ul><li>Review all program details and requirements posted at <a href=\"mytechhigh.com/utah\">mytechhigh.com/utah</a>.</li>\n	<li>Complete and submit an Enrollment Packet for [STUDENT] (available in your InfoCenter account at <a href=\"mytechhigh.com/infocenter\">mytechhigh.com/infocenter</a>).</li>\n</ul><p>If you have questions about our program, please join a live, online Q&amp;A session (see the schedule at <a href=\"mytechhigh.com/info\">mytechhigh.com/info</a>) or email Amy at admin@mytechhigh.com.</p>\n\n<p>We\'re excited to have [STUDENT] join our personalized education program!</p>\n\n<p>-My Tech High</p>\n\n<p>*This is just a test, please disregard if you receive this email* - MTH</p>\n','<dl><dt>[PARENT]</dt>\n            <dd>Parent\'s first name</dd>\n            <dt>[STUDENT]</dt>\n            <dd>Student\'s first name</dd>\n            <dt>[YEAR]</dt>\n            <dd>The school year they applied for (e.g. 2014-15)</dd>\n            <dt>[DEADLINE]</dt>\n            <dd>The deadline that the packet information must be all submitted.</dd>\n          </dl>',1,'2021-07-15 15:45:27'),('packetDeadline','Packets','Packet Deadline','Integer','14','<p>Number of days from application accepted before the packet is due.</p>',1,'2021-04-15 10:47:43'),('packetDeadlineReminder','Packets','Packet Deadline Reminder','Integer','7','<p>Number of days before a packet is due when a reminder is sent.</p>',1,'2021-04-15 10:47:43'),('packetDeadlineReminderTwo','Packets','2nd Packet Deadline Reminder','Integer','1','<p>Number of days before a packet is due when a reminder is sent.</p>',1,'2021-04-15 09:21:00'),('packetMissingInfoEmail','Packets','Packet Missing Info Email Content','HTML','<p>Hi, [PARENT],</p>\n\n<p>The Enrollment Packet we received for [STUDENT] is missing the following information:</p>\n\n<p>[FILES]</p>\n\n<p>[INSTRUCTIONS]</p>\n\n<p>Please use the link below to submit the required document(s) and/or information:<br />\n[LINK]</p>\n\n<p>Let us know if you have any questions by contacting Amy at admin@mytechhigh.com. We\'re happy to help however we can!</p>\n\n<p>My Tech High</p>\n\n<p>*This is just a test, please disregard if you receive this email* - MTH</p>\n','<p>This is the email a parent recieves if there is missing info in their packet.\n          You can use the following codes in the email content which will be replaces with actual values:</p>\n          <dl><dt>[PARENT]</dt>\n          <dd>Parent\'s first name</dd>\n          <dt>[STUDENT]</dt>\n          <dd>Student\'s first name</dd>\n          <dt>[LINK]</dt>\n          <dd>The link for the parent to access student\'s packet</dd>\n          <dt>[FILES]</dt>\n          <dd>List of files that need to be uploaded</dd>\n          <dt>[INSTRUCTIONS]</dt>\n          <dd>Where the spacific instructions to the parent will be included in the email</dd>\n          </dl>',1,'2021-07-15 15:45:27'),('packetMissingInfoEmailSubject','Packets','Packet Missing Info Email Subject','Text','My Tech High Enrollment Packet - Missing Info','',1,'2021-04-27 12:08:32'),('ParentLink','Yoda',NULL,'Text','https://www.mytechhigh.com/parentlink',NULL,0,'2020-07-08 18:53:07'),('parent_id','packet_settings','Parent ID','Bool','0','Allow Parent ID upload button to be enabled and require a new document (Only available for TN)',1,'2021-04-01 09:40:09'),('parent_id','re-enrollment_packet','Parent ID Information email content','Text','Please updated your Parent ID Documents','',1,'2021-02-23 13:31:44'),('personal_information','packet_settings','Personal Information','Bool','1','Will unlock tabs Contact, Personal, Education, Submission, but not require an update. Any new items to the enrollment packet that a parent hasnâ€™t checked off ie. a new agreement box, etc. will be required',1,'2021-08-24 11:49:03'),('personal_information','re-enrollment_packet','Personal Information email content','Text','Please review and update any personal information, such as your address or household details.','',1,'2021-03-03 20:03:03'),('person_ids-1297331','parent-link-enrollments',NULL,'Text','3344',NULL,0,'2015-02-27 18:04:35'),('person_ids-1566929','parent-link-enrollments',NULL,'Text','3344;2236;1939;4418;1262;1264;4374;3353;4416;1271;1275;5358;4676;1279;2442;2444;2450;3809;4430;2452;1281;1284;2459;4221;3773;3946;5158;1294;1297;4223;5027;1304;3393;4893;4053;1310;1314;4873;4758;4226;3432;3189;2474;3349;3944;4203;3818;2481;1324;3790;2489;3734;4515;4228;1331;4230;1336;1340;2499;4780;5331;3670;4084;3251;4710;1348;5349;4913;3135;4589;1350;1355;4233;5448;5018;3220;2512;3821;3109;4931;4787;2516;1358;4091;2520;1363;1366;1369;4238;1372;2526;4776;4240;4949;1376;4738;1378;3613;5438;1381;2536;4243;5378;1386;1388;1392;1396;1402;2541;3827;1408;1411;4028;1420;3798;2256;1423;1426;1429;2548;3742;4332;1431;1433;5398;1439;4881;4376;3203;1442;1445;5176;2567;1447;3521;1455;2572;4941;3610;4409;2577;4578;4840;1459;2584;1462;3800;3618;1468;1470;5343;1474;2593;1479;2596;2599;1484;4246;4715;1486;3985;1490;5406;3996;5335;4435;2606;2609;1492;1497;2614;2616;4463;1502;2626;4248;4179;3402;3363;1507;4251;1513;1516;3983;1518;1525;2631;2635;1527;3630;2641;1531;4328;3376;2646;1541;1543;1547;3300;2659;4567;1551;1554;5461;5107;1557;5326;2662;1561;2667;5075;1565;1568;1572;1575;1577;4965;1580;1583;3427;3306;1591;2673;1593;1596;1599;2677;4026;1603;3892;1607;3786;4644;4667;1613;3701;3270;1616;1621;1627;4256;2698;4098;4009;3623;1630;1638;4437;3922;1640;4586;1644;1651;3489;1657;4258;1661;1664;1670;5179;3935;2707;4744;1674;1678;1682;4850;1684;1687;4261;3291;1689;1691;1694;2711;1702;1705;4105;1707;1716;4867;1722;2713;1728;2721;1733;1735;5443;1740;2725;3156;5395;4829;5306;2733;1753;1756;2738;2360;5093;4264;1761;3912;4102;1766;1770;3657;5152;4266;1775;2752;1782;1787;2759;5558;3505;4425;1792;1794;1798;3952;1800;3848;5502;2773;1803;3533;2981;2137;2139;4978;1813;4801;1817;3417;1826;1830;2777;4269;1834;1836;2782;1841;1844;2784;4472;5015;2787;4080;3875;2792;4655;4783;4318;1851;2802;4274;4276;5422;2807;1856;3621;1860;2812;3646;1863;1866;3684;1869;2823;4115;4043;4279;1875;4281;4013;3674;4034;2825;5053;1882;1886;1892;1894;3446;2827;3228;1896;1899;1922;3722;1928;3260;1931;3265;3597;4427;3180;5393;1935;2850;3844;4884;1944;1947;2856;1955;4036;3755;1960;1964;4011;3448;3726;4614;2863;3495;4858;3764;2870;1970;2872;5346;2874;1974;1976;2879;2881;4284;4019;1979;2887;5162;4771;2890;1985;1989;4575;1991;2895;1994;3689;1996;2000;2004;2006;4183;5506;4717;2901;2013;3474;5212;4805;4498;4110;5085;3167;2021;3795;2023;2028;2030;4610;2032;3515;2036;2038;5058;2041;3550;5173;2044;2053;2920;3468;2057;3406;5455;3158;2065;2928;2069;5081;2073;2932;2075;3778;5468;3762;2938;2095;4724;5169;2097;5011;4778;2948;2099;2105;2959;4289;4291;3547;5451;2115;3933;4049;2128;4876;3319;2975;2131;2977;2133;2135;5031;5520;4395;3781;2144;2984;3527;4293;2147;4324;2994;4412;2152;2154;3574;3000;3123;3312;4199;4815;3004;3011;4296;4298;2157;2159;3871;3942;5067;3020;5415;4519;3023;2085;3766;3032;4300;3284;3896;3042;2171;3047;2173;3563;5101;2176;3254;4003;3569;5200;4302;3215;2436;2178;2183;2186;2189;3465;2192;2199;3050;3310;3719;2202;3694;2206;4124;3530;2211;2215;3864;2219;5441;2222;2224;3060;4064;2226;3141;2230;3067;5187;4945;2233;4306;3724;4017;4808;3070;3347;2239;2243;2246;2248;3125;2261;3083;3960;3979;2267;4006;2271;4597;2275;4704;5109;4984;3091;5369;5296;3940;2278;3906;3097;2281;2284;3100;2288;2290;2293;4309;2295;4905;2301;5184;5155;5497;5403;5555;5495;5479;1743;5585;5588;2804;1925;4890;5597;1384;5570;4871;5581;5648;5114;2936;5222;5562;5650;5663;4001;5678;5545;5195;5511;4510;5436;5160;4732;5566;5608;5634;5629;5620;2071;4160;5614;5643;5661;5698;5490;5673;4670;5691;5617;5665;5788;2195;4864;5646;5723;4734;5688;5338;5718;5702;5675;5770;5823;5838;5735;5704;5809;5766;5713;5622;5792;5758;5753;5877;5777;5842;5827;5755;5846;5885;5803;5745;5814;5775;3281;5799;5764;5536;5820;5864;5412;5553;5867;2092;5090;5930;5782;6019;5869;3926;5861;3240;5962;6009;6023;5967;5953;5910;5907;5980;1958;5915;5855;3601;4271;3968;6107;5716;6085;5959;5992;5965;6111;5880;6027;6097;5971;6094;6006;6045;6013;5896;6102;6002;3388;3687;6099;6170;6042;6029;6201;3740;6062;6105;6117;5888;3366;6040;6077;6245;6071;6213;6226;6051;3751;6262;6162;6282;5982;6082;5990;6259;6131;6224;6292;6120;6125;6129;6211;6060;5998;6168;6365;6143;6090;6149;6152;6295;6315;6331;6334;6371;6249;6345;6438;6122;6234;6203;6286;6339;6184;6191;6172;6272;6289;6253;6229;6401;6216;6181;6066;6300;6270;6445;6306;6255;6265;6562;6556;6278;6135;6313;6529;5933;6386;6326;6389;6309;6318;6433;6572;6396;6442;6367;6373;6501;6458;6466;6524;6404;6414;6484;6560;6421;6479;6482;6510;6505;6463;6499;6520;3408;6398;6140;6558;6567;6587;6585;6540;6534;6514;6488;5928;6553;6616;6637;1545;6634;5849;6490;6597;6049;6582;6741;6486;6475;6612;6627;6656;6705;6773;6736;6450;6671;6631;6647;5925;6682;6698;6805;6678;6650;6711;6604;6819;6733;6685;6902;6689;6746;6058;6621;6796;2060;6667;6721;6724;6800;5942;6602;6757;6619;6410;6703;6727;6838;6789;6807;3838;6381;6926;1807;6956;6919;6937;6877;6821;6752;7009;6852;7006;6968;6662;7033;6701;6961;6999;7087;7018;6985;7056;7059;7096;6867;6448;6907;7011;7047;7126;7081;6979;6944;7016;6909;7107;7064;6942;6922;7052;7026;6652;7100;6885;7174;7162;6954;7154;7028;6966;7091;6858',NULL,0,'2015-08-08 01:38:43'),('person_ids-1566929-4','parent-link-enrollments',NULL,'Text','1262;1264;1271;1275;1279;1281;1284;1294;1297;1304;1310;1314;1324;1331;1336;1340;1348;1350;1355;1358;1363;1366;1369;1372;1378;1381;1386;1388;1392;1396;1411;1420;1423;1426;1429;1431;1433;1439;1442;1445;1455;1459;1462;1470;1474;1479;1484;1486;1490;1497;1502;1507;1516;1518;1527;1531;1541;1543;1545;1551;1557;1561;1565;1568;1572;1575;1577;1580;1583;1591;1593;1596;1599;1603;1607;1613;1616;1621;1627;1630;1638;1640;1644;1661;1670;1674;1678;1684;1687;1689;1691;1694;1702;1705;1707;1716;1722;1728;1733;1735;1740;1753;1756;1761;1775;1782;1787;1792;1798;1800;1803;1807;1813;1817;1826;1830;1834;1836;1841;1844;1851;1856;1860;1863;1866;1869;1882;1886;1892;1894;1896;1899;1922;1925;1928;1931;1935;1939;1944;1947;1960;1964;1970;1974;1976;1979;1985;1989;1994;1996;2000;2004;2006;2013;2021;2023;2028;2030;2032;2036;2038;2041;2044;2053;2057;2060;2065;2069;2071;2073;2075;2085;2092;2095;2097;2099;2105;2115;2131;2133;2135;2137;2139;2144;2147;2154;2157;2171;2173;2176;2183;2186;2189;2192;2195;2199;2202;2206;2211;2215;2219;2222;2224;2226;2233;2236;2239;2246;2248;2256;2261;2267;2271;2275;2278;2288;2290;2295;2301;2360;2436;2442;2450;2452;2459;2474;2481;2489;2499;2516;2520;2536;2541;2548;2567;2572;2577;2584;2593;2596;2599;2606;2609;2614;2616;2626;2631;2635;2641;2646;2659;2662;2667;2673;2677;2698;2707;2711;2713;2721;2725;2733;2738;2752;2759;2773;2777;2782;2784;2787;2802;2804;2807;2812;2823;2825;2850;2856;2863;2870;2872;2874;2879;2881;2890;2895;2901;2920;2928;2932;2936;2938;2948;2959;2975;2977;2981;2984;2994;3000;3004;3011;3020;3032;3042;3047;3050;3060;3070;3083;3097;3100;3109;3123;3125;3135;3141;3156;3158;3167;3180;3189;3203;3215;3220;3228;3240;3254;3260;3265;3270;3281;3291;3306;3310;3312;3344;3347;3349;3353;3363;3366;3376;3388;3402;3408;3417;3427;3432;3446;3448;3465;3474;3495;3505;3515;3530;3533;3563;3569;3574;3597;3601;3610;3613;3618;3621;3623;3630;3646;3657;3670;3674;3684;3687;3689;3701;3719;3722;3724;3726;3740;3751;3762;3766;3773;3778;3781;3786;3790;3798;3800;3821;3838;3844;3848;3864;3871;3875;3906;3912;3922;3926;3933;3935;3942;3944;3946;3952;3960;3968;3979;3985;3996;4001;4003;4006;4009;4011;4013;4017;4019;4026;4028;4034;4043;4049;4053;4080;4084;4091;4098;4102;4105;4110;4115;4124;4160;4179;4183;4199;4203;4221;4223;4226;4233;4238;4240;4243;4246;4248;4251;4256;4258;4261;4264;4266;4269;4271;4274;4276;4279;4281;4284;4289;4291;4293;4296;4298;4302;4306;4309;4318;4324;4328;4332;4374;4376;4395;4409;4412;4416;4418;4430;4435;4437;4463;4515;4586;4597;4614;4644;4655;4667;4670;4676;4704;4710;4715;4717;4732;4734;4738;4758;4778;4783;4787;4801;4808;4815;4829;4840;4858;4864;4871;4873;4876;4881;4884;4890;4893;4905;4913;4931;4941;4945;4949;4965;4978;4984;5011;5015;5018;5027;5031;5053;5067;5075;5081;5093;5107;5109;5114;5152;5158;5162;5169;5173;5176;5179;5184;5187;5200;5212;5222;5306;5326;5335;5338;5343;5346;5369;5378;5393;5395;5398;5403;5406;5415;5436;5438;5441;5443;5448;5451;5455;5461;5468;5479;5495;5497;5506;5511;5536;5545;5553;5555;5558;5562;5566;5570;5585;5588;5608;5614;5617;5620;5622;5634;5646;5648;5650;5663;5665;5673;5678;5691;5698;5702;5704;5713;5716;5718;5723;5735;5745;5753;5758;5764;5766;5770;5775;5777;5782;5792;5799;5803;5809;5814;5820;5823;5827;5838;5842;5849;5855;5861;5864;5867;5869;5877;5880;5885;5888;5907;5910;5915;5925;5928;5930;5933;5942;5953;5959;5962;5965;5967;5971;5980;5982;5990;5992;5998;6002;6006;6009;6013;6019;6023;6027;6029;6040;6042;6045;6049;6051;6058;6060;6062;6066;6071;6077;6082;6085;6090;6094;6099;6102;6107;6111;6117;6122;6125;6129;6131;6135;6140;6143;6149;6152;6162;6168;6170;6172;6181;6184;6191;6201;6203;6211;6213;6216;6224;6226;6229;6234;6245;6249;6255;6259;6262;6265;6270;6272;6278;6282;6286;6289;6295;6300;6306;6309;6313;6315;6318;6326;6331;6334;6339;6345;6367;6371;6373;6381;6386;6389;6396;6401;6404;6410;6414;6421;6433;6438;6445;6448;6450;6458;6463;6466;6475;6479;6482;6484;6486;6488;6499;6501;6505;6514;6520;6524;6529;6534;6540;6553;6556;6558;6560;6562;6567;6572;6582;6585;6587;6597;6602;6604;6612;6616;6619;6627;6631;6634;6637;6647;6650;6652;6656;6662;6667;6671;6678;6682;6685;6689;6701;6703;6705;6711;6721;6724;6727;6733;6736;6741;6746;6752;6757;6773;6789;6796;6800;6805;6807;6819;6821;6838;6852;6867;6877;6885;6902;6907;6909;6919;6922;6937;6942;6944;6954;6956;6961;6966;6968;6979;6999;7006;7011;7016;7018;7026;7028;7033;7047;7056;7059;7064;7081;7087;7091;7096;7100;7107;7126;7154;7162;7174;7217;7270;7274;7317;7200;7180;7213;7308;7225;7294;7286;7367;2444;7413;7421;7440;7427;7507',NULL,0,'2015-09-30 10:06:17'),('person_ids-1823426-5','parent-link-enrollments',NULL,'Text','3344;8377;1262;1264;4374;3353;8277;1271;1275;6117;4676;2442;6721;7126;7100;2450;4430;7174;2452;1284;2459;4221;6272;7087;5663;3773;3946;6529;6616;3751;6203;1297;4223;5027;6682;1304;7011;6345;6885;5809;6597;4893;4053;1310;5570;7028;1314;4873;6567;4758;6107;4226;8143;3432;7571;5716;8162;3189;2474;3349;6582;3740;4864;6587;3944;4203;2481;5782;1324;2489;8436;6295;5990;4515;4228;1331;5933;1336;1340;6637;7565;2499;5842;3670;8384;8459;4084;7369;6386;4710;1348;4913;7948;3135;1350;1355;4233;5448;5018;7107;7494;5827;6085;5497;6019;7647;3821;4931;6619;4787;2516;8189;4091;2520;1366;1369;4871;7943;5864;6585;4238;8159;1372;4240;6705;4949;6326;7809;4738;5566;5998;1378;7356;3613;5438;1381;2536;4243;5378;7598;1386;1388;1396;6262;8228;8200;2541;5646;4028;8593;1420;2256;1423;6852;6540;1426;1429;2548;4332;8489;1433;5766;1439;4881;4376;5698;7696;3203;8624;1442;1445;5176;8048;5555;2567;7897;6102;8026;2572;5735;7270;4941;3610;4409;4840;7632;1459;2584;3800;6090;6656;6685;3926;7517;3618;7778;1470;6289;1474;6937;2593;7192;1479;6152;5495;2596;6306;2599;5861;8075;1484;4715;1486;3985;6534;1490;8613;5406;3996;5335;4435;3240;2606;7839;2609;1497;2616;4463;1502;2626;4179;3402;3363;6168;5479;1507;4251;7413;1516;1518;6968;3366;7997;2631;2635;6966;7912;6259;2641;1531;4328;5959;8011;7727;3376;6604;2646;1541;1543;6099;7264;6736;1545;7367;5992;5962;6170;7186;7064;2659;1551;5461;6077;5107;6404;1557;5326;2662;1561;2667;5075;8215;1565;1568;1572;1575;1577;4965;1580;1583;7705;3427;3306;1591;6309;2673;1593;1596;1599;2677;4026;1603;6318;7693;1607;3786;4644;6450;4667;1613;8366;3701;3270;1616;1621;7842;1625;6724;1627;4256;4024;2698;4098;4009;6711;3623;1630;6315;7402;1638;4437;7091;3922;1640;6009;4586;3687;3388;1644;6162;4258;1661;1670;6023;7149;5608;3935;2707;6505;1674;1678;7081;8569;7690;4001;7950;7490;8079;1684;7018;1687;8015;6401;6671;4261;5634;6265;3291;1689;1691;7229;1694;2711;6741;1702;1705;4105;1707;1716;5885;6071;6800;6631;1722;5673;7861;2713;1728;2721;1733;1735;5443;6410;1740;2725;7844;3156;5395;8208;4829;5953;5436;6049;6562;2733;6184;7231;1753;1756;6381;6433;2360;5093;4264;1761;3912;6463;4102;6066;3657;5152;4266;7427;6300;7502;1775;7056;2752;7154;8442;6572;7511;6042;7603;1782;1787;2759;5558;6396;3505;5622;1792;6270;6499;1798;3952;8415;6131;7574;1800;6213;3848;2773;1803;6216;1807;3533;1813;7059;4801;1817;3417;6249;1826;1830;2777;4269;7562;1834;1836;2782;1841;1844;8257;7592;5585;8081;5015;4080;8244;3875;7902;6051;6458;6773;4271;4655;7162;8124;4318;5588;1851;7585;2802;2804;6678;4274;4276;5803;2807;1856;3621;1860;2812;3646;1863;6488;1866;8390;3684;1869;7645;5910;7945;2823;4043;5907;5792;4279;4281;5745;4034;7619;5553;6662;2825;5053;6282;1882;1886;5982;7711;1894;3228;1896;7487;1899;5650;7213;3601;8345;1922;3722;4418;5928;6111;1928;5678;5545;5880;3260;1931;5980;3265;3597;8576;3180;5393;1935;2850;3844;1939;4884;7766;1944;1947;6703;1431;5758;7829;7522;1960;1964;5867;6201;4011;8465;6125;5814;8224;3448;3726;6143;4614;5930;3495;8157;4858;7033;2870;1970;2872;5346;6942;2874;6181;7332;6135;1974;8194;1976;2879;6752;2881;6796;4284;8420;4019;1979;6466;7596;8092;6371;5691;7616;5620;5162;6027;6819;2890;6727;5753;4890;7989;1985;7560;7096;1989;2895;5925;1994;3689;8084;2000;2004;2006;7590;4183;7967;5506;7308;6438;8288;2901;2013;4734;3474;5212;6520;6956;4110;6650;3167;6919;3838;2023;2028;6733;2032;8597;8180;2036;7180;2041;6229;5173;2044;2053;2920;3281;7952;8051;6922;2057;2060;7732;3158;2065;2069;5081;2071;5799;2932;3778;3117;7681;7217;7178;5665;5338;5468;2088;8312;7679;2938;2092;8138;7190;5169;7980;2097;5011;4778;2948;6140;2099;6226;6652;7016;2105;2959;4289;7515;7322;4291;6553;5451;6122;2115;7814;6211;3933;5718;8270;7376;4876;7047;2975;5702;2131;2977;2133;2135;5031;6367;5764;2981;2137;7440;6060;4395;3781;6339;2144;5915;8178;2984;7476;6373;6558;4293;2147;6634;8115;5562;4324;7978;4412;7664;6313;2154;3574;3000;3123;6045;3312;4199;4815;7976;8324;6954;3004;3011;4296;4298;2157;7687;3871;6486;7274;7995;5067;3020;5415;7349;7461;7914;2085;3766;6944;6867;3032;6999;8031;2171;3047;2173;3563;2176;5536;3254;4003;3569;7581;5200;4302;5614;5849;3215;2436;6172;6701;8630;2183;5222;2186;2189;3465;2192;2195;2199;3050;5114;3719;2202;7469;5971;5877;2206;8427;7986;6448;5511;7878;2211;2215;7850;3864;2219;5441;2222;6602;2224;3060;6689;2226;3141;6082;6475;5777;6961;5187;4945;2233;4306;6524;3724;4808;3070;6094;3347;2236;6224;5770;5823;2239;2246;2248;6667;8009;7398;6821;3479;6002;2261;7963;3960;2267;4006;2271;4597;7437;8348;2275;6560;4704;7804;5109;4984;6445;5369;7629;7928;2278;7531;3906;3097;7558;5855;2288;2290;4309;2295;4905;8406;2301;8541;8505;8450;3104;8668;8550;8681;8686;8480;8523;8512;8493;8565;8553;8529;8500;8351;8665;8518;8473;8535;8231;8717;8618;8732;7120;8210;1462;2243;7707;7900;8651;8706;8722;8725;8739;8763;8766;8768;8771;8773;8780;8831;8838;8844;8857;8864;8890;8814;8822;8811;8787;8790;8484;7113;8825;8744;8818;8755;8848;8640;7289;8923;8507;8968;8616;8710;8894;8783;7249;8966;8929;8869;8926;8917;8976;8952;8987;3983;6040;8984;8834;8959;7577;1991;8913;8903;7242;8991;8882;7637;7093;8945;8604;8645;9054;8962;8165;8996;8496;8801;8915;8089;8897;7932;1955;7313;7787;8980;8486;8315;7935;9374;9036;9019;8019;8035;8994;9007;8693;7294;9049;7607;7737;8113;9057;8862;9032;8720;4304;7467;9065;8382;9014;8412;8836;9024;6757;8191;9001;6234;4287;8947;7884;9468;9158;9173;9426;9089;8070;9091;9203;9499;2444;8281;9355;9156;9181;9397;9600;9210;9474;9580;9546;9564;8907;5965;2994;3393;4013;4732;5158;5967;6013;6062;6129;6414;6979;7286;7972;9121;9246;9280;9296;9306;9312;9326;9349;9392;9463;9476;9506;9513;9521;9558;9591;9629;9289;9106;9300;9608;3109;9453;9431;9323;9345;9672;9517;9357;9368;9595;9637;9384;9444;9164;9572;9330;9370;9362;9217;9553;9275;9188;9614;9478;9493;9248;9271;9400;9128;9680;3606;9482;9139;9645;9117;9152;9147;9656;9108;9570;9074;9094;9214;3379;3100;9256;9442;9237;9525;9496;9603;9144;9446;9616;3547;9748;9889;9587;9760;3577;8939;9896;9719;9466;9619;8582;9298;9907;9667;9819;9449;9626;9470;9787;2159;9723;9731;9913;9961;9736;9439;9830;9705;9832;9951;9698;9882;9789;9899;9729;9923;9585;9726;8470;9941;9801;9685;9878;9778;9534;9796;9677;9989;9304;9242;10005;9934;9660;9132;9926;9959;8937;9931;2152;9944;9964;9768;10028;9782;8989;9994;9975;9866;9318;9575;9824;9504;9946;9794;10019;9841;9905;10092;9714;10125;9869;10055;9176;9808;10115;10111;10044;4230;10072;10051;10171;10173;10136;9198;10145;9421;10118;9844;10033;9855;10192;10179;10130;10113;10199;10153;10187;9746;9642;10133;10147;10183;10205;10177;10251;3818;9254;9135;10286;10007;10270;10315;10258;10330;10339;10239;9717;9376;10218;9849;9837;9186;10227;10221;10350;10290;10279;10321;10274;10364;7669;10097;9688;9335;10348;10358;9953;10393;10383;10389;10375;10370;10346;10381;10378;1779;10336;10076;10399;10001;10432;10402;3662;10406;10332;10439;10395;10474;10262;10417;10443;10464;10457;10453;10488;10478;10481;10471;10476;10492;10462;10122;10494;10497;10516;10507;10499;10522;10511;3310;10531;10524;10553;10233;10547;10556;10514;10560;10254;3338;10575;10579;10593;10617;10621;10608;10568;10611;10595;10605;10633;10577;10599;10528;10589;10637;10654;10658;10629;10652;10665;10680;10661;10689;10663;10693;10719;10706;10727;10709;10756;10761;10774',NULL,0,'2016-09-20 13:56:53'),('person_ids-2115030-6','parent-link-enrollments',NULL,'Text','3344;12729;1262;1264;1275;1284;1297;1304;1310;1314;1324;1331;1336;1340;1348;1350;1366;1369;1372;1378;1381;1386;1388;1396;1420;1426;1429;1431;1433;1439;1442;1462;1470;1474;1479;1490;1497;1502;1507;1516;1518;1531;1541;1543;1551;1557;1561;1572;1575;1577;1580;1591;1593;1596;1599;1603;1613;1616;1621;1625;1627;1630;1640;1644;1661;1670;1674;1678;1684;1689;1702;1705;1716;1722;1728;1735;1740;1753;1756;1761;1779;1782;1787;1792;1798;1800;1803;1807;1813;1817;1826;1830;1834;1836;1841;1844;1851;1860;1863;1866;1869;1882;1886;1894;1896;1899;1928;1931;1935;1939;1944;1947;1955;1960;1964;1970;1974;1976;1985;1989;1994;2004;2006;2013;2023;2028;2032;2036;2041;2044;2053;2057;2065;2071;2088;2097;2099;2105;2115;2131;2133;2135;2137;2144;2147;2152;2154;2173;2183;2189;2192;2195;2199;2202;2206;2211;2215;2219;2222;2226;2233;2236;2246;2248;2256;2261;2271;2275;2288;2290;2295;2301;2360;2436;2459;2474;2481;2489;2516;2520;2536;2541;2548;2567;2593;2596;2609;2616;2635;2641;2646;2659;2662;2673;2707;2711;2713;2721;2725;2752;2759;2773;2777;2782;2807;2812;2825;2850;2870;2872;2879;2881;2895;2920;2932;2938;2948;2959;2975;2977;3000;3004;3011;3020;3032;3050;3060;3070;3097;3104;3117;3123;3141;3158;3167;3180;3189;3203;3215;3228;3240;3260;3265;3270;3281;3291;3310;3338;3363;3366;3379;3388;3393;3417;3427;3448;3474;3495;3505;3533;3563;3569;3574;3577;3597;3601;3606;3610;3618;3623;3646;3670;3684;3689;3701;3719;3722;3724;3726;3751;3773;3821;3838;3844;3848;3864;3871;3912;3922;3933;3935;3944;3946;3960;3985;3996;4001;4003;4006;4009;4024;4026;4028;4034;4043;4053;4080;4091;4098;4105;4110;4179;4183;4199;4203;4221;4223;4226;4228;4230;4233;4238;4240;4251;4258;4261;4264;4269;4274;4276;4279;4284;4289;4291;4293;4302;4304;4306;4309;4324;4328;4332;4374;4395;4409;4412;4418;4430;4435;4437;4463;4515;4614;4655;4667;4676;4704;4710;4715;4734;4738;4801;4808;4815;4829;4840;4858;4864;4871;4873;4876;4884;4890;4905;4931;4945;4949;4965;5011;5018;5027;5031;5053;5067;5075;5081;5093;5109;5114;5169;5173;5176;5187;5200;5212;5222;5326;5335;5338;5346;5369;5378;5393;5395;5406;5436;5441;5443;5448;5451;5461;5468;5479;5495;5497;5506;5553;5555;5562;5566;5570;5588;5614;5620;5622;5634;5646;5663;5673;5678;5691;5698;5702;5745;5758;5792;5799;5803;5809;5823;5842;5849;5855;5861;5864;5867;5877;5880;5907;5910;5915;5928;5930;5933;5953;5959;5962;5965;5980;5982;5990;5992;5998;6002;6009;6019;6023;6027;6042;6045;6049;6066;6077;6082;6085;6090;6094;6102;6107;6111;6117;6122;6125;6131;6135;6140;6143;6152;6162;6168;6170;6172;6181;6184;6203;6216;6224;6226;6229;6234;6249;6259;6262;6265;6270;6272;6289;6295;6300;6306;6309;6313;6318;6326;6339;6345;6367;6381;6404;6410;6433;6438;6445;6448;6458;6463;6466;6475;6486;6499;6505;6520;6524;6540;6558;6562;6567;6572;6582;6585;6587;6604;6619;6631;6634;6637;6650;6652;6656;6667;6671;6678;6682;6685;6705;6711;6724;6727;6733;6736;6741;6773;6800;6819;6852;6867;6885;6919;6937;6944;6956;6961;6966;6968;6999;7011;7016;7018;7028;7047;7056;7059;7064;7081;7087;7093;7100;7107;7120;7126;7149;7154;7180;7190;7192;7217;7229;7231;7242;7264;7270;7274;7289;7294;7308;7313;7322;7332;7349;7356;7367;7369;7376;7398;7427;7461;7476;7487;7490;7502;7511;7515;7517;7522;7531;7560;7562;7565;7571;7574;7577;7581;7585;7590;7592;7596;7598;7603;7607;7616;7619;7629;7637;7645;7647;7669;7679;7687;7693;7696;7707;7727;7732;7737;7766;7787;7804;7809;7814;7842;7844;7850;7861;7884;7900;7912;7914;7928;7932;7935;7945;7950;7967;7972;7980;7986;7989;7995;7997;8009;8011;8019;8026;8035;8048;8051;8075;8081;8084;8113;8115;8138;8157;8162;8165;8180;8189;8194;8200;8208;8210;8215;8228;8257;8270;8277;8281;8288;8312;8315;8324;8345;8382;8415;8420;8427;8436;8450;8459;8470;8473;8480;8484;8486;8489;8496;8500;8505;8507;8523;8529;8541;8550;8553;8565;8569;8576;8593;8597;8604;8613;8616;8618;8624;8645;8668;8681;8686;8693;8706;8710;8739;8744;8755;8763;8766;8768;8771;8780;8783;8790;8811;8818;8822;8825;8831;8836;8844;8862;8864;8869;8882;8890;8894;8897;8913;8917;8923;8926;8929;8939;8952;8959;8968;8984;8987;9001;9007;9014;9019;9024;9032;9036;9054;9057;9074;9089;9091;9094;9106;9108;9117;9121;9128;9139;9144;9147;9158;9164;9173;9176;9188;9198;9210;9246;9248;9256;9271;9275;9280;9289;9296;9300;9318;9323;9335;9345;9349;9357;9362;9374;9376;9384;9392;9397;9421;9426;9442;9444;9449;9453;9463;9466;9470;9476;9478;9496;9504;9506;9517;9521;9534;9546;9558;9564;9570;9572;9575;9580;9587;9591;9595;9600;9603;9608;9616;9619;9626;9629;9642;9645;9656;9660;9667;9672;9677;9680;9688;9698;9705;9719;9731;9736;9760;9768;9778;9787;9794;9819;9824;9832;9837;9844;9849;9866;9869;9889;9899;9907;9931;9934;9946;9951;9953;9959;9975;9989;9994;10001;10044;10051;10072;10097;10111;10113;10115;10118;10122;10125;10147;10153;10173;10177;10183;10192;10199;10205;10218;10221;10227;10233;10251;10254;10258;10274;10279;10315;10321;10330;10332;10339;10346;10358;10370;10383;10393;10395;10399;10432;10439;10453;10471;10474;10478;10481;10488;10492;10499;10516;10522;10531;10547;10553;10556;10560;10575;10589;10593;10595;10599;10608;10611;10629;10633;10637;10652;10654;10658;10663;10665;10680;10689;10693;10706;10719;10756;10761;10774;10888;10874;10932;10948;10900;10868;10892;10898;11065;10768;10687;10729;11105;10794;11072;10855;11086;10826;10828;10924;11140;10973;11848;11054;11050;10821;11012;11039;10621;10859;10954;10053;10985;10864;10995;9991;11089;11289;11238;11269;11299;11200;11321;11302;10966;10942;10697;10991;10968;11723;11255;11404;11230;11179;11124;5152;2784;6647;1925;11422;11211;10661;11155;11389;10764;11383;11450;10753;11331;11328;11338;11360;11402;4266;11447;11393;9841;11385;11335;11615;11362;11420;11610;11579;1321;11455;9306;11529;10224;11398;1568;7096;9811;11526;3080;11604;11512;11824;11695;11797;11127;11191;11425;11754;11810;11999;12034;12005;11165;11664;10790;11553;11480;11538;11518;11738;11816;11652;11743;11790;11733;12001;11592;11835;2444;10711;11839;10853;6534;11918;11936;11820;12240;6488;11549;11930;11880;12018;11893;12024;10862;11602;11521;12260;11768;10264;12236;12064;12070;12202;12187;12220;12168;12249;12421;11078;12391;12433;12473;12321;11588;12326;12295;5723;12094;12146;1651;12375;12139;12488;12040;12405;12281;12636;12387;12079;12156;12010;12524;12516;6282;11599;12128;4019;12508;12160;12108;12546;12217;12088;12412;12505;12491;12136;12318;12426;12300;12385;12307;12303;11911;12312;12114;11252;11802;12541;3566;11762;12372;10150;12736;12527;10997;12464;12588;1344;12641;12660;12695;12511;12521;12496;12582;12755;12712;12441;12460;12561;12569;12612;12715;12762;12778;12604;6922;12607;12571;11908;12594;12669;11586;12683;11686;12822;12801;12751;12648;12805;12038;12798;11985;12931;12814;12551;12868;12855;11884;12785;12832;11507;12842;12857;12117;1453;10839;12539;12244;12232;12878;9540;12471;12458;8390;12759;12885;12745;12792;12874;12596;12914;12895;12534;12942;12848;12733;11904;12710;12853;11964;12354;13145;13001;12954;13160;12399;11371;12970;13031;11395;12846;2874;11247;12600;13066;12563;12819;12988;11490;13026;12182;9654;12247;11136;13042;11375;12222;11326;10583;12795;13035;11220;13137;11187;12453;13148;12864;12872;6484;11410;12444;11947;11927;11177;12559;11833;12918;13166;11898;9412;12749;13049;12960;11222;13075;8493;12687;13079;13029;12975;11562;13158;13046;13143;13140;3489;12899;13039;13114;11263;13177;12268;1979;13128;12889;11216;13106;11474;12851;10301;13198;13181;13244;13195;13319;13185;13209;13367;12809;13377;13241;13253;13188;13239;13227;13223;13271;13295;13335;3766;13300;13268;8966;13083;13265;13283;12904;13394;12439;13342;13207;11132;12332;13276;13309;13263;9446;13037;12286;13255;13289;4287;12083;13315;12191;11354;12679;12368;13406;13134;13298;12184;13466;13450;13415;13387;13369;11961;13359;2159;13304;12628;13480;13431;13420;13507;13497;12099;13362;13471;13348;10816;13582;12719;12262;9789;13353;13548;12366;12179;13373;13216;13183;13330;12419;12361;13440;12829;13287;11557;9011;13469;2243;11728;13524;12957;13460;13483;12880;3465;12273;13398;13101;12451;12479;13400;13448;13383;13642;13669;13488;13620;13464;13380;13677;13644;3650;13773;13695;13519;13428;13699;13560;13556;13575;13622;13511;13673;13586;13544;13652;13569;12121;13606;13650;13533;13566;13811;13563;11551;13609;3926;13588;12995;11114;13404;12150;13646;13662;13685;13595;10005;13473;13711;13638;13722;13626;13529;13793;13190;13979;13475;13797;13834;13760;13843;13873;3989;13778;13876;13052;13418;13705;13691;10348;6315;13457;13708;13758;13815;13820;13864;13981;14012;14066;13933;14024;13888;13965;13808;3479;14068;13629;13801;13989;13962;14007;14048;13956;13736;13860;1402;13741;13852;13879;13894;13924;13976;14096;14159;14142;13890;13836;3385;14165;11063;13902;13747;14028;13855;13992;14184;14108;14003;13997;13453;3630;2038;13616;13813;13640;12825;13994;14079;14074;13657;13944;13953;13871;14174;13942;13911;14055;14167;14224;13987;1958;13946;14187;14127;14088;13687;13612;14203;13426;13984;14360;7402;14217;14341;3781;9304;14299;14287;14116;14151;13928;14416;13913;14170;14427;14351;14297;14140;14124;13826;14228;14266;14370;13715;14455;14262;14086;14381;14122;14042;14200;14389;14333;14486;3790;14355;14443;14408;14120;14135;14198;14309;14314;13857;14189;14432;14460;14214;14568;14112;14717;14740;14565;14649;14511;14723;14596;14751;14522;14712;14760;14528;14476;14609;14642;14636;14748;14660;14472;14558;14651;14639;14541;14700;14531;14546;14535;14690;14663;14563;14586;14668;15494',NULL,0,'2018-01-22 21:14:28'),('probationNoticeEmailContent','Interventions','Probation Content','HTML','<p>Hello [PARENT_FIRST],</p>\n\n<p>Our records indicate that [STUDENT_FIRST] is on probation from last year for not meeting the Learning Log requirements and is currently below 80% and/or is missing one or more Learning Logs. (To check student progress, login here to InfoCenter and click on the Homeroom button.)</p>\n\n<p>Action Required by [DUE_DATE] to avoid being withdrawn:</p>\n\n<ul><li>Help [STUDENT_FIRST] submit ALL missing Weekly Learning Logs and/or resubmit Learning Logs for additional points.</li>\n</ul><p>OR</p>\n\n<ul><li>Initiate the Withdrawal process by contacting Amy at admin@mytechhigh.com. The details of the Withdrawal Policy are included here. Note that there may be fees associated with the Withdrawal.</li>\n</ul><p>Please let me know if you have any questions or need help with the Learning Logs.</p>\n\n<p>Thanks!,<br />\nStephanie</p>\n\n<p>*This is just a test, please disregard if you receive this email* - MTH</p>\n','<p>[STUDENT_FIRST] - the student\'s  preferred first name<br />\n            [PARENT_FIRST] - the parent\'s  preferred first name<br />\n            [DUE_DATE] - the day when email falls due(3 days)\n            </p>',1,'2021-02-16 15:08:14'),('probationNoticeEmailSubject','Interventions','Probation Subject','Text','Withdrawal Notice - [DUE_DATE]','',1,'2021-01-08 15:53:48'),('proof_of_residency','packet_settings','Proof of Residency','Bool','1','Allow proof of residency upload button to be enabled and require a new document',1,'2021-06-23 16:59:19'),('proof_of_residency','re-enrollment_packet','Residency Information email content','Text','Please upload a Proof of Residency issued in the past 60 days.','',1,'2021-03-03 20:04:19'),('reEnrollEmailContent','Re-enroll','Intent to Re-enroll notification email content','HTML','<p>Hi, [PARENT],</p>\n\n<p>It\'s already time to start planning for the [SCHOOL_YEAR] school year!</p>\n\n<p>You are part of an exceptionalÂ group of My Tech High students and parents and we hope you choose to participate again with us next year. Hundreds of new students have already applied for our [SCHOOL_YEAR] program, so we need to know if you plan to stay enrolled with My Tech High next year or if you plan to pursue a different educational path.</p>\n\n<p><strong>Action Required for all students by [DEADLINE]:</strong></p>\n\n<ul><li>Login to InfoCenter at <a href=\"https://infocenter.mytechhigh.com\" target=\"_blank\">https://infocenter.mytechhigh.com</a> and declare each child\'s Intent to Re-enroll for [SCHOOL_YEAR].</li>\n</ul><p>Returning students will be notified when the [SCHOOL_YEAR] scheduling process begins. A withdrawal letter will be sent in May to students who are not returning.</p>\n\n<p>Please contact Amy at <a href=\"mailto:admin@mytechhigh.com\">admin@mytechhigh.com</a> or join a <a href=\"https://www.mytechhigh.com/livechat/\" target=\"_blank\">live Q&amp;A session</a> if you have any questions.</p>\n\n<p>Thanks!</p>\n\n<p>- My Tech High</p>\n\n<p>*This is just a test, please disregard if you receive this email* - MTH</p>\n','<dl><dt>[PARENT]</dt>\n            <dd>Parent\'s first name</dd>\n            <dt>[SCHOOL_YEAR]</dt>\n            <dd>The school year of the to be enrolled in (2014-15)</dd>\n            <dt>[DEADLINE]</dt>\n            <dd>Intent to Re-enroll submission deadline (February 15)</dd>\n          </dl>',1,'2021-02-16 15:06:07'),('reEnrollEmailSubject','Re-enroll','Intent to Re-enroll notification email Subject','Text','Action Required: Declare Intent to Re-enroll for the [SCHOOL_YEAR] My Tech High program','Same merge fields as email content',1,'2020-07-08 18:53:06'),('reEnrollGraduationsProcessed','Re-enroll',NULL,'Integer','10',NULL,0,'2021-02-25 05:00:08'),('ReEnrollmentPacketAcceptanceContent','Re-enrollment','Re-enrollment Packet Acceptance email content','HTML','<p>Hi [PARENT],</p>\n\n<p>Thank you for submitting record of or a current exemption form for [STUDENT]â€™s 7th grade immunizations. We are excited for [STUDENT] to participate in the 2021-22 My Tech High Program!</p>\n\n<p>Thanks!</p>\n\n<p>- My Tech High</p>\n\n<p>MTH TEST - Sample template only!</p>\n','<dl><dt>[PARENT]</dt>\n        <dd>Parent\'s First Name</dd>\n        <dt>[STUDENT_NAME]</dt>\n        <dd>Student\'s First Name</dd>\n    </dl>',1,'2021-03-12 09:49:21'),('ReEnrollmentPacketAcceptanceSubject','Re-enrollment','Re-enrollment Packet Acceptance email Subject','Text','TEST MTH - Re-enrollment Acceptance Letter(Record of 7th grade immunizations received)','',1,'2021-03-12 09:49:21'),('ReEnrollmentPacketContent','Re-enrollment','Re-enrollment Information email content','HTML','<p><strong>This is a test!</strong></p>\n\n<p>Hi [PARENT],</p>\n\n<p>We are thrilled that you have chosen to participate in the My Tech High program again next year! Please submit [STUDENT_NAME]â€™s packet with the updated information below.</p>\n\n<p>[PACKET_INFORMATIONS]</p>\n\n<p>Use the link below to submit the required document(s) and/or information:</p>\n\n<p>[LINK]</p>\n\n<p>Please contact us at colorado@mytechhigh.com or join a<a href=\"https://co.mytechhigh.com/parent-information-sessions/\" target=\"_blank\"> live Q&amp;A session</a> if you have any questions.</p>\n\n<p>Thanks!</p>\n\n<p>My Tech High</p>\n','<dl><dt>[PARENT]</dt>\n        <dd>Parent\'s First Name</dd>\n        <dt>[STUDENT_NAME]</dt>\n        <dd>Student\'s First Name</dd>\n        <dt>[PACKET_INFORMATIONS]</dt>\n        <dd>List of avaliable documents that needs to be updated</dd>\n        <dt>[LINK]</dt>\n        <dd>The link for the parent to access student\'s packet</dd>\n      </dl>',1,'2021-03-12 09:49:21'),('ReEnrollmentPacketSubject','Re-enrollment','Re-enrollment Information email Subject','Text','TEST MTH - Action Required:  Enrollment Packet Update Needed','',1,'2021-03-03 19:17:59'),('reEnrollNoticeSent','Re-enroll',NULL,'Integer','6',NULL,0,'2020-11-04 15:43:08'),('reEnrollNoticeSentTo-10','Re-enroll',NULL,'Text',';15406;15411;15739;15676;15737;15735',NULL,0,'2021-05-25 15:49:13'),('reEnrollNoticeSentTo-4','Re-enroll',NULL,'Text',';354;355;357;358;359;360;361;363;364;366;367;368;369;371;372;373;374;375;377;378;379;380;381;382;383;384;385;386;387;389;390;391;392;393;394;396;397;398;400;401;402;403;404;405;406;407;408;409;410;411;412;413;415;416;417;418;419;420;421;422;423;425;426;427;428;429;430;431;432;433;434;435;437;438;439;441;442;444;445;446;447;448;449;450;451;452;453;454;455;456;457;458;459;461;462;463;466;469;470;472;474;475;476;478;479;480;482;483;484;485;486;487;489;490;491;492;493;495;496;498;499;500;502;503;504;505;507;509;511;512;516;518;519;520;521;522;525;526;527;529;530;532;533;534;537;539;540;541;542;543;545;547;548;549;550;551;552;553;554;555;556;557;558;559;560;561;562;565;567;568;570;572;573;574;575;576;577;578;579;580;581;583;584;585;586;587;588;589;590;591;592;594;595;596;597;598;599;600;601;602;606;609;610;611;613;614;615;616;618;619;620;621;622;623;624;626;627;628;629;630;631;632;633;634;635;637;638;639;640;641;642;643;644;646;647;649;650;651;652;653;654;655;656;657;658;659;660;661;663;664;665;666;667;668;669;670;671;672;673;674;676;678;679;680;681;684;688;691;695;697;698;702;706;710;712;713;715;722;725;728;731;732;733;735;736;737;738;741;743;747;748;754;757;764;766;767;770;774;775;776;782;784;788;792;793;794;796;801;803;806;807;808;813;820;823;825;827;830;833;834;836;839;844;847;848;851;855;859;864;866;869;871;872;873;877;878;880;883;884;888;891;892;895;898;899;900;901;902;903;904;906;908;909;912;914;918;920;921;925;928;933;936;940;948;949;953;962;963;965;967;968;969;970;975;976;978;979;981;982;983;988;989;990;993;994',NULL,0,'2015-02-10 05:02:10'),('reEnrollNoticeSentTo-5','Re-enroll',NULL,'Text',';354;355;357;358;361;363;364;366;368;369;372;373;374;375;377;378;379;380;381;382;383;384;386;387;389;390;391;392;400;401;402;403;404;405;406;407;408;412;413;416;417;418;419;420;421;423;425;427;430;431;435;438;439;440;442;444;445;447;448;449;450;451;452;454;455;456;457;458;459;461;462;463;465;466;468;469;470;475;478;479;480;483;484;485;486;487;489;491;493;495;496;498;499;500;504;505;507;512;515;516;518;520;521;522;524;526;527;529;530;531;532;533;534;537;539;540;541;542;543;547;548;551;552;553;555;556;557;558;559;560;561;562;567;568;570;571;572;573;574;575;577;578;579;580;581;583;585;586;587;588;590;591;592;594;595;596;598;599;600;601;602;608;610;611;613;615;619;620;621;622;623;624;625;627;628;632;633;634;637;638;639;640;641;643;644;646;649;650;651;652;654;655;656;658;659;660;661;663;664;665;666;669;670;672;673;674;676;678;679;680;681;684;688;691;694;697;703;710;712;715;722;723;725;728;731;732;733;735;736;738;741;743;745;747;748;751;752;754;756;757;762;764;766;767;770;775;776;782;784;788;790;792;799;800;801;802;807;808;817;823;826;828;830;834;836;838;844;847;848;855;859;863;864;866;869;871;872;874;877;880;883;884;888;892;900;904;908;909;912;914;917;918;921;925;928;933;936;938;940;943;949;953;955;959;962;967;969;978;979;983;984;987;990;993;995;997;1001;1002;1005;1006;1010;1013;1021;1030;1039;1041;1050;1052;1053;1055;1056;1057;1059;1062;1066;1070;1073;1074;1079;1082;1083;1085;1088;1091;1095;1097;1100;1101;1102;1103;1105;1109;1116;1121;1123;1124;1129;1131;1132;1143;1144;1147;1149;1151;1152;1155;1156;1158;1160;1163;1167;1170;1174;1175;1176;1177;1179;1180;1182;1183;1186;1187;1188;1192;1194;1195;1203;1204;1207;1210;1212;1213;1215;1216;1226;1232;1233;1237;1238;1242;1243;1244;1247;1249;1250;1251;1254;1255;1256;1257;1258;1259;1260;1261;1262;1263;1264;1269;1270;1271;1272;1274;1276;1277;1280;1283;1284;1285;1297;1298;1303;1309;1310;1312;1316;1317;1318;1325;1342;1366;1368;1372;1380;1384;1387;1390;1394;1395;1396;1401;1402;1403;1407;1414;1416;1417;1422;1423;1431;1436;1438;1440;1441;1442;1443;1444;1445;1449;1451;1454;1456;1457;1458;1459;1462;1468;1469;1470;1472;1473;1477;1480;1483;1485;1488;1490;1491;1493;1498;1500;1502;1504;1505;1506;1509;1510;1513;1516;1517;1531;1533;1534;1541;1546;1547;1548;1551;1553;1558;1559;1560;1561;1563;1564;1567;1572;1576;1577;1579;1580;1585;1589;1591;1592;1593;1595;1596;1599;1600;1613;1616;1617;1618;1621;1622;1626;1629;1630;1631;1637;1638;1641;1644;1646;1648;1651;1652;1653;1654;1655;1658;1663;1664;1666;1667;1668',NULL,0,'2016-02-08 05:02:01'),('reEnrollNoticeSentTo-6','Re-enroll',NULL,'Text',';354;355;358;361;364;366;368;369;372;373;374;375;377;378;379;382;383;384;386;387;389;390;392;400;402;403;404;405;406;407;413;416;417;418;419;420;421;423;425;427;430;431;435;438;439;442;444;445;448;449;450;451;452;454;455;456;457;458;459;461;462;463;464;465;466;469;470;475;478;479;480;483;484;485;489;490;493;495;496;499;500;504;505;507;512;514;515;518;520;521;522;524;526;527;529;530;531;532;533;534;537;541;542;543;547;548;551;552;553;555;557;558;559;560;561;562;565;567;568;570;571;572;574;577;580;581;583;585;586;588;589;591;592;594;595;598;600;607;610;611;613;615;619;620;621;622;624;625;626;627;633;637;638;639;640;641;642;643;644;646;647;649;650;651;652;654;655;657;658;659;664;665;666;669;670;672;673;674;676;678;681;684;688;691;694;703;704;710;712;715;722;731;732;736;738;741;745;747;748;751;752;754;764;766;767;770;772;782;784;788;790;792;801;802;808;817;826;827;830;831;836;838;844;848;855;859;863;864;871;872;874;877;880;883;884;888;892;900;902;904;906;908;914;917;918;921;925;928;933;936;940;943;949;951;953;955;959;962;967;968;969;976;983;984;988;990;991;997;1001;1006;1014;1018;1021;1030;1039;1041;1043;1044;1049;1050;1051;1052;1055;1057;1062;1070;1075;1079;1082;1083;1084;1085;1091;1109;1116;1121;1123;1124;1129;1131;1144;1147;1151;1152;1155;1156;1160;1170;1174;1175;1176;1177;1178;1185;1186;1187;1188;1192;1195;1203;1207;1210;1213;1215;1232;1233;1237;1238;1242;1243;1244;1246;1247;1249;1250;1254;1256;1257;1258;1259;1262;1263;1264;1266;1268;1269;1270;1274;1275;1276;1277;1283;1284;1285;1297;1298;1303;1309;1310;1312;1316;1317;1318;1325;1342;1366;1368;1372;1380;1384;1387;1390;1394;1395;1396;1402;1403;1407;1420;1422;1423;1431;1436;1438;1440;1441;1442;1468;1477;1493;1536;1444;1445;1449;1456;1457;1458;1459;1470;1472;1473;1480;1483;1485;1490;1491;1504;1506;1510;1513;1516;1517;1531;1533;1542;1546;1547;1551;1553;1558;1560;1561;1563;1564;1567;1569;1572;1576;1579;1585;1591;1594;1595;1596;1600;1607;1609;1610;1613;1616;1618;1621;1624;1626;1629;1631;1636;1644;1648;1650;1658;1660;1667;1668;1674;1677;1678;1679;1680;1681;1683;1684;1691;1692;1693;1696;1697;1703;1704;1705;1706;1711;1712;1714;1715;1716;1717;1720;1723;1724;1725;1729;1730;1731;1732;1740;1741;1742;1743;1746;1748;1750;1752;1753;1755;1756;1757;1758;1760;1762;1763;1764;1765;1767;1768;1771;1772;1775;1776;1777;1778;1779;1782;1785;1786;1787;1789;1794;1796;1797;1799;1800;1801;1803;1809;1811;1820;1825;1828;1829;1834;1835;1837;1838;1842;1843;1844;1847;1851;1855;1857;1861;1862;1867;1871;1873;1874;1875;1876;1878;1880;1881;1882;1886;1889;1890;1893;1894;1895;1898;1900;1902;1903;1904;1907;1908;1909;1913;1915;1916;1920;1921;1922;1923;1924;1931;1935;1937;1943;1944;1950;1955;1960;1974;1976;1980;1981;1995;1996;1997;2000;2005;2008;2009;2014;2016;2018;2020;2021;2022;2025;2027;2035;2037;2039;2044;2046;2049;2050;2056;2058;2062;2063;2067;2073;2075;2076;2081;2082;2086;2087;2089;2092;2100;2103;2104;2106;2111;2112;2128;2135;2140;2141;2143;2145;2148;2149;2150;2152;2154;2161;2162;2163;2166;2167;2168;2169;2170;2172;2173;2174;2175;2177;2178;2181;2182;2185;2187;2189;2190;2194;2196;2201;2203;2207;2214;2215;2216;2224;2230;2233;2235;2236;2245;2248;2251;2256;2261;2262;2266;2267;2268;2269;2270;2273;2275;2282;2284;2285;2286;2288;2289;2291;2292;2295;2296;2297;2299;2301;2302;2303;2305;2306;2312;2313;2314;2315;2316;2319;2320;2325;2328;2330;2331;2334;2335;2336;2338;2339;2340;2342;2349;2352;2353;2356;2361;2362;2364;2371;2372;2377;2378;2387;2388;2389;2399;2401;2402;2403;2404;2405;2406;2407;2408;2409;2414;2415;2418;2419;2420;2425;2426;2428;2432;2433;2436;2437;2438;2439;2449;2452;2453;2454;2458;2463;2467;2469;2473;2474;2475;2476;2481;2484;2491;2492;2494;2495;2496;2498;2505;2506;2509;2511;2512;2513;2517;2518;2520;2521;2522;2525;2528;2530;2531;2532;2534;2537;2538;2539;2540;2544;2545;2547;2549;2550;2560;2561;2565;2570;2571;2576;2579;2583;2587;2588;2589;2595;2597;2598;2603;2604;2607;2608;2616;2620;2623;2624;2625;2629;2630;2633;2635;2636;2638;2640;2645;2646;2649;2650;2651;2652;2654;2657;2659;2660;2667;2672;2673;2675;2676;2680',NULL,0,'2017-02-16 05:02:36'),('reEnrollNoticeSentTo-7','Re-enroll',NULL,'Text',';354;355;358;361;364;366;368;369;371;372;373;374;375;376;377;383;384;386;387;389;390;392;394;400;402;403;405;406;407;410;416;417;418;421;423;425;427;430;431;435;438;439;442;444;445;448;449;450;451;454;455;456;457;458;462;463;464;465;466;470;472;475;478;479;480;483;485;489;493;495;496;499;500;505;514;515;516;518;520;524;526;527;529;531;532;533;534;537;540;541;542;543;547;548;551;553;556;557;558;559;560;561;562;565;566;568;570;571;573;574;575;577;580;581;583;585;588;589;590;591;594;595;598;600;607;610;613;615;619;620;622;624;625;627;629;637;639;641;642;643;644;646;647;649;650;652;655;657;658;659;661;664;665;669;670;672;673;674;676;679;684;688;691;694;703;704;712;715;722;732;747;748;752;756;764;766;767;770;772;782;784;788;790;792;793;801;802;808;817;826;830;831;836;844;848;859;863;864;871;872;874;877;884;892;895;900;902;906;908;914;918;921;928;933;936;940;943;955;959;962;968;976;977;983;989;990;991;997;1001;1006;1010;1014;1018;1030;1040;1043;1044;1049;1050;1051;1052;1055;1059;1062;1063;1070;1073;1075;1079;1082;1083;1091;1097;1100;1102;1105;1116;1123;1124;1129;1144;1149;1151;1152;1155;1160;1170;1175;1177;1178;1183;1186;1187;1192;1195;1203;1207;1210;1213;1215;1232;1233;1237;1242;1243;1245;1246;1247;1249;1250;1254;1256;1257;1258;1259;1262;1263;1264;1266;1267;1268;1269;1270;1274;1275;1276;1277;1283;1284;1285;1297;1303;1310;1312;1317;1318;1325;1342;1372;1387;1390;1394;1402;1420;1422;1423;1427;1431;1436;1438;1441;1442;1449;1454;1457;1458;1459;1470;1472;1473;1483;1485;1488;1491;1498;1504;1505;1506;1510;1513;1517;1531;1533;1534;1536;1541;1547;1551;1558;1560;1563;1564;1567;1569;1572;1576;1577;1591;1592;1594;1596;1600;1607;1609;1613;1616;1621;1626;1629;1630;1631;1638;1644;1648;1660;1661;1667;1674;1677;1678;1679;1680;1681;1683;1691;1692;1696;1698;1703;1704;1705;1712;1714;1715;1716;1717;1720;1723;1725;1730;1732;1737;1739;1740;1741;1742;1746;1748;1750;1752;1753;1756;1757;1758;1762;1763;1764;1765;1768;1772;1775;1776;1778;1779;1782;1787;1789;1792;1794;1796;1797;1799;1800;1801;1803;1805;1809;1811;1820;1828;1829;1834;1835;1837;1838;1842;1843;1847;1850;1851;1852;1857;1861;1862;1865;1867;1875;1876;1878;1881;1882;1886;1890;1894;1895;1899;1904;1906;1907;1921;1922;1924;1931;1937;1943;1950;1955;1970;1976;1980;1981;1991;1995;1997;2000;2008;2010;2014;2016;2018;2019;2020;2021;2025;2027;2037;2046;2050;2058;2062;2063;2067;2075;2076;2081;2082;2086;2087;2089;2092;2098;2100;2103;2104;2106;2111;2112;2128;2140;2141;2149;2150;2152;2154;2162;2163;2164;2167;2168;2169;2172;2174;2175;2177;2185;2189;2196;2198;2201;2203;2207;2214;2215;2224;2230;2233;2235;2245;2246;2248;2251;2261;2266;2267;2268;2270;2273;2281;2288;2292;2295;2296;2299;2301;2303;2305;2306;2312;2315;2320;2323;2325;2331;2333;2335;2336;2338;2339;2342;2349;2353;2354;2361;2364;2371;2378;2381;2387;2389;2393;2396;2400;2401;2402;2403;2404;2405;2406;2415;2418;2419;2420;2425;2426;2431;2432;2433;2438;2439;2445;2452;2453;2454;2467;2469;2472;2473;2474;2476;2480;2491;2493;2494;2496;2498;2500;2505;2506;2509;2512;2513;2522;2525;2528;2531;2532;2537;2538;2544;2545;2546;2549;2553;2555;2560;2561;2565;2569;2570;2571;2577;2579;2581;2583;2587;2589;2593;2595;2597;2598;2603;2604;2607;2617;2623;2629;2638;2645;2646;2649;2650;2657;2659;2660;2666;2667;2672;2674;2676;2685;2686;2681;2692;2694;2695;2699;2704;2706;2708;2711;2713;2714;2715;2719;2720;2724;2729;2731;2736;2737;2740;2741;2745;2746;2748;2758;2762;2763;2774;2778;2779;2786;2789;2790;2793;2805;2807;2810;2818;2819;2825;2827;2840;2842;2843;2855;2856;2860;2866;2870;2873;2875;2883;2888;2889;2894;2898;2903;2904;2905;2909;2910;2911;2923;2936;2938;2946;2950;2955;2962;2964;2969;2974;2975;2977;2978;2981;2991;3000;3001;3003;3008;3015;3016;3017;3021;3023;3026;3029;3030;3031;3033;3034;3038;3042;3044;3047;3049;3056;3064;3065;3066;3069;3075;3076;3082;3093;3095;3097;3098;3107;3108;3113;3116;3118;3120;3125;3133;3134;3144;3146;3149;3150;3151;3152;3154;3159;3161;3162;3163;3164;3165;3178;3182;3187;3191;3193;3195;3197;3198;3199;3201;3209;3213;3219;3220;3221;3222;3231;3234;3235;3238;3239;3240;3241;3242;3245;3246;3250;3251;3255;3256;3259;3263;3265;3268;3270;3272;3274;3276;3278;3282;3287;3298;3301;3306;3307;3308;3309;3310;3312;3313;3320;3322;3327;3328;3329;3330;3331;3332;3336;3345;3349;3350;3353;3357;3358;3360;3362;3367;3374;3375;3381;3385;3392;3394;3396;3398;3400;3401;3403;3406;3407;3409;3410;3412;3415;3419;3426;3427;3430;3431;3432;3434;3435;3440;3443;3446;3450;3451;3452;3456;3463;3465;3468;3474;3477;3479;3484;3485;3488;3489;3491;3494;3496;3498;3506;3507;3511;3512;3513;3515;3516;3518;3519;3524;3525;3528;3529;3532;3537;3547;3548;3550;3552;3554;3557;3559;3566;3567;3568;3569;3574;3580;3581;3582;3583;3588;3590;3591;3592;3595',NULL,0,'2018-02-10 12:03:29'),('reEnrollNoticeSentTo-8','Re-enroll',NULL,'Text',';358;360;361;368;369;371;372;373;374;375;376;377;383;384;386;387;390;400;402;403;405;407;408;409;410;415;416;418;421;427;428;430;435;438;439;442;443;444;445;449;450;454;455;456;457;458;462;463;464;465;466;470;478;479;480;485;487;489;493;495;496;499;500;505;514;515;516;518;520;524;526;527;529;531;532;533;537;540;541;542;547;548;551;553;556;557;558;559;560;561;562;568;573;574;575;576;577;580;581;583;585;588;589;591;594;595;598;600;601;607;610;611;613;614;615;618;619;621;622;624;625;627;629;637;641;642;643;647;649;650;651;652;655;658;659;661;663;664;665;669;670;672;673;674;676;684;688;694;703;704;706;712;715;722;732;735;741;748;752;756;764;766;767;770;772;782;784;788;792;793;801;808;827;830;831;836;844;848;851;859;871;872;874;877;880;884;888;895;900;904;908;914;918;921;933;936;940;943;951;953;959;962;968;976;983;984;988;989;990;991;995;997;1006;1013;1014;1018;1030;1043;1044;1049;1050;1051;1055;1070;1073;1075;1079;1082;1083;1091;1097;1100;1102;1116;1123;1129;1149;1151;1152;1155;1160;1167;1177;1178;1185;1187;1192;1195;1203;1207;1210;1213;1215;1218;1232;1233;1237;1242;1244;1246;1248;1249;1250;1254;1259;1262;1263;1264;1266;1267;1270;1274;1275;1277;1283;1284;1285;1297;1303;1309;1310;1317;1318;1325;1372;1387;1395;1402;1403;1422;1436;1438;1441;1442;1444;1449;1454;1457;1458;1459;1470;1472;1473;1483;1488;1491;1504;1506;1510;1513;1516;1531;1533;1534;1536;1541;1547;1551;1558;1560;1564;1567;1569;1589;1591;1594;1595;1607;1609;1610;1613;1616;1621;1626;1630;1644;1658;1660;1661;1667;1677;1678;1679;1681;1683;1684;1691;1692;1703;1704;1711;1712;1714;1715;1716;1717;1723;1725;1730;1731;1739;1740;1742;1743;1748;1752;1753;1755;1756;1757;1758;1762;1763;1765;1772;1775;1777;1778;1779;1782;1785;1787;1789;1797;1801;1811;1817;1825;1827;1829;1835;1842;1847;1850;1862;1865;1876;1880;1881;1882;1886;1894;1895;1899;1900;1903;1904;1906;1908;1921;1922;1937;1943;1950;1960;1976;1981;1995;1997;2000;2010;2014;2016;2019;2020;2027;2046;2050;2058;2075;2076;2081;2086;2087;2088;2098;2104;2128;2135;2145;2150;2152;2163;2167;2174;2177;2187;2189;2204;2214;2224;2230;2245;2251;2261;2267;2270;2282;2291;2299;2301;2312;2314;2320;2325;2331;2335;2336;2353;2364;2377;2389;2393;2401;2402;2404;2405;2406;2418;2425;2445;2449;2452;2453;2454;2467;2469;2473;2476;2480;2495;2496;2498;2505;2506;2509;2513;2522;2528;2537;2538;2545;2546;2547;2560;2561;2577;2579;2581;2587;2589;2592;2595;2623;2625;2633;2634;2638;2645;2646;2649;2650;2654;2657;2659;2660;2666;2706;2708;2729;2731;2743;2745;2763;2777;2803;2807;2812;2818;2819;2840;2842;2856;2860;2861;2866;2875;2891;2898;2904;2909;2911;2934;2950;2955;2975;2977;2978;2981;2983;2986;2990;2995;3000;3015;3017;3021;3026;3029;3042;3066;3069;3070;3075;3088;3093;3098;3104;3107;3113;3116;3120;3127;3132;3149;3150;3154;3159;3161;3164;3165;3190;3193;3217;3220;3221;3222;3223;3231;3234;3240;3245;3250;3251;3255;3259;3268;3270;3278;3283;3304;3308;3310;3312;3313;3325;3327;3329;3330;3332;3345;3346;3348;3360;3367;3369;3381;3386;3392;3401;3409;3410;3415;3423;3426;3428;3430;3431;3434;3445;3450;3452;3456;3457;3463;3465;3477;3488;3494;3498;3512;3515;3517;3519;3520;3523;3538;3539;3540;3541;3548;3550;3559;3566;3578;3582;3583;3587;3590;3591;3594;3595;3607;3608;3612;3613;3615;3616;3625;3636;3640;3662;3671;3673;3679;3684;3687;3690;3699;3703;3706;3710;3715;3721;3723;3727;3731;3733;3734;3735;3737;3744;3756;3758;3768;3773;3775;3784;3785;3786;3789;3790;3794;3797;3799;3802;3807;3808;3810;3812;3817;3822;3825;3836;3842;3849;3851;3857;3858;3862;3865;3868;3876;3883;3884;3888;3889;3893;3900;3901;3907;3909;3911;3912;3915;3916;3926;3927;3930;3931;3935;3938;3941;3949;3957;3965;3979;3984;3985;3988;3991;3993;3995;3996;4004;4009;4028;4034;4043;4044;4049;4050;4053;4057;4066;4069;4076;4083;4086;4088;4092;4095;4102;4110;4126;4127;4131;4145;4152;4153;4156;4162;4171;4182;4187;4214;4219;4230;4235;4252;4257;4261;4265;4278;4281;4289;4290;4302;4325;4335;4343;4358;4362;4365;4370;4376;4380;4386;4387;4400;4403;4411;4413;4418;4420;4431;4438;4446;4447;4451;4453;4465;4466;4470;4474;4476;4477;4479;4481;4482;4485;4487;4490;4500;4501;4504;4509;4520;4521;4523;4533;4537;4542;4543;4544;4551;4554;4555;4559;4565;4567;4575;4577;4579;4580;4582;4592;4600;4604;4608;4610;4611;4615;4617;4620;4631;4633;4636;4642;4643;4650;4654;4657;4658;4661;4670;4676;4682;4685;4687;4696;4697;4714;4722;4726;4728;4740;4741;4743;4748;4754;4755;4756;4766;4768;4777;4778;4779;4780;4782;4787;4793;4796;4803;4808;4809;4814;4816;4820;4827;4828;4834;4835;4839;4848;4850;4860;4861;4864;4865;4870;4871;4872;4879;4882;4885;4890;4891;4895;4899;4901;4907;4908;4909;4913;4914;4916;4917;4919;4921;4930;4934;4939;4941;4944;4949;4957;4958;4960;4961;4975;4976;4978;4979;4983;4989;4992;4993;4995;4999;5000;5003;5006;5008;5015;5017;5020;5021;5024;5031;5043;5045;5050;5052;5055;5061;5062;5065;5069;5073;5074;5075;5078;5080;5085;5087;5089;5096;5099;5100;5115;5116;5118;5124;5125;5126;5130;5133;5135;5137;5138;5142;5144;5147;5154;5156;5165;5171;5172;5173;5175;5180;5184;5186;5194;5195;5200;5203;5204;5207;5210;8223;8221;8224;8222;6124;6125;4553;3078;5925;14188;11727;11916;6573;9719;6572;8735;9720;9721;12754;4213;8527;11656;5301;3700;2677;1776;5492;2675;2676;5072;13658;9631;12755;3627;4928;9205;4927;1354;2862;12753;10418;5032;5030;11483;12363;10419;11728;12752;11741;8967;11410;3427;6366;4708;10472;10471;13831;4707;12859;12867;12604;12603;12602;12858;4706;10177;7116;10178;7117;13436;963;10179;9388;9722;9389;8652;8653;10176;13477;4745;4747;14155;10322;13415;10323;13414;13412;13413;14002;14001;14000;11725;11726;964;4746;4744;5266;12533;5211;5534;8155;5532;11451;5531;5530;5533;13077;9669;9671;9670;13090;13091;13089;7252;12407;12404;12972;12405;12406;8741;2885;3301;9882;2886;987;6095;5654;5655;11802;3117;7707;7709;7708;7702;7703;7704;9850;11988;8811;12953;9872;9869;9870;9871;11417;10597;12983;12751;12748;12749;4284;4285;4283;13122;8821;6071;11972;8038;8039;10244;11612;9932;9933;6222;11430;11815;13592;999;9643;8593;13593;8323;6223;1000;12909;12910;12908;12911;7102;7103;7104;7434;13105;4905;11105;8717;10243;7593;7583;3049;6088;3048;6087;11043;6891;6894;6892;13603;6893;13359;13358;13410;12465;5496;5494;5493;5497;5495;12916;13993;13992;6714;6715;12966;6674;11701;11703;11702;13134;13136;13135;12497;12495;12496;11118;11117;11917;10206;4757;7161;7162;7160;12797;7847;11928;7848;2564;5931;14074;14073;10166;10168;7817;7818;9215;10204;8872;8874;8873;8871;6205;5667;3644;12170;8200;8201;11380;8203;12493;12492;11190;3860;6082;10055;10056;3859;6080;6081;13697;13913;13912;13698;13696;4694;12466;9202;11942;12868;5980;9000;8261;8260;10195;12905;6450;7321;9768;5327;5333;14032;10187;13397;13395;13396;13398;7648;10083;1087;6686;13152;12196;13151;1323;3732;10467;10468;13124;10012;10010;10011;12688;12687;12686;12651;12702;13098;13097;7330;7912;4256;14253;12988;12989;12987;12986;6926;6925;6928;6927;9178;10947;10943;10946;10945;10944;13468;6449;8113;13026;8112;1115;6448;8111;1911;11919;1117;1118;1119;3593;11382;5794;8109;6292;6291;11920;9023;11882;8925;8923;8924;12139;13065;13064;1143;6498;6497;6499;11454;6500;13046;13047;13048;6738;8428;8578;8579;8580;8577;11967;9803;10356;5867;11505;3281;3282;8141;8142;8143;12593;12594;13221;7320;13224;1158;2524;13574;12119;13514;13513;13512;6657;8118;8117;11223;6656;1668;2608;8116;11899;11441;5978;4595;4597;7223;11898;6704;4594;4596;11354;11071;13278;2400;11715;10221;12414;13190;11714;11489;1676;1194;9208;9129;10590;3630;10242;12952;1198;10225;7971;7970;1199;12346;5070;5068;11394;4576;12340;12341;12338;12339;2894;6272;2893;14199;13146;13147;11012;7579;13282;13283;4867;4866;9772;7339;7530;9147;7528;7531;7529;11318;11624;9364;5611;13008;5612;5613;8805;8804;8803;9726;9727;9725;9728;11840;11839;12745;12746;9795;9794;9796;3986;11576;8899;3501;8897;8898;11673;11253;8163;11675;11674;8507;1687;11521;11519;11520;3898;8839;12323;8840;11034;8837;8838;6079;13351;11654;13349;11220;7078;13353;10241;13350;11653;13352;7077;11219;11221;9839;9838;9840;1268;8401;3480;1271;1272;12780;1273;9486;4572;12605;11718;4013;12811;10562;6360;6046;4379;14082;5409;11157;4444;4443;4445;13582;5640;5723;5722;8800;9691;9011;1289;1693;6804;12289;10115;10110;13057;10114;13058;11453;12841;12587;12586;1299;1300;3599;6388;1305;3580;8632;8633;13120;1308;10251;9649;12891;9646;9647;9650;9648;8607;2878;2879;2880;13111;13113;13112;12260;13532;11344;13531;13417;13416;10259;10261;10260;10584;10560;11563;12305;4505;4506;5846;8521;2008;2009;6302;6301;7232;7840;14066;5821;1326;1699;9509;2852;3804;10062;6896;6897;12352;3963;12421;6737;6735;6736;12806;12697;7341;4274;13402;13401;13400;7592;7591;13320;13319;12663;13318;11676;12438;9145;13148;2554;9481;13475;11647;13476;12801;11039;11037;11038;13552;3974;2551;2550;2549;5567;5543;9157;3603;1384;1385;11852;12441;10014;10016;12382;12383;10013;12300;12299;14095;1397;14096;14098;14097;11504;11503;9560;9559;9524;9525;9526;12184;12183;9919;9918;9922;9920;9921;3983;13620;2443;4388;5833;8843;9169;9170;9168;3633;3811;4382;5822;9292;12543;3740;3037;5882;5883;5881;5942;9916;9915;11617;9490;9491;12950;4810;12951;11384;13243;13362;5079;13299;9942;1431;1434;9982;8709;8706;6296;8708;7972;7974;7973;12929;9214;13789;13790;7508;7509;9678;9677;11858;10745;8707;1440;8338;3475;7348;11599;7349;7350;12608;11500;11499;11501;12585;1461;3714;2434;1462;11423;2323;2324;9063;13193;13194;13192;11921;11761;11760;10992;10649;13940;8492;8491;12796;13018;11419;4142;9262;9260;9261;8792;11086;9883;2629;4767;12668;12976;10194;13015;13011;5161;13014;13013;5162;8732;13012;9854;3806;5960;3805;10239;1482;6196;12055;10039;12056;12149;10587;6651;11431;6649;12059;12060;14112;9448;9446;9447;9912;2775;8456;1495;12930;12262;12263;10607;10606;13562;1502;8297;12828;12827;13530;8282;8280;8283;9069;9068;9070;9071;2349;12032;8461;11776;2682;10271;2681;2683;9338;9337;9336;7043;3128;10459;4742;9704;9700;9702;9699;9705;13185;9701;9703;11307;1528;1529;2132;2130;2131;4315;4316;4317;2964;13590;13589;5961;9385;2133;2134;9609;1532;9608;1535;13059;12696;12695;12694;12692;5202;5201;5199;10003;13357;11571;6042;10660;10659;11481;5945;5943;8701;8700;8619;4173;2281;6672;11924;7309;12807;12381;7308;7310;7311;12833;13481;13479;7517;10453;13480;2639;7861;7860;9019;9018;10307;10306;6039;8601;6040;1435;2907;12733;2908;9931;9929;9930;12700;12699;10411;12960;2229;6097;11572;10500;10501;10502;12335;12334;12336;10457;10456;4630;9511;4629;8920;5227;5228;5229;5121;5122;5120;11577;4982;4981;6592;2363;7556;10893;10894;11271;1582;1583;8854;10198;11857;8795;11856;11855;10199;10197;2831;10487;7094;8808;8807;11947;11592;8861;9037;4286;10839;14081;2186;8290;6729;1608;12044;3683;11979;11978;13467;8645;13150;8646;8644;11544;12763;12764;3855;12254;3619;9429;5940;11482;14124;14009;13377;9771;12588;13657;12954;12955;10861;4179;4180;10095;10094;10862;3131;7340;3130;12243;12432;12242;10060;11781',NULL,0,'2019-02-20 21:07:20'),('reEnrollNoticeSentTo-9','Re-enroll',NULL,'Text',';4380;5000;6071;6079;6081;6082;6084;6088;6090;6091;6093;6098;6100;15386;15455;15422;15419;15415;15416;15446;15417;15408;15458;15412;15628;15629;15630;15631;15709;15706;15707;15708',NULL,0,'2020-11-10 19:23:05'),('reEnrollReminderDays','Re-enroll','Intent to Re-enroll Reminder Email','Integer','1','<p>Number of days before Intent to Re-enroll Deadline to send the reminder</p>',1,'2020-07-08 18:53:06'),('reEnrollReminderEmailContent','Re-enroll','Intent to Re-enroll reminder email content','HTML','<p>Hi, [PARENT],</p>\n\n<p>This is a friendly reminder that <strong>[STUDENT]\'s</strong> Intent to Re-enroll is due by <strong>[DEADLINE]</strong>. Login to your parent account at <a href=\"https://infocenter.mytechhigh.com\" target=\"_blank\">https://infocenter.mytechhigh.com</a> to declare your plans for next year.</p>\n\n<p>Please contact Amy at <a href=\"mailto:admin@mytechhigh.com\">admin@mytechhigh.com</a> or join a <a href=\"https://www.mytechhigh.com/livechat/\" target=\"_blank\">live Q&amp;A session</a> if you have any questions.</p>\n\n<p>Thanks!</p>\n\n<p>- My Tech High</p>\n\n<p>*This is just a test, please disregard if you receive this email* - MTH</p>\n','<dl><dt>[PARENT]</dt>\n            <dd>Parent\'s first name</dd>\n            <dt>[STUDENT]</dt>\n            <dd>Student\'s first name</dd>\n            <dt>[SCHOOL_YEAR]</dt>\n            <dd>The school year of the to be enrolled in (2014-15)</dd>\n            <dt>[DEADLINE]</dt>\n            <dd>Intent to Re-enroll submission deadline (February 15)</dd>\n          </dl>',1,'2021-02-16 15:06:07'),('reEnrollReminderEmailSubject','Re-enroll','Intent to Re-enroll reminder email Subject','Text','Final Reminder: Declare Intent to Re-enroll for the [SCHOOL_YEAR] My Tech High program','Same merge fields as email content',1,'2021-01-12 13:32:32'),('reEnrollReminderSent','Re-enroll',NULL,'Integer','8',NULL,0,'2019-03-28 04:00:05'),('reEnrollReminderSentTo-10','Re-enroll',NULL,'Text',';15406;15411;15739;15676;15737;15735',NULL,0,'2021-05-25 15:49:13'),('reEnrollReminderSentTo-4','Re-enroll',NULL,'Text',';909;922;927;939;940;941;942;946;947;948;951;952;963;964;965;972;979;980;981;982;983;984;985;986;992;993;994;1006;1007;1008;1009;1019;1021;1022;1028;1054;1071;1072;1073;1074;1075;1076;1080;1088;1089;1090;1091;1092;1093;1094;1095;1102;1103;1107;1108;1109;1122;1123;1124;1132;1133;1134;1135;1136;1137;1153;1154;1156;1157;1158;1159;1160;1161;1180;1184;1185;1186;1189;1190;1191;1199;1201;1206;1207;1233;1237;1238;1239;1240;1244;1245;1246;1247;1248;1249;1258;1282;1288;1289;1290;1309;1310;1325;1326;1342;1345;1346;1353;1356;1361;1366;1367;1370;1371;1374;1375;1376;1384;1385;1386;1387;1391;1392;1397;1398;1399;1407;1408;1409;1410;1411;1431;1433;1436;1443;1444;1449;1450;1467;1471;1472;1497;1498;1499;1500;1506;1509;1527;1528;1529;1541;1544;1555;1556;1557;1569;1578;1579;1608;1609;1610;1623;1641;1642;1675;1679;1686;1696;1699;1706;1709;1723;1731;1738;1739;1740;1741;1744;1745;1749;1750;1765;1804;1805;1806;1807;1832;1857;1858;1946;1983;1984;1985;1998;1999;2000;2013;2016;2030;2066;2067;2084;2136;2137;2146;2147;2148;2149;2150;2177;2178;2194;2195;2196;2212;2213;2224',NULL,0,'2015-02-19 05:02:12'),('reEnrollReminderSentTo-5','Re-enroll',NULL,'Text',';972;977;978;979;980;982;985;986;994;1002;1021;1022;1055;1056;1057;1075;1076;1088;1089;1090;1091;1122;1123;1124;1130;1131;1143;1144;1145;1156;1158;1165;1166;1167;1171;1172;1173;1206;1217;1218;1219;1236;1237;1238;1239;1240;1252;1253;1254;1264;1268;1270;1271;1279;1280;1281;1288;1289;1290;1291;1293;1294;1298;1299;1300;1301;1302;1303;1305;1306;1308;1309;1310;1344;1345;1346;1347;1348;1349;1350;1351;1354;1355;1361;1362;1363;1364;1368;1369;1371;1374;1375;1376;1386;1387;1397;1398;1405;1406;1408;1409;1410;1411;1420;1421;1422;1423;1424;1435;1439;1440;1441;1442;1443;1444;1450;1471;1472;1473;1474;1486;1489;1490;1491;1493;1495;1516;1519;1521;1523;1524;1528;1529;1530;1549;1550;1553;1554;1580;1581;1582;1583;1589;1599;1608;1609;1620;1621;1622;1642;1646;1647;1667;1668;1687;1690;1695;1696;1719;1724;1727;1731;1755;1772;1846;1847;1848;1849;1853;1857;1863;1864;1879;1880;1920;1937;1941;1942;1960;1961;1962;1963;1983;1986;2011;2012;2034;2041;2042;2061;2084;2085;2115;2116;2121;2126;2127;2128;2130;2131;2132;2144;2145;2165;2206;2216;2217;2218;2228;2229;2230;2289;2306;2370;2371;2399;2400;2401;2402;2410;2411;2412;2431;2432;2442;2456;2457;2524;2525;2526;2529;2530;2552;2567;2592;2595;2601;2602;2629;2630;2653;2670;2678;2681;2682;2683;2684;2722;2723;2744;2765;2766;2767;2776;2784;2785;2786;2797;2798;2799;2806;2813;2823;2824;2825;2826;2827;2834;2836;2847;2852;2856;2857;2858;2878;2881;2900;2925;2935;2948;2949;2950;2954;2980;2987;2988;2990;2998;2999;3007;3010;3013;3016;3023;3026;3029;3033;3042;3078;3103;3104;3105;3117;3120;3129;3130;3131;3224;3266;3279;3332;3333;3335;3365;3369;3394;3395;3396;3446;3447;3463;3464;3480;3486;3487;3488;3499;3507;3508;3509;3547;3548;3549;3550;3551;3552;3567;3575;3576;3599;3612;3618;3619;3626;3656;3659;3661;3662;3683;3701;3710;3717;3744;3765;3768;3769;3784;3803;3805;3806;3816;3817;3818;3836;3851;3855;3879;3884;3898;3912;3921;3922;3923;3924;3933;3985;3986;3994;3995;4033;4034;4035;4045;4046;4047;4048;4054;4082;4083;4084;4085;4086;4087;4088;4089;4117;4118;4119;4120;4121;4124;4125;4126;4127;4147;4148;4149;4150;4156;4158;4159;4167;4178;4179;4180;4181;4182;4183;4184;4185;4187;4189;4190;4191;4197;4198;4219;4220;4221;4231;4234;4236;4249;4251;4256;4257;4260;4261;4262;4263;4266;4272;4273;4274;4283;4284;4285;4288;4290;4291;4293;4307;4312;4315;4316;4317',NULL,0,'2016-02-22 05:02:06'),('reEnrollReminderSentTo-6','Re-enroll',NULL,'Text',';911;912;913;7181;7180;7204;1765;6436;7439;4699;7091;7451;7452;7450;6693;6691;967;968;6870;6869;6871;6683;6819;6044;6045;6043;5954;3117;2992;7460;7459;7461;6721;6720;1642;6071;7212;6451;5810;4675;4676;4674;6861;6155;7671;5522;7651;7265;7655;6385;6386;1063;1064;4397;4396;4398;4395;4394;5980;1887;1886;2948;2950;5996;2949;4406;7021;5195;5194;5192;5423;5563;6323;6325;6324;1129;5446;1132;1133;6621;5261',NULL,0,'2017-03-27 05:02:31'),('reEnrollReminderSentTo-7','Re-enroll',NULL,'Text',';10564;10565;7163;8424;9718;9719;9720;9721;9970;7849;8940;8939;8938;8941;8395;8495;934;935;6859;8073;6858;4776;5017;7027;5029;10283;1792;7510;3528;1791;2274;10282;9722;9119;6870;6869;6871;9324;3886;3887;7404;7907;9151;4185;7702;7703;7704;9805;9806;9804;8821;6071;8038;8039;998;6972;9172;9173;9174;1021;1022;7434;10243;3628;6806;9606;9693;9692;3965;3964;5196;8411;5197;5198;4357;5790;3410;9665;11115;11118;11116;11117;9034;8150;9100;9099;9101;7817;7818;1056;1057;9215;9676;6668;6082;6080;6081;3816;1075;1076;8960;8961;8764;10195;3909;3908;2576;7330;6811;8951;4258;4259;5563;9941;9940;9023;7156;2430;3835;2429;5812;4511;4510;6621;5261;10059;10058;4519;4518;4517;9803;1156;7320;2524;9204;7674;9689;9688;10148;10147;10146;6119;4543;2401;2400;2402;1671;10221;3003;9846;9847;10590;3630;10242;1362;9504;9659;9505;9506;9053;9052;9051;3070;1199;6145;6149;6146;6482;6483;6485;6484;6329;6330;8639;9483;9955;9902;6337;8119;6336;5323;9263;7923;3631;10241;9531;10223;10562;6030;5408;8528;5409;1986;6457;10116;9207;9691;9010;1294;9842;9843;9841;9844;9845;6388;3790;8682;6918;6919;5400;9812;9811;10251;10033;10293;7415;8647;7416;7414;7413;7417;6173;6172;6793;10027;8551;8550;7738;7737;3827;2587;2586;7232;7840;1329;9510;9509;9105;9960;9959;10054;10530;7624;5349;9878;9879;9880;4233;9269;9268;4113;5401;9559',NULL,0,'2018-02-26 12:02:37'),('reEnrollReminderSentTo-8','Re-enroll',NULL,'Text',';8223;8221;8224;8222;6124;6125;4553;3078;5925;14188;11727;11916;6573;9719;6572;8735;9720;9721;12754;4213;8527;11656;5301;3700;5073;2677;1776;5492;2675;2676;5072;13658;9631;12755;3627;4928;9205;4927;1354;2861;2862;12753;2860;10418;5032;5030;5031;11483;12363;10419;11728;12752;11741;8967;11410;3427;6366;4708;10472;10471;13831;4707;12859;12867;12604;12603;12602;12858;4706;10177;7116;10178;7117;13436;963;10179;9388;9722;9389;8652;8653;10176;13477;4745;4747;14155;10322;13415;10323;13414;13412;13413;14002;14001;14000;11725;11726;964;4746;4744;5266;12533;5211;5534;8155;5532;11451;5531;5530;5533;13077;9669;9671;9670;13090;13091;13089;7252;12407;12404;12972;12405;12406;8741;2885;3301;9882;2886;987;6095;5654;5655;11802;3117;7707;7709;7708;7702;7703;7704;9850;11988;8811;12953;9872;9869;9870;9871;11417;10597;12983;12751;12748;12749;4284;4285;4283;13122;8821;6071;11972;8038;8039;10244;11612;9932;9933;6222;11430;11815;13592;999;9643;8593;13593;8323;6223;1000;12909;12910;12908;12911;7102;7103;7104;7434;13105;4905;11105;8717;10243;7593;7583;3049;6088;3048;6087;11043;6891;6894;6892;13603;6893;13359;13358;13410;12465;5496;5494;5493;5497;5495;12916;13993;13992;6714;6715;12966;6674;11701;11703;11702;13134;13136;13135;12497;12495;12496;11118;11117;11917;10206;4757;7161;7162;7160;12797;7847;11928;7848;2564;5931;14074;14073;10166;10168;7817;7818;9215;10204;8872;8874;8873;8871;6205;5667;3644;12170;8200;8201;11380;8203;12493;12492;11190;3860;6082;10055;10056;3859;6080;3858;6081;13697;13913;13912;13698;13696;4694;12466;9202;11942;12868;5980;9000;2950;8261;8260;10195;12905;6450;7321;9768;5327;5333;14032;10187;13397;13395;13396;13398;7648;10083;1660;1087;6686;13152;12196;13151;1323;3732;10467;10468;13124;10012;10010;10011;12688;12687;12686;12651;12702;13098;13097;7330;7912;4257;4256;14253;12988;12989;12987;12986;6926;6925;6928;6927;9178;10947;10943;10946;10945;10944;13468;6449;8113;13026;8112;1115;6448;8111;1911;11919;1117;1118;1119;3593;3594;11382;5794;8109;6292;6291;11920;9023;11882;8925;8923;8924;12139;13065;13064;1143;6498;6497;6499;11454;6500;13046;13047;13048;6738;8428;8578;8579;8580;8577;11967;9803;10356;5867;11505;3281;3282;8141;8142;8143;12593;12594;13221;7320;13224;1158;2524;13574;12119;13514;13513;13512;6657;8118;1667;8117;11223;6656;1668;2608;8116;11899;11441;5978;4595;4597;7223;11898;6704;4594;4596;11354;11071;13278;4543;2401;2400;2402;11715;10221;12414;13190;11714;11489;1676;1194;1195;9208;9129;10590;3630;10242;12952;1198;10225;7971;7970;3070;1199;12346;5069;5070;5068;11394;4575;4576;4479;12340;12341;12338;12339;2894;3409;6272;2893;14199;13146;13147;11012;7579;13282;13283;4867;4866;9772;4865;7339;7530;9147;7528;7531;7529;11318;11624;9364;5611;13008;5612;5613;8805;8804;8803;9726;9727;9725;9728;11840;11839;12745;12746;9795;9794;9796;3985;3986;11576;8899;3501;8897;8898;11673;11253;8163;11675;11674;8507;1687;11521;11519;11520;3898;1254;8839;12323;8840;11034;8837;8838;6079;4504;13351;11654;13349;11220;7078;13353;10241;13350;11653;13352;7077;11219;11221;9839;9838;9840;1268;8401;3480;1271;1272;12780;1273;9486;4572;12605;11718;4013;12811;10562;3517;6360;6046;4542;4379;14082;5409;11157;4446;4447;4444;4443;4445;13582;5640;5723;5722;8800;9691;9011;1289;1693;6804;12289;10115;10110;13057;10114;13058;11453;12841;12587;12586;1299;1300;3599;6388;1305;3580;8632;8633;13120;1308;10251;9649;12891;9646;9647;9650;9648;4289;8607;2878;2879;2880;13111;13113;13112;12260;13532;11344;13531;13417;13416;10259;10261;10260;10584;10560;11563;12305;4505;4506;5846;8521;2008;2010;2009;6302;6301;7232;7840;14066;1325;5821;1326;1699;9509;2852;3804;10062;6896;6897;12352;3963;12421;6737;6735;6736;12806;12697;7341;4274;13402;13401;13400;7592;7591;13320;13319;12663;13318;11676;12438;9145;13148;2554;9481;13475;11647;13476;12801;11039;11037;11038;13552;2314;3974;2551;2550;2549;5567;5543;9157;3603;1384;1385;11852;12441;10014;10016;12382;12383;10013;12300;12299;14095;1397;14096;14098;14097;11504;11503;9560;9559;9524;9525;9526;12184;12183;9919;9918;9922;9920;9921;3983;13620;2443;4388;5833;8843;9169;9170;9168;3633;3811;3812;4382;5822;9292;12543;3740;2050;3037;5882;5883;5881;5942;9916;9915;11617;9490;9491;12950;4809;4810;12951;11384;13243;13362;5078;5080;5079;13299;9942;1431;1434;9982;8709;8706;6296;8708;7972;7974;7973;12929;9214;13789;13790;7508;7509;9678;9677;11858;10745;8707;1440;8338;3475;1441;1442;7348;11599;7349;7350;12608;11500;11499;11501;12585;1461;3714;2434;1462;11423;2323;2324;9063;13193;13194;13192;11921;11761;11760;10992;10649;13940;8492;8491;12796;13018;11419;4142;9262;9260;9261;8792;11086;9883;2629;4767;12668;12976;10194;13015;13011;5161;13014;13013;5162;8732;13012;3901;9854;3806;5960;3805;1704;10239;1482;6196;12055;10039;12056;12149;10587;6651;11431;6649;12059;12060;14112;9448;9446;9447;9912;2775;2537;8456;1495;12930;12262;12263;10607;10606;13562;1502;8297;1504;12828;12827;13530;8282;8280;8283;9069;9068;9070;9071;2349;12032;1436;3559;8461;1516;11776;2682;10271;2681;2683;9338;9337;9336;7043;3128;3127;10459;4742;9704;9700;9702;9699;9705;13185;9701;9703;11307;1528;1731;1529;2132;2130;2131;4315;4316;4317;2964;13590;13589;5961;2135;9385;2133;2134;9609;1531;1532;1533;9608;1535;1536;13059;12696;12695;12694;12692;5200;5203;5202;5201;5199;10003;13357;11571;6042;10660;10659;11481;5945;5943;8701;8700;8619;4173;3735;2281;6672;11924;7309;12807;12381;7308;7310;7311;12833;2638;13481;13479;2167;7517;10453;13480;2639;7861;7860;9019;9018;10307;10306;6039;8601;6040;1435;2907;12733;2908;9931;9929;9930;12700;12699;10411;12960;2230;2229;6097;11572;10500;10501;10502;12335;12334;12336;10457;10456;4630;4631;9511;4629;8920;5227;5228;5229;5121;5122;5120;11577;4982;4981;6592;2363;7556;2364;10893;10894;11271;1582;1583;8854;10198;11857;8795;11856;11855;10199;10197;2831;10487;7094;8808;8807;11947;11592;8861;9037;4286;10839;14081;2187;2186;8290;6729;1608;1609;12044;3683;11979;11978;13467;8645;13150;8646;8644;11544;12763;12764;3855;12254;3619;9429;5940;11482;14124;14009;13377;9771;12588;13657;12954;12955;10861;4179;4180;10095;10094;10862;3131;7340;3130;12243;12432;12242;10060;11781',NULL,0,'2019-03-28 04:00:05'),('reEnrollReminderSentTo-9','Re-enroll',NULL,'Text',';15386;15455;15422;15419;15415;15416;15446;15417;15408;15458;15412;15628;15629;15630;15631;15709;15706;15707;15708',NULL,0,'2020-11-10 19:23:05'),('reimbursementcc','Reimbursement','Tech Allowance and 3rd Party Provider Email BCC','Text','','<p>Send an email copy to this email address</p>',1,'2020-07-08 18:53:07'),('reimbursementurcc','Reimbursement','Updates required Email BCC','Text','','<p>Send an email copy to this email address(es). Separated by comma(,). (eg. kelly@mytechhigh.com,madisen@mytechhigh.com)</p>',1,'2020-07-08 18:53:07'),('scheduleApprovedEmail','Schedules','Schedule Approved Email Content','HTML','<p>Hi [PARENT],</p>\n\n<p>Well done! [STUDENT]\'s [SCHOOL_YEAR] schedule has been approved. You can review it at any time in yourÂ <a href=\"http://mytechhigh.com/infocenter\" target=\"_blank\">InfoCenter account</a>.</p>\n\n<p>Please contact Amy atÂ <a href=\"mailto:admin@mytechhigh.com\">admin@mytechhigh.com</a>Â if you have any questions.</p>\n\n<p>Thanks!</p>\n\n<p>My Tech High</p>\n\n<p>*This is just a test, please disregard if you receive this email* - MTH</p>\n','<dl><dt>[PARENT]</dt>\n            <dd>Parent\'s first name</dd>\n            <dt>[STUDENT]</dt>\n            <dd>Student\'s first name</dd>\n            <dt>[SCHOOL_YEAR]</dt>\n            <dd>The school year of the approved schedule (2014-15)</dd>\n            <dt>[SCHEDULE_CLOSE_DATE]</dt>\n            <dd>The schedule close date of the school year of the approved schedule (August 15)</dd>\n            <dt>[SCHOOL_YEAR_START_DATE]</dt>\n            <dd>The start date of the school year of the approved schedule (September 3)</dd>\n          </dl>',1,'2021-11-29 17:45:06'),('scheduleApprovedEmail2ndSem','Schedules','2nd Semester Schedule Approved Email Content','HTML','<p>Hi [PARENT],</p>\n\n<p>Well done! [STUDENT]\'s [SCHOOL_YEAR] <strong>2nd semester Schedule</strong> has been approved. You can review it at any time in your <a href=\"http://mytechhigh.com/infocenter\" target=\"_blank\">InfoCenter account</a>.</p>\n\n<p>Please contact us at help@mytechhigh.com if you have any questions.</p>\n\n<p>Thanks!</p>\n\n<p>My Tech High</p>\n\n<p>*This is just a test, please disregard if you receive this email* - MTH</p>\n','<dl><dt>[PARENT]</dt>\n            <dd>Parent\'s first name</dd>\n            <dt>[STUDENT]</dt>\n            <dd>Student\'s first name</dd>\n            <dt>[SCHOOL_YEAR]</dt>\n            <dd>The school year of the approved schedule (2014-15)</dd>\n          </dl>',1,'2021-11-29 17:45:06'),('scheduleApprovedEmailSubject','Schedules','Schedule Approved Email Subject','Text','[STUDENT]&#039;s [SCHOOL_YEAR] My Tech High Schedule Approved','',1,'2021-11-29 17:45:06'),('scheduleApprovedEmailSubject2ndSem','Schedules','2nd Semester Schedule Approved Email Subject','Text','[STUDENT]&#039;s [SCHOOL_YEAR] 2nd  Semester My Tech High Schedule Approved','',1,'2021-11-29 17:45:06'),('schedulebcc','Schedules','Email BCC','Text','help@mytechhigh.com, admin@mytechhigh.com, kparkinson@mytechhigh.com, kelly@mytechhigh.com, madisen@mytechhigh.com, julie@mytechhigh.com','<p>Send an email copy to this email address</p>',1,'2021-07-28 16:19:00'),('scheduleChangeEmail','Schedules','Change Schedule Email Content','HTML','<p>Hi [PARENT],</p>\n\n<p>Thank you for submitting [STUDENT]\'s [SCHOOL_YEAR] Schedule. We need the following information before it can be approved:</p>\n\n<p>[PERIOD_LIST]</p>\n\n<p>Please use the link below to update the schedule and then resubmit it for approval:<br />\n[LINK]</p>\n\n<p>Let us know if you have any questions by contacting Amy at admin@mytechhigh.com. We\'re happy to help however we can.</p>\n\n<p>Thanks!<br />\nMy Tech High</p>\n\n<p>*This is just a test, please disregard if you receive this email* - MTH</p>\n','<dl><dt>[PARENT]</dt>\n            <dd>Parent\'s first name</dd>\n            <dt>[STUDENT]</dt>\n            <dd>Student\'s first name</dd>\n            <dt>[SCHOOL_YEAR]</dt>\n            <dd>The school year of the approved schedule (2014-15)</dd>\n            <dt>[PERIOD_LIST]</dt>\n            <dd>The list of periods that need to be changed</dd>\n            <dt>[LINK]</dt>\n            <dd>The link to the student\'s editable schedule</dd>\n          </dl>',1,'2021-11-29 17:45:06'),('scheduleChangeEmailSubject','Schedules','Change Schedule Email Subject','Text','Updates needed for [STUDENT]&#039;s My Tech High schedule','',1,'2021-11-29 17:45:06'),('scheduleStatus-0-content','scheduleBulk','Started Schedules Email Content','HTML','<p>[PARENT],</p>\n\n<p>We are excited to have you participate in the My Tech High program. Please submit [STUDENT]\'s [SCHOOL_YEAR] by July 31 to remain enrolled.</p>\n\n<p>If you have any, please email us at help@mytechhigh.com.</p>\n\n<p>Thanks!</p>\n\n<p>My Tech High</p>\n','<p>Changeable Options for email content and subject</p>\n          <dl><dt>[PARENT]</dt>\n          <dd>Parent\'s first name</dd>\n          <dt>[STUDENT]</dt>\n          <dd>Student\'s first name</dd>\n          <dt>[SCHOOL_YEAR]</dt>\n          <dd>The school year of the schedule (2021-22)</dd>\n          <dt>[LINK]</dt>\n          <dd>The link to the student\'s editable schedule</dd>\n          </dl>',1,'2021-06-30 13:32:02'),('scheduleStatus-0-subject','scheduleBulk','Started Schedules Email Subject','Text','[STUDENT]&#039;s [SCHOOL_YEAR] Schedule due July 31','',1,'2021-06-30 13:32:02'),('scheduleStatus-1-content','scheduleBulk','Submitted Schedules Email Content','HTML','<p>[PARENT],</p>\n\n<p>We are excited to have [STUDENT] participate in the My Tech High program and appreciate you submitted [STUDENT]\'s schedule. We are working hard to process schedules and once the schedule is approved, we will send an email. Thanks for your patience and understanding!</p>\n\n<p>If you have any, please email us at help@mytechhigh.com.</p>\n\n<p>Thanks!</p>\n\n<p>My Tech High</p>\n','<p>Changeable Options for email content and subject</p>\n          <dl><dt>[PARENT]</dt>\n          <dd>Parent\'s first name</dd>\n          <dt>[STUDENT]</dt>\n          <dd>Student\'s first name</dd>\n          <dt>[SCHOOL_YEAR]</dt>\n          <dd>The school year of the schedule (2021-22)</dd>\n          <dt>[LINK]</dt>\n          <dd>The link to the student\'s editable schedule</dd>\n          </dl>',1,'2021-06-30 13:32:02'),('scheduleStatus-1-subject','scheduleBulk','Submitted Schedules Email Subject','Text','[SCHOOL_YEAR] Schedule','',1,'2021-06-29 15:22:30'),('scheduleStatus-3-content','scheduleBulk','Updates required Schedules Email Content','HTML','<p>[PARENT],</p>\n\n<p>We are excited to have you participate in the My Tech High program. Please update [STUDENT]s [SCHOOL_YEAR] by July 31 to remain enrolled. The below Period(s) needs to be changed.</p>\n\n<p>[PERIOD_LIST] - The list of periods that need to be changed (This should be used in Updates Required and Unlocked templated only)</p>\n\n<p>[LINK] - Link to studentâ€™s edible schedule</p>\n\n<p>If you have any, please email us at help@mytechhigh.com.</p>\n\n<p>Thanks!</p>\n\n<p>My Tech High</p>\n','<p>Changeable Options for email content and subject</p>\n          <dl><dt>[PARENT]</dt>\n          <dd>Parent\'s first name</dd>\n          <dt>[STUDENT]</dt>\n          <dd>Student\'s first name</dd>\n          <dt>[SCHOOL_YEAR]</dt>\n          <dd>The school year of the schedule (2021-22)</dd>\n          <dt>[LINK]</dt>\n          <dd>The link to the student\'s editable schedule</dd>\n          <dt>[PERIOD_LIST]</dt>\n          <dd>The list of periods that need to be changed</dd>\n          </dl>',1,'2021-06-30 13:32:02'),('scheduleStatus-3-subject','scheduleBulk','Updates required Schedules Email Subject','Text','[STUDENT]&#039;s [SCHOOL_YEAR] Schedule Needs to be Resubmitted','',1,'2021-06-30 13:32:02'),('scheduleStatus-4-content','scheduleBulk','Resubmitted Schedules Email Content','HTML','<p>[PARENT],Â </p>\n\n<p>We are excited to have [STUDENT] participate in the My Tech High program and appreciate you submitted [STUDENT]\'s schedule. We are working hard to process schedules and once the schedule is approved, we will send an email. Thanks for your patience and understanding!</p>\n\n<p>If you have any, please email us at help@mytechhigh.com.</p>\n\n<p>Â </p>\n\n<p>Thanks!</p>\n\n<p>My Tech High</p>\n','<p>Changeable Options for email content and subject</p>\n          <dl><dt>[PARENT]</dt>\n          <dd>Parent\'s first name</dd>\n          <dt>[STUDENT]</dt>\n          <dd>Student\'s first name</dd>\n          <dt>[SCHOOL_YEAR]</dt>\n          <dd>The school year of the schedule (2021-22)</dd>\n          <dt>[LINK]</dt>\n          <dd>The link to the student\'s editable schedule</dd>\n          </dl>',1,'2021-06-30 13:32:02'),('scheduleStatus-4-subject','scheduleBulk','Resubmitted Schedules Email Subject','Text','[SCHOOL_YEAR] Schedule','',1,'2021-06-30 13:32:02'),('scheduleStatus-5-content','scheduleBulk','Unlocked Schedules Email Content','HTML','<p>[PARENT],</p>\n\n<p>We are excited to have you participate in the My Tech High program. Please update [STUDENT]\'s [SCHOOL_YEAR] by July 31 to remain enrolled. The below Period(s) needs to be changed.</p>\n\n<p>[PERIOD_LIST] - The list of periods that need to be changed (This should be used in Updates Required and Unlocked templated only)</p>\n\n<p>[LINK] - Link to studentâ€™s edible schedule</p>\n\n<p>If you have any, please email us at help@mytechhigh.com.</p>\n\n<p>Thanks!</p>\n\n<p>My Tech High</p>\n','<p>Changeable Options for email content and subject</p>\n          <dl><dt>[PARENT]</dt>\n          <dd>Parent\'s first name</dd>\n          <dt>[STUDENT]</dt>\n          <dd>Student\'s first name</dd>\n          <dt>[SCHOOL_YEAR]</dt>\n          <dd>The school year of the schedule (2021-22)</dd>\n          <dt>[LINK]</dt>\n          <dd>The link to the student\'s editable schedule</dd>\n          <dt>[PERIOD_LIST]</dt>\n          <dd>The list of periods that need to be changed</dd>\n          </dl>',1,'2021-06-30 13:32:02'),('scheduleStatus-5-subject','scheduleBulk','Unlocked Schedules Email Subject','Text','[STUDENT]&#039;s [SCHOOL_YEAR] Schedule Needs to be Resubmitted','',1,'2021-06-30 13:32:02'),('scheduleStatus-not_started-content','scheduleBulk','Not Started Schedules Email Content','HTML','<p>[PARENT],</p>\n\n<p>We are excited to have you participate in the My Tech High program. Please submit [STUDENT]\'s [SCHOOL_YEAR] by July 31 to remain enrolled.</p>\n\n<p>If you have any, please email us at help@mytechhigh.com.</p>\n\n<p>Thanks!</p>\n\n<p>My Tech High</p>\n','<p>Changeable Options for email content and subject</p>\n          <dl><dt>[PARENT]</dt>\n          <dd>Parent\'s first name</dd>\n          <dt>[STUDENT]</dt>\n          <dd>Student\'s first name</dd>\n          <dt>[SCHOOL_YEAR]</dt>\n          <dd>The school year of the schedule (2021-22)</dd>\n          <dt>[LINK]</dt>\n          <dd>The link to the student\'s editable schedule</dd>\n          </dl>',1,'2021-06-30 13:32:01'),('scheduleStatus-not_started-subject','scheduleBulk','Not Started Schedules Email Subject','Text','[STUDENT]&#039;s [SCHOOL_YEAR] Schedule due July 31','',1,'2021-06-30 13:32:01'),('scheduleUnlockEmail','Schedules','Unlock Schedule Email Content','HTML','<p>Hi [PARENT],</p>\n\n<p>You may now login to your account at <a href=\"http://mytechhigh.com/infocenter\" target=\"_blank\">mytechhigh.com/infocenter</a> to make changes to [STUDENT]\'s:</p>\n\n<p>[PERIOD_LIST]</p>\n\n<p>Note that you\'ll need to both update AND resubmit the schedule so it can be reviewed.</p>\n\n<p>Thanks!<br />\nMy Tech High</p>\n\n<p>*This is just a test, please disregard if you receive this email* - MTH</p>\n','<dl><dt>[PARENT]</dt>\n            <dd>Parent\'s first name</dd>\n            <dt>[STUDENT]</dt>\n            <dd>Student\'s first name</dd>\n            <dt>[SCHOOL_YEAR]</dt>\n            <dd>The school year of the approved schedule (2014-15)</dd>\n            <dt>[PERIOD_LIST]</dt>\n            <dd>The list of periods that can be changed</dd>\n            <dt>[LINK]</dt>\n            <dd>The link to the student\'s editable schedule</dd>\n          </dl>',1,'2021-11-29 17:45:06'),('scheduleUnlockEmailSubject','Schedules','Unlock Schedule Email Subject','Text','Schedule unlocked for changes','',1,'2020-07-08 18:53:06'),('scheduleUnlockFor2ndSemEmail','Schedules','Unlock Schedule for 2nd Semester Email Content','HTML','<p>Hi [PARENT],</p>\n\n<p>You may login to your <a href=\"http://mytechhigh.com/infocenter\" target=\"_blank\">InfoCenter account</a>Â to make updates to [STUDENT]\'s schedule for the 2nd Semester. Note that <strong>the last day to do this is Friday, November 26Â (Sample date only).</strong></p>\n\n<p><strong>Â QA TEST [DEADLINE]</strong></p>\n\n<p>[SCHOOL_YEAR]</p>\n\n<p>Thanks!<br />\nMy Tech High</p>\n\n<p>*This is just a test, please disregard if you receive this email* - MTH</p>\n','<dl><dt>[PARENT]</dt>\n            <dd>Parent\'s first name</dd>\n            <dt>[STUDENT]</dt>\n            <dd>Student\'s first name</dd>\n            <dt>[DEADLINE]</dt>\n            <dd>The deadline is the 2nd Semester Schedule Submission End Date.</dd>\n            <dt>[SCHOOL_YEAR]</dt>\n            <dd>The school year of the schedule (2014-15)</dd>\n          </dl>',1,'2021-11-29 17:45:06'),('scheduleUnlockFor2ndSemEmailSubject','Schedules','Unlock Schedule for 2nd Semester Email Subject','Text','Unlock: 2nd Semester Schedule Updates Available [DEADLINE]','',1,'2021-11-29 15:22:21'),('sent_to_dropbox_student_ids-2015-16','transfer_withdrawals',NULL,'RAW','a:0:{}',NULL,0,'2020-06-19 17:21:54'),('sent_to_dropbox_student_ids-2017-18','transfer_withdrawals',NULL,'RAW','a:1070:{i:0;i:9034;i:1;i:1111;i:2;i:1300;i:3;i:2579;i:4;i:2554;i:5;i:1408;i:6;i:1410;i:7;i:5200;i:8;i:1431;i:9;i:1560;i:10;i:1601;i:11;i:5813;i:12;i:910;i:13;i:6124;i:14;i:4553;i:15;i:3078;i:16;i:920;i:17;i:4368;i:18;i:4369;i:19;i:3287;i:20;i:5083;i:21;i:1770;i:22;i:924;i:23;i:5072;i:24;i:926;i:25;i:4485;i:26;i:4484;i:27;i:5661;i:28;i:4043;i:29;i:2674;i:30;i:2661;i:31;i:2662;i:32;i:4432;i:33;i:4503;i:34;i:4433;i:35;i:934;i:36;i:935;i:37;i:4094;i:38;i:2982;i:39;i:4802;i:40;i:4776;i:41;i:6265;i:42;i:939;i:43;i:941;i:44;i:1761;i:45;i:6098;i:46;i:1354;i:47;i:3627;i:48;i:2403;i:49;i:6903;i:50;i:6848;i:51;i:6849;i:52;i:2859;i:53;i:2860;i:54;i:2861;i:55;i:2862;i:56;i:5928;i:57;i:943;i:58;i:2012;i:59;i:5029;i:60;i:5030;i:61;i:3434;i:62;i:3433;i:63;i:6415;i:64;i:6416;i:65;i:6418;i:66;i:6417;i:67;i:2983;i:68;i:5836;i:69;i:1787;i:70;i:4186;i:71;i:4703;i:72;i:5800;i:73;i:3427;i:74;i:6366;i:75;i:4708;i:76;i:4707;i:77;i:4706;i:78;i:954;i:79;i:956;i:80;i:7116;i:81;i:7117;i:82;i:6047;i:83;i:4501;i:84;i:4277;i:85;i:5875;i:86;i:4502;i:87;i:5303;i:88;i:4889;i:89;i:7537;i:90;i:2331;i:91;i:961;i:92;i:962;i:93;i:4236;i:94;i:963;i:95;i:966;i:96;i:1636;i:97;i:4746;i:98;i:4747;i:99;i:4744;i:100;i:4743;i:101;i:4745;i:102;i:7661;i:103;i:7660;i:104;i:4169;i:105;i:2601;i:106;i:6979;i:107;i:6064;i:108;i:6066;i:109;i:5266;i:110;i:7228;i:111;i:7227;i:112;i:5211;i:113;i:5212;i:114;i:5530;i:115;i:5209;i:116;i:6819;i:117;i:3549;i:118;i:2988;i:119;i:3550;i:120;i:6963;i:121;i:6964;i:122;i:6962;i:123;i:5475;i:124;i:5476;i:125;i:4348;i:126;i:4347;i:127;i:4346;i:128;i:3921;i:129;i:5712;i:130;i:3923;i:131;i:3922;i:132;i:3924;i:133;i:4297;i:134;i:5890;i:135;i:4435;i:136;i:5458;i:137;i:2707;i:138;i:2708;i:139;i:3889;i:140;i:3478;i:141;i:4730;i:142;i:1814;i:143;i:1816;i:144;i:1815;i:145;i:3500;i:146;i:3347;i:147;i:1819;i:148;i:2622;i:149;i:6364;i:150;i:4185;i:151;i:987;i:152;i:988;i:153;i:4705;i:154;i:3117;i:155;i:7706;i:156;i:989;i:157;i:990;i:158;i:6786;i:159;i:2992;i:160;i:3492;i:161;i:3337;i:162;i:3336;i:163;i:3972;i:164;i:4285;i:165;i:4283;i:166;i:6071;i:167;i:5257;i:168;i:1827;i:169;i:5424;i:170;i:5425;i:171;i:7178;i:172;i:6222;i:173;i:6971;i:174;i:998;i:175;i:6970;i:176;i:6223;i:177;i:6972;i:178;i:1001;i:179;i:6347;i:180;i:6346;i:181;i:6345;i:182;i:5865;i:183;i:5866;i:184;i:1831;i:185;i:1830;i:186;i:7631;i:187;i:6165;i:188;i:6164;i:189;i:6163;i:190;i:3888;i:191;i:1021;i:192;i:1022;i:193;i:6401;i:194;i:6400;i:195;i:4904;i:196;i:4905;i:197;i:4903;i:198;i:5810;i:199;i:4675;i:200;i:4676;i:201;i:4674;i:202;i:1646;i:203;i:1834;i:204;i:3628;i:205;i:7583;i:206;i:7083;i:207;i:6806;i:208;i:6950;i:209;i:7084;i:210;i:6949;i:211;i:1030;i:212;i:6891;i:213;i:1034;i:214;i:2273;i:215;i:6186;i:216;i:7270;i:217;i:7272;i:218;i:6187;i:219;i:7274;i:220;i:7275;i:221;i:7273;i:222;i:7271;i:223;i:1037;i:224;i:3672;i:225;i:3671;i:226;i:5744;i:227;i:5745;i:228;i:1849;i:229;i:1848;i:230;i:1846;i:231;i:1847;i:232;i:5196;i:233;i:6883;i:234;i:6881;i:235;i:6882;i:236;i:5197;i:237;i:6880;i:238;i:5729;i:239;i:5198;i:240;i:2560;i:241;i:6674;i:242;i:9034;i:243;i:4350;i:244;i:4349;i:245;i:4351;i:246;i:7503;i:247;i:7161;i:248;i:7162;i:249;i:4779;i:250;i:6312;i:251;i:4778;i:252;i:5368;i:253;i:5732;i:254;i:2564;i:255;i:6385;i:256;i:6386;i:257;i:6230;i:258;i:1055;i:259;i:1058;i:260;i:1059;i:261;i:7049;i:262;i:1708;i:263;i:7100;i:264;i:7098;i:265;i:7099;i:266;i:1895;i:267;i:1896;i:268;i:6668;i:269;i:3973;i:270;i:4476;i:271;i:1097;i:272;i:1661;i:273;i:1099;i:274;i:1100;i:275;i:4027;i:276;i:7330;i:277;i:5376;i:278;i:3045;i:279;i:6932;i:280;i:6553;i:281;i:6554;i:282;i:5515;i:283;i:5517;i:284;i:5516;i:285;i:3574;i:286;i:3573;i:287;i:1902;i:288;i:1901;i:289;i:6928;i:290;i:6927;i:291;i:3741;i:292;i:1104;i:293;i:5265;i:294;i:4278;i:295;i:4258;i:296;i:4259;i:297;i:1110;i:298;i:3895;i:299;i:4341;i:300;i:4340;i:301;i:4339;i:302;i:4342;i:303;i:5563;i:304;i:4577;i:305;i:4578;i:306;i:4579;i:307;i:6449;i:308;i:7441;i:309;i:3796;i:310;i:6448;i:311;i:7113;i:312;i:6682;i:313;i:6681;i:314;i:3507;i:315;i:2430;i:316;i:3835;i:317;i:2429;i:318;i:1138;i:319;i:1140;i:320;i:1665;i:321;i:6665;i:322;i:6677;i:323;i:6664;i:324;i:6663;i:325;i:5109;i:326;i:1666;i:327;i:1143;i:328;i:2841;i:329;i:1146;i:330;i:4519;i:331;i:4518;i:332;i:4517;i:333;i:7215;i:334;i:7214;i:335;i:7213;i:336;i:2625;i:337;i:2626;i:338;i:2316;i:339;i:2317;i:340;i:5598;i:341;i:6460;i:342;i:1156;i:343;i:6461;i:344;i:5555;i:345;i:1160;i:346;i:1163;i:347;i:1164;i:348;i:3034;i:349;i:6067;i:350;i:2889;i:351;i:1752;i:352;i:2567;i:353;i:1667;i:354;i:1668;i:355;i:2608;i:356;i:6909;i:357;i:5978;i:358;i:4595;i:359;i:4597;i:360;i:7223;i:361;i:6704;i:362;i:4594;i:363;i:6910;i:364;i:4596;i:365;i:4291;i:366;i:4290;i:367;i:1177;i:368;i:7242;i:369;i:4403;i:370;i:4405;i:371;i:4404;i:372;i:3003;i:373;i:1193;i:374;i:7035;i:375;i:1944;i:376;i:3630;i:377;i:1362;i:378;i:4649;i:379;i:4650;i:380;i:1196;i:381;i:1198;i:382;i:6670;i:383;i:6150;i:384;i:6148;i:385;i:6145;i:386;i:6149;i:387;i:6146;i:388;i:6147;i:389;i:5676;i:390;i:1202;i:391;i:1203;i:392;i:6482;i:393;i:6483;i:394;i:6654;i:395;i:6652;i:396;i:6653;i:397;i:4480;i:398;i:4479;i:399;i:4481;i:400;i:4768;i:401;i:4023;i:402;i:4769;i:403;i:4770;i:404;i:3006;i:405;i:4022;i:406;i:6321;i:407;i:6322;i:408;i:2330;i:409;i:2605;i:410;i:4818;i:411;i:6795;i:412;i:6794;i:413;i:6775;i:414;i:1226;i:415;i:6134;i:416;i:6135;i:417;i:4867;i:418;i:4866;i:419;i:4865;i:420;i:7339;i:421;i:7530;i:422;i:7528;i:423;i:7531;i:424;i:7529;i:425;i:4739;i:426;i:1228;i:427;i:1231;i:428;i:5611;i:429;i:5612;i:430;i:5613;i:431;i:2452;i:432;i:1234;i:433;i:6722;i:434;i:1237;i:435;i:7298;i:436;i:1239;i:437;i:1240;i:438;i:3884;i:439;i:4583;i:440;i:6471;i:441;i:3709;i:442;i:1242;i:443;i:6474;i:444;i:4584;i:445;i:4036;i:446;i:6472;i:447;i:6473;i:448;i:1684;i:449;i:4582;i:450;i:3850;i:451;i:4760;i:452;i:3849;i:453;i:6068;i:454;i:4251;i:455;i:3985;i:456;i:3986;i:457;i:3879;i:458;i:5454;i:459;i:5452;i:460;i:5451;i:461;i:4318;i:462;i:3403;i:463;i:4689;i:464;i:4690;i:465;i:6952;i:466;i:4688;i:467;i:6539;i:468;i:6878;i:469;i:4601;i:470;i:4603;i:471;i:4602;i:472;i:5323;i:473;i:3007;i:474;i:7612;i:475;i:7611;i:476;i:2769;i:477;i:2770;i:478;i:5622;i:479;i:6185;i:480;i:5076;i:481;i:4333;i:482;i:4332;i:483;i:4331;i:484;i:5077;i:485;i:4643;i:486;i:4622;i:487;i:6620;i:488;i:4621;i:489;i:5308;i:490;i:4504;i:491;i:5682;i:492;i:1971;i:493;i:7614;i:494;i:3631;i:495;i:5118;i:496;i:7613;i:497;i:5050;i:498;i:6586;i:499;i:5049;i:500;i:4313;i:501;i:4314;i:502;i:5427;i:503;i:1268;i:504;i:3480;i:505;i:1270;i:506;i:1271;i:507;i:1272;i:508;i:1273;i:509;i:2485;i:510;i:4013;i:511;i:6358;i:512;i:6623;i:513;i:1275;i:514;i:3517;i:515;i:6361;i:516;i:4379;i:517;i:4378;i:518;i:2727;i:519;i:4442;i:520;i:4443;i:521;i:1691;i:522;i:1284;i:523;i:1285;i:524;i:5640;i:525;i:5723;i:526;i:5722;i:527;i:6116;i:528;i:6115;i:529;i:6561;i:530;i:6560;i:531;i:6562;i:532;i:6559;i:533;i:1288;i:534;i:1290;i:535;i:5051;i:536;i:5053;i:537;i:5054;i:538;i:5052;i:539;i:3382;i:540;i:1291;i:541;i:1294;i:542;i:3931;i:543;i:3587;i:544;i:6367;i:545;i:4469;i:546;i:4468;i:547;i:4470;i:548;i:1298;i:549;i:3790;i:550;i:1988;i:551;i:3010;i:552;i:1989;i:553;i:6918;i:554;i:6919;i:555;i:1304;i:556;i:1305;i:557;i:2578;i:558;i:1308;i:559;i:6444;i:560;i:1310;i:561;i:1696;i:562;i:5909;i:563;i:1311;i:564;i:5910;i:565;i:5768;i:566;i:2878;i:567;i:7412;i:568;i:7413;i:569;i:7197;i:570;i:4618;i:571;i:4617;i:572;i:7644;i:573;i:5690;i:574;i:3272;i:575;i:3273;i:576;i:6793;i:577;i:6535;i:578;i:6533;i:579;i:6532;i:580;i:6534;i:581;i:3990;i:582;i:3989;i:583;i:6702;i:584;i:6701;i:585;i:5325;i:586;i:5891;i:587;i:7295;i:588;i:7294;i:589;i:4505;i:590;i:4506;i:591;i:5846;i:592;i:6183;i:593;i:6083;i:594;i:2008;i:595;i:6991;i:596;i:6201;i:597;i:7155;i:598;i:6302;i:599;i:6301;i:600;i:1325;i:601;i:6010;i:602;i:6011;i:603;i:2613;i:604;i:1976;i:605;i:5457;i:606;i:6658;i:607;i:6659;i:608;i:4219;i:609;i:5674;i:610;i:5673;i:611;i:4218;i:612;i:4217;i:613;i:4135;i:614;i:4136;i:615;i:6896;i:616;i:3016;i:617;i:5258;i:618;i:6857;i:619;i:3963;i:620;i:2018;i:621;i:3707;i:622;i:1336;i:623;i:1337;i:624;i:3899;i:625;i:1340;i:626;i:6734;i:627;i:4273;i:628;i:7591;i:629;i:2553;i:630;i:3107;i:631;i:3108;i:632;i:3109;i:633;i:7696;i:634;i:4233;i:635;i:4365;i:636;i:6577;i:637;i:2310;i:638;i:2312;i:639;i:1375;i:640;i:4282;i:641;i:4270;i:642;i:4281;i:643;i:2408;i:644;i:6151;i:645;i:2034;i:646;i:4482;i:647;i:2723;i:648;i:1380;i:649;i:1382;i:650;i:2978;i:651;i:3603;i:652;i:1384;i:653;i:1385;i:654;i:4113;i:655;i:1392;i:656;i:5401;i:657;i:6902;i:658;i:6240;i:659;i:2445;i:660;i:2443;i:661;i:2643;i:662;i:6624;i:663;i:4390;i:664;i:4389;i:665;i:4387;i:666;i:4388;i:667;i:5833;i:668;i:3633;i:669;i:3893;i:670;i:2046;i:671;i:3894;i:672;i:3811;i:673;i:3812;i:674;i:4416;i:675;i:4415;i:676;i:4381;i:677;i:3783;i:678;i:1404;i:679;i:3314;i:680;i:5861;i:681;i:5863;i:682;i:5862;i:683;i:5864;i:684;i:2053;i:685;i:5882;i:686;i:5883;i:687;i:5880;i:688;i:2052;i:689;i:4067;i:690;i:4068;i:691;i:4066;i:692;i:4303;i:693;i:4362;i:694;i:4807;i:695;i:3446;i:696;i:5989;i:697;i:3447;i:698;i:5701;i:699;i:5702;i:700;i:3903;i:701;i:1412;i:702;i:1413;i:703;i:1716;i:704;i:1415;i:705;i:1418;i:706;i:1428;i:707;i:1429;i:708;i:6958;i:709;i:2952;i:710;i:7299;i:711;i:5687;i:712;i:5688;i:713;i:5225;i:714;i:5226;i:715;i:6438;i:716;i:7114;i:717;i:7115;i:718;i:6277;i:719;i:6276;i:720;i:2462;i:721;i:4660;i:722;i:7557;i:723;i:4977;i:724;i:4979;i:725;i:7508;i:726;i:7509;i:727;i:3723;i:728;i:3724;i:729;i:2247;i:730;i:7319;i:731;i:7437;i:732;i:1440;i:733;i:3475;i:734;i:1441;i:735;i:1442;i:736;i:4813;i:737;i:6168;i:738;i:5850;i:739;i:7011;i:740;i:3669;i:741;i:5930;i:742;i:5929;i:743;i:2078;i:744;i:2077;i:745;i:5837;i:746;i:7401;i:747;i:2323;i:748;i:5748;i:749;i:5746;i:750;i:5747;i:751;i:1463;i:752;i:1464;i:753;i:1722;i:754;i:6853;i:755;i:6852;i:756;i:5501;i:757;i:5502;i:758;i:5503;i:759;i:6326;i:760;i:6327;i:761;i:5869;i:762;i:2242;i:763;i:2241;i:764;i:2243;i:765;i:1470;i:766;i:6522;i:767;i:2629;i:768;i:4767;i:769;i:3634;i:770;i:2212;i:771;i:7476;i:772;i:2213;i:773;i:6633;i:774;i:6632;i:775;i:5599;i:776;i:5600;i:777;i:3901;i:778;i:3806;i:779;i:5960;i:780;i:3805;i:781;i:1704;i:782;i:1355;i:783;i:1482;i:784;i:1483;i:785;i:1484;i:786;i:5953;i:787;i:5952;i:788;i:5818;i:789;i:5819;i:790;i:3504;i:791;i:1488;i:792;i:6649;i:793;i:3546;i:794;i:3545;i:795;i:4384;i:796;i:4385;i:797;i:4755;i:798;i:4451;i:799;i:4450;i:800;i:4756;i:801;i:2536;i:802;i:5021;i:803;i:1493;i:804;i:1494;i:805;i:1495;i:806;i:2101;i:807;i:2103;i:808;i:4735;i:809;i:6510;i:810;i:5234;i:811;i:5235;i:812;i:6429;i:813;i:3023;i:814;i:6170;i:815;i:1501;i:816;i:1502;i:817;i:1504;i:818;i:5579;i:819;i:5273;i:820;i:5272;i:821;i:5799;i:822;i:7438;i:823;i:5043;i:824;i:5044;i:825;i:2349;i:826;i:1513;i:827;i:1514;i:828;i:3731;i:829;i:5957;i:830;i:2115;i:831;i:2116;i:832;i:1729;i:833;i:3559;i:834;i:1516;i:835;i:3093;i:836;i:3094;i:837;i:5787;i:838;i:4531;i:839;i:5558;i:840;i:7043;i:841;i:3128;i:842;i:3024;i:843;i:3127;i:844;i:3126;i:845;i:1523;i:846;i:3836;i:847;i:1526;i:848;i:3042;i:849;i:4741;i:850;i:5926;i:851;i:1529;i:852;i:2533;i:853;i:6933;i:854;i:2532;i:855;i:6934;i:856;i:5961;i:857;i:2135;i:858;i:2133;i:859;i:2134;i:860;i:5488;i:861;i:5924;i:862;i:5487;i:863;i:4143;i:864;i:6090;i:865;i:4144;i:866;i:1364;i:867;i:7345;i:868;i:4636;i:869;i:6136;i:870;i:5705;i:871;i:5199;i:872;i:3751;i:873;i:3588;i:874;i:2144;i:875;i:2145;i:876;i:6839;i:877;i:6840;i:878;i:5252;i:879;i:5651;i:880;i:5650;i:881;i:5652;i:882;i:4969;i:883;i:6042;i:884;i:6303;i:885;i:2155;i:886;i:5945;i:887;i:5943;i:888;i:1738;i:889;i:4232;i:890;i:4717;i:891;i:4008;i:892;i:4173;i:893;i:1350;i:894;i:4408;i:895;i:4235;i:896;i:1557;i:897;i:1558;i:898;i:2638;i:899;i:7517;i:900;i:2639;i:901;i:5699;i:902;i:4456;i:903;i:5603;i:904;i:3934;i:905;i:2736;i:906;i:5959;i:907;i:3882;i:908;i:5343;i:909;i:3241;i:910;i:2173;i:911;i:3242;i:912;i:7568;i:913;i:2230;i:914;i:2229;i:915;i:2228;i:916;i:6097;i:917;i:5275;i:918;i:5277;i:919;i:5276;i:920;i:4630;i:921;i:4631;i:922;i:4629;i:923;i:5227;i:924;i:5228;i:925;i:5229;i:926;i:2396;i:927;i:2395;i:928;i:2394;i:929;i:3680;i:930;i:6541;i:931;i:3489;i:932;i:6543;i:933;i:3490;i:934;i:3679;i:935;i:3032;i:936;i:6542;i:937;i:6544;i:938;i:3491;i:939;i:3678;i:940;i:6264;i:941;i:4664;i:942;i:4663;i:943;i:5949;i:944;i:2181;i:945;i:2180;i:946;i:5938;i:947;i:2179;i:948;i:6084;i:949;i:1590;i:950;i:5992;i:951;i:2844;i:952;i:5689;i:953;i:1591;i:954;i:1592;i:955;i:1593;i:956;i:1589;i:957;i:2630;i:958;i:2843;i:959;i:2845;i:960;i:4598;i:961;i:2832;i:962;i:2830;i:963;i:1594;i:964;i:2831;i:965;i:1596;i:966;i:1600;i:967;i:5715;i:968;i:7095;i:969;i:6285;i:970;i:2468;i:971;i:2467;i:972;i:6255;i:973;i:2466;i:974;i:6728;i:975;i:6935;i:976;i:6755;i:977;i:1608;i:978;i:1609;i:979;i:3683;i:980;i:6772;i:981;i:6812;i:982;i:3311;i:983;i:3312;i:984;i:6908;i:985;i:6907;i:986;i:5940;i:987;i:4610;i:988;i:7581;i:989;i:7582;i:990;i:4179;i:991;i:4181;i:992;i:4182;i:993;i:1755;i:994;i:1622;i:995;i:3131;i:996;i:7340;i:997;i:3130;i:998;i:1756;i:999;i:1629;i:1000;i:3945;i:1001;i:1865;i:1002;i:6235;i:1003;i:6234;i:1004;i:5791;i:1005;i:5666;i:1006;i:4183;i:1007;i:4184;i:1008;i:3644;i:1009;i:5764;i:1010;i:5766;i:1011;i:6315;i:1012;i:5765;i:1013;i:2816;i:1014;i:3465;i:1015;i:1070;i:1016;i:6082;i:1017;i:6080;i:1018;i:6081;i:1019;i:5180;i:1020;i:5179;i:1021;i:5176;i:1022;i:4694;i:1023;i:3119;i:1024;i:2298;i:1025;i:4294;i:1026;i:1876;i:1027;i:7040;i:1028;i:1076;i:1029;i:6111;i:1030;i:6731;i:1031;i:6733;i:1032;i:4406;i:1033;i:5664;i:1034;i:5665;i:1035;i:1081;i:1036;i:5811;i:1037;i:6450;i:1038;i:2998;i:1039;i:2999;i:1040;i:1659;i:1041;i:6686;i:1042;i:7548;i:1043;i:5706;i:1044;i:6557;i:1045;i:6558;i:1046;i:4475;i:1047;i:1036;i:1048;i:7050;i:1049;i:6374;i:1050;i:6388;i:1051;i:5942;i:1052;i:7554;i:1053;i:2198;i:1054;i:1036;i:1055;i:2859;i:1056;i:7050;i:1057;i:4517;i:1058;i:6374;i:1059;i:5611;i:1060;i:5612;i:1061;i:5613;i:1062;i:6388;i:1063;i:5942;i:1064;i:6240;i:1065;i:4235;i:1066;i:1557;i:1067;i:1557;i:1068;i:3131;i:1069;i:1557;}',NULL,0,'2017-09-20 10:22:53'),('sent_to_dropbox_student_ids-2018-19','transfer_withdrawals',NULL,'RAW','a:229:{i:0;i:12797;i:1;i:9718;i:2;i:4991;i:3;i:4535;i:4;i:7087;i:5;i:8918;i:6;i:7930;i:7;i:7342;i:8;i:3551;i:9;i:10529;i:10;i:9014;i:11;i:5084;i:12;i:6192;i:13;i:1025;i:14;i:7707;i:15;i:9326;i:16;i:8508;i:17;i:9111;i:18;i:5493;i:19;i:7648;i:20;i:1877;i:21;i:7020;i:22;i:5327;i:23;i:1660;i:24;i:9725;i:25;i:8927;i:26;i:6370;i:27;i:7012;i:28;i:9825;i:29;i:9434;i:30;i:1919;i:31;i:2670;i:32;i:8169;i:33;i:10013;i:34;i:9264;i:35;i:9919;i:36;i:10334;i:37;i:9479;i:38;i:10327;i:39;i:8792;i:40;i:9338;i:41;i:9061;i:42;i:9929;i:43;i:8142;i:44;i:8232;i:45;i:9761;i:46;i:8832;i:47;i:10197;i:48;i:9942;i:49;i:2363;i:50;i:8546;i:51;i:6872;i:52;i:10446;i:53;i:4991;i:54;i:1117;i:55;i:9718;i:56;i:9718;i:57;i:9718;i:58;i:4553;i:59;i:3078;i:60;i:4991;i:61;i:3434;i:62;i:4535;i:63;i:7087;i:64;i:8508;i:65;i:8918;i:66;i:7342;i:67;i:965;i:68;i:10529;i:69;i:3551;i:70;i:6192;i:71;i:5857;i:72;i:8207;i:73;i:8205;i:74;i:7707;i:75;i:9326;i:76;i:5084;i:77;i:999;i:78;i:8204;i:79;i:9014;i:80;i:7930;i:81;i:8206;i:82;i:5493;i:83;i:1025;i:84;i:8002;i:85;i:9111;i:86;i:7020;i:87;i:12797;i:88;i:10061;i:89;i:1082;i:90;i:5327;i:91;i:1032;i:92;i:9825;i:93;i:1877;i:94;i:1088;i:95;i:7648;i:96;i:1660;i:97;i:10327;i:98;i:1127;i:99;i:6497;i:100;i:3281;i:101;i:8142;i:102;i:6656;i:103;i:2400;i:104;i:1117;i:105;i:7038;i:106;i:7970;i:107;i:7503;i:108;i:1919;i:109;i:5911;i:110;i:1229;i:111;i:1947;i:112;i:9725;i:113;i:4562;i:114;i:8927;i:115;i:4695;i:116;i:3361;i:117;i:2366;i:118;i:3508;i:119;i:8876;i:120;i:7012;i:121;i:8169;i:122;i:2879;i:123;i:10207;i:124;i:4645;i:125;i:1972;i:126;i:1225;i:127;i:7057;i:128;i:9434;i:129;i:1341;i:130;i:7198;i:131;i:6709;i:132;i:6370;i:133;i:9479;i:134;i:1373;i:135;i:2289;i:136;i:1322;i:137;i:2549;i:138;i:1374;i:139;i:3443;i:140;i:2670;i:141;i:3442;i:142;i:9761;i:143;i:9919;i:144;i:2478;i:145;i:6974;i:146;i:10013;i:147;i:9264;i:148;i:4382;i:149;i:10334;i:150;i:3444;i:151;i:5543;i:152;i:1445;i:153;i:1461;i:154;i:9942;i:155;i:3124;i:156;i:10446;i:157;i:2050;i:158;i:5161;i:159;i:9338;i:160;i:8792;i:161;i:6915;i:162;i:2682;i:163;i:1528;i:164;i:2130;i:165;i:4513;i:166;i:4742;i:167;i:4317;i:168;i:7504;i:169;i:2138;i:170;i:5201;i:171;i:2156;i:172;i:1555;i:173;i:9929;i:174;i:8546;i:175;i:8232;i:176;i:4981;i:177;i:3387;i:178;i:2363;i:179;i:8832;i:180;i:10197;i:181;i:4315;i:182;i:4316;i:183;i:6872;i:184;i:6286;i:185;i:4009;i:186;i:9061;i:187;i:4553;i:188;i:6936;i:189;i:3755;i:190;i:6897;i:191;i:5842;i:192;i:6331;i:193;i:6188;i:194;i:3078;i:195;i:9718;i:196;i:6936;i:197;i:2885;i:198;i:5068;i:199;i:9718;i:200;i:9718;i:201;i:6936;i:202;i:9718;i:203;i:3755;i:204;i:6897;i:205;i:6331;i:206;i:6188;i:207;i:4553;i:208;i:3078;i:209;i:10324;i:210;i:1434;i:211;i:8492;i:212;i:1973;i:213;i:8126;i:214;i:10324;i:215;i:3434;i:216;i:3858;i:217;i:7503;i:218;i:5093;i:219;i:8554;i:220;i:8478;i:221;i:8528;i:222;i:1976;i:223;i:9232;i:224;i:10381;i:225;i:9231;i:226;i:1163;i:227;i:2247;i:228;i:2247;}',NULL,0,'2018-09-05 14:58:44'),('sent_to_dropbox_student_ids-2019-20','transfer_withdrawals',NULL,'RAW','a:0:{}',NULL,0,'2019-06-05 15:33:53'),('sent_to_dropbox_student_ids-2020-21','transfer_withdrawals',NULL,'RAW','a:31:{i:0;i:15400;i:1;i:15457;i:2;i:15400;i:3;i:15458;i:4;i:15459;i:5;i:15445;i:6;i:15445;i:7;i:15445;i:8;i:15413;i:9;i:15413;i:10;i:15413;i:11;i:15413;i:12;i:15610;i:13;i:15606;i:14;i:15656;i:15;i:15553;i:16;i:15562;i:17;i:15413;i:18;i:15606;i:19;i:15606;i:20;i:15411;i:21;i:15553;i:22;i:15413;i:23;i:15562;i:24;i:15641;i:25;i:15470;i:26;i:15569;i:27;i:15536;i:28;i:15471;i:29;i:15410;i:30;i:15569;}',NULL,0,'2021-03-22 17:06:59'),('sent_to_dropbox_student_ids-2021-22','transfer_withdrawals',NULL,'RAW','a:1:{i:0;i:15458;}',NULL,0,'2021-07-19 19:13:54'),('siteEmail','','Site Email','Text','infocenter+staging@mytechhigh.com','The from email address to be used when sending an email',1,'2020-07-30 20:04:45'),('siteName','','Site Name','Text','My Tech High - InfoCenter','The name of the site to be used in the html title and various locations in the site',1,'2020-07-08 18:53:06'),('siteShortName','','Site Short Name','Text','InfoCenter','',1,'2020-07-08 18:53:06'),('SMTPaddress','SMTP','SMTP Email Address','Text','system@mytechhigh.com','<p>The email address to use when sending an email.</p>',1,'2020-07-27 21:35:25'),('SMTPhost','SMTP','SMTP Host','Text','smtp.gmail.com','<p>The SMTP host to use when sending an email</p>',1,'2020-07-08 18:53:06'),('SMTPpassword','SMTP','SMTP Password','Text','making@system2018!','<p>The SMTP password account to use when sending an email</p>',1,'2020-07-08 18:53:06'),('SMTPport','SMTP','SMTP Port','Text','465','<p>The SMTP port to use when sending an email</p>',1,'2020-07-08 18:53:06'),('SMTPsecure','SMTP','SMTP Security Method','Text','ssl','<p>The SMTP security menthod (ssl) to use when sending an email</p>',1,'2020-07-08 18:53:07'),('SMTPuser','SMTP','SMTP User Account','Text','system@mytechhigh.com','<p>The SMTP user account to use when sending an email</p>',1,'2019-04-27 01:35:41'),('stagingafterapplicationverificationcontent','EmailVerification','New Application Email Content','HTML','<p>We have received your application to participate in the My Tech High program.</p>\n\n<p>Please click on the link below within 24 hours to verify your email address and receive additional instructions:</p>\n\n<p>*This is just a test, please disregard if you receive this email* - MTH</p>\n\n<p>Â </p>\n','AWS SES after brand new application is submitted',1,'2021-02-17 16:14:58'),('stagingafterapplicationverificationsubject','EmailVerification','New Application Email Subject','Text','Thank you for submitting an application to the My Tech High program test','',1,'2021-02-17 16:13:32'),('stagingbatchsendoutcontent','EmailVerification','Batch Send Out Content','HTML','<p>Hi, Parents in the 2018-19 My Tech High Program!</p>\n\n<p>As part of our newly-designed Parent Link (which we hope you like!), we are also upgrading our email security system to ensure all Parent Link Announcements and other emails from us are delivered successfully and securely to you.</p>\n\n<p>We take your privacy seriously and will ONLY email you program-related messages.</p>\n\n<p><strong>Action Required by May 8, 2018:</strong><br />\nPlease click on the email security verification link found directly below this message to confirm that this is your correct email to which you want all My Tech High communications sent moving forward.</p>\n\n<p><em>NOTE: If you wish to change your email, please login to InfoCenter, update your email, and then look for a follow-up email verification message.</em></p>\n\n<p>Thanks!</p>\n\n<p>************My Tech High InfoCenter Email Security Verification Link************</p>\n\n<p>*This is just a test, please disregard if you receive this email* - MTH</p>\n','After uploading emails to AWS, send this out to all 2018-19 parents',1,'2021-02-17 16:14:57'),('stagingbatchsendoutsubject','EmailVerification','Batch Send Out Subject','Text','Action Required by May 8: Email Security Verification Update test','',1,'2021-02-17 16:14:57'),('stagingchangeemailverificationcontent','EmailVerification','Email Change Content','HTML','<p>It appears that you have changed your email address in the My Tech High InfoCenter. In order to confirm email security, please click on the link below within 24 hours to verify your new email address:</p>\n\n<p>*This is just a test, please disregard if you receive this email* - MTH</p>\n','',1,'2021-02-17 16:14:57'),('stagingchangeemailverificationsubject','EmailVerification','Email Change Subject','Text','Please verify new InfoCenter email address test','',1,'2021-02-17 16:14:58'),('stagingstageutafterapplicationverificationcontent','EmailVerification','New Application Email Content','HTML','<p>We have received your application to participate in the My Tech High program.</p>\n\n<p>Please click on the link below within 24 hours to verify your email address and receive additional instructions:</p>\n\n<p>*This is just a test, please disregard if you receive this email* - MTH</p>\n\n<p>Â </p>\n','AWS SES after brand new application is submitted',1,'2021-02-17 16:14:58'),('stagingstageutafterapplicationverificationsubject','EmailVerification','New Application Email Subject','Text','Thank you for submitting an application to the My Tech High program! test','',1,'2021-02-17 16:13:32'),('stagingstageutbatchsendoutcontent','EmailVerification','Batch Send Out Content','HTML','<p>Hi, Parents in the 2018-19 My Tech High Program!</p>\n\n<p>As part of our newly-designed Parent Link (which we hope you like!), we are also upgrading our email security system to ensure all Parent Link Announcements and other emails from us are delivered successfully and securely to you.</p>\n\n<p>We take your privacy seriously and will ONLY email you program-related messages.</p>\n\n<p><strong>Action Required by May 8, 2018:</strong><br />\nPlease click on the email security verification link found directly below this message to confirm that this is your correct email to which you want all My Tech High communications sent moving forward.</p>\n\n<p><em>NOTE: If you wish to change your email, please login to InfoCenter, update your email, and then look for a follow-up email verification message.</em></p>\n\n<p>Thanks!</p>\n\n<p>************My Tech High InfoCenter Email Security Verification Link************</p>\n\n<p>*This is just a test, please disregard if you receive this email* - MTH</p>\n','After uploading emails to AWS, send this out to all 2018-19 parents',1,'2021-02-17 16:14:57'),('stagingstageutbatchsendoutsubject','EmailVerification','Batch Send Out Subject','Text','Action Required by May 8: Email Security Verification Update test','',1,'2021-02-17 16:14:57'),('stagingstageutchangeemailverificationcontent','EmailVerification','Email Change Content','HTML','<p>It appears that you have changed your email address in the My Tech High InfoCenter. In order to confirm email security, please click on the link below within 24 hours to verify your new email address:</p>\n\n<p>*This is just a test, please disregard if you receive this email* - MTH</p>\n','',1,'2021-02-17 16:14:58'),('stagingstageutchangeemailverificationsubject','EmailVerification','Email Change Subject','Text','Please verify new InfoCenter email address test','',1,'2021-02-17 16:14:58'),('store_url','mth_wooCommerce',NULL,'Text','https://www.mytechhigh.com/',NULL,0,'2020-07-08 18:53:08'),('Token','Canvas',NULL,'Text','8OzN6eGXmcbCDT8dVmbWgBlO9DQX2SNsTdzLxX3HjzvJy5Rv51wN3uQI55w5y2VT',NULL,0,'2020-07-08 18:53:07'),('unlock_packet','packet_settings','Unlock Enrollment Packet','Bool','1','Enrollment packet will be unlock if the checkbox is check',1,'2021-04-01 09:40:22'),('URL','Canvas',NULL,'Text','https://mytechhigh.test.instructure.com',NULL,0,'2020-07-08 18:53:07'),('URL','Yoda',NULL,'Text','https://staging-yoda.mytechhigh.com',NULL,0,'2020-07-08 18:53:07'),('userLevelNames','User',NULL,'RAW','a:6:{i:1;s:7:\"Student\";i:2;s:6:\"Parent\";i:3;s:7:\"Teacher\";i:10;s:13:\"Administrator\";i:9;s:17:\"Sub Administrator\";i:4;s:17:\"Teacher Assistant\";}',NULL,0,'2020-07-08 18:53:07'),('USPSURL','',NULL,'Text','stg-production.shippingapis.com',NULL,0,'0000-00-00 00:00:00'),('USPSUserID','',NULL,'Text','933SELFE6263',NULL,0,'0000-00-00 00:00:00'),('version','',NULL,'Text','1',NULL,0,'0000-00-00 00:00:00'),('withdrawalConfirmationEmailContent','Withdrawals','Withdrawal Confirmation Email Content','HTML','<p>Hi [PARENT_FIRST],</p>\n\n<p>Attached is a copy of [STUDENT_FIRST]\'s official Withdrawal Letter for your records.</p>\n\n<p>Thanks!</p>\n\n<p>My Tech High</p>\n\n<p>*This is just a test, please disregard if you receive this email* - MTH</p>\n','<p>[PARENT_FIRST] - the parent\'s first name<br />\n              [STUDENT_FIRST] - the student\'s first preferred name</p>',1,'2021-02-16 15:07:32'),('withdrawalConfirmationEmailSubject','Withdrawals',' Withdrawal Confirmation Email Subject','Text','Withdrawal from My Tech High is Complete','<p>Email sent with submitted withdrawal form in PDF format attached</p>',1,'2021-01-08 14:59:26'),('withdrawalNotificationEmailContent','Withdrawals','Withdrawal Email Content','HTML','<p>Hi, [PARENT_FIRST],</p>\n\n<p>Please finalize [STUDENT_FIRST]\'s withdrawal from the My Tech High program by completing the form below today:</p>\n\n<p>[LINK]</p>\n\n<p>Thanks! We wish you well!</p>\n\n<p>My Tech High</p>\n\n<p>*This is just a test, please disregard if you receive this email* - MTH</p>\n','<p>[LINK] - the link to the form.<br /> \n              [PARENT_FIRST] - the parent\'s first name<br />\n              [STUDENT_FIRST] - the student\'s preferred first name</p>',1,'2021-02-16 15:07:32'),('withdrawalNotificationEmailSubject','Withdrawals',' Withdrawal Email Subject','Text','Final Step to Withdraw from My Tech High','<p>Email sent with link to form for a withdrawan student.</p>',1,'2021-01-12 12:46:08');
/*!40000 ALTER TABLE `core_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `core_user`
--

DROP TABLE IF EXISTS `core_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `core_user` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `level` int NOT NULL,
  `cookie` varchar(255) NOT NULL,
  `last_login` varchar(255) NOT NULL,
  `avatar_url` varchar(255) NOT NULL,
  `red_announcements` varchar(255) NOT NULL,
  `red_notifications` varchar(255) NOT NULL,
  `auth_token` varchar(255) NOT NULL,
  `updated_at` varchar(255) NOT NULL,
  `can_emulate` varchar(255) NOT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `core_user`
--

LOCK TABLES `core_user` WRITE;
/*!40000 ALTER TABLE `core_user` DISABLE KEYS */;
/*!40000 ALTER TABLE `core_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `core_users`
--

DROP TABLE IF EXISTS `core_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `core_users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `cookie` varchar(255) DEFAULT NULL,
  `avatar_url` varchar(255) DEFAULT NULL,
  `red_announcements` varchar(255) DEFAULT NULL,
  `red_notifications` varchar(255) DEFAULT NULL,
  `can_emulate` varchar(255) DEFAULT NULL,
  `auth_token` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `status` tinyint NOT NULL DEFAULT '1',
  `last_login` datetime DEFAULT NULL,
  `level` int DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  KEY `FK_2bb304172079abe44a26143f012` (`level`),
  CONSTRAINT `FK_2bb304172079abe44a26143f012` FOREIGN KEY (`level`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8033 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `core_users`
--

LOCK TABLES `core_users` WRITE;
/*!40000 ALTER TABLE `core_users` DISABLE KEYS */;
INSERT INTO `core_users` VALUES (8014,'superadmin@gmail.com','Bobby','Ralph','6dd5a09353f5cc61f6a7f68dd6bcc967',NULL,NULL,NULL,NULL,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InN1cGVyYWRtaW5AZ21haWwuY29tIiwic3ViIjo4MDE0LCJpYXQiOjE2NDQ4NjU1OTUsImV4cCI6MTY0NDk1MTk5NX0.1fDKUbBntm6rsb1sIzeqWZbQtzVnEoCP_tooS5SVvx0','2022-02-11 01:30:38.493542','2022-02-15 00:06:35.000000',1,'2022-02-15 00:06:35',1),(8015,'admin@gmail.com','Elliot','Finn','6dd5a09353f5cc61f6a7f68dd6bcc967',NULL,NULL,NULL,NULL,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluQGdtYWlsLmNvbSIsInN1YiI6ODAxNSwiaWF0IjoxNjQ0ODY1NTY4LCJleHAiOjE2NDQ5NTE5Njh9.y_4rgK3h45pmTw3VFVUVlgcW0RmF0K9z-1xuz8us8Vc','2022-02-11 01:31:53.153614','2022-02-15 00:06:08.000000',1,'2022-02-15 00:06:09',2),(8016,'subadmin1@gmail.com','Laim','Nesson','6dd5a09353f5cc61f6a7f68dd6bcc967',NULL,NULL,NULL,NULL,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InN1YmFkbWluMUBnbWFpbC5jb20iLCJzdWIiOjgwMTYsImlhdCI6MTY0NDU5MDE0NCwiZXhwIjoxNjQ0Njc2NTQ0fQ.iy-pXgEC0C-EDB23U1weOIqEVfHF9F2zbpvHBXITc0A','2022-02-11 01:32:16.730863','2022-02-11 19:35:44.000000',1,'2022-02-11 19:35:45',3),(8017,'subadmin2@gmail.com','Blake','Oen','6dd5a09353f5cc61f6a7f68dd6bcc967',NULL,NULL,NULL,NULL,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InN1YmFkbWluMkBnbWFpbC5jb20iLCJzdWIiOjgwMTcsImlhdCI6MTY0NDU5MTM1OCwiZXhwIjoxNjQ0Njc3NzU4fQ.8C9Uw_d9YcaqeXxP6RoU0MtKVl-wZuhxnWUhrr2gzIo','2022-02-11 01:33:06.227368','2022-02-11 19:55:58.000000',1,'2022-02-11 19:55:59',4),(8018,'subadmin3@gmail.com','Ronnie','Blake','6dd5a09353f5cc61f6a7f68dd6bcc967',NULL,NULL,NULL,NULL,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InN1YmFkbWluM0BnbWFpbC5jb20iLCJzdWIiOjgwMTgsImlhdCI6MTY0NDUzNTI3NSwiZXhwIjoxNjQ0NjIxNjc1fQ.wzhawhMK03NfESXmQMjp_hVrRAnc9aBxY7u-7zJf3dU','2022-02-11 01:33:23.627590','2022-02-11 04:21:15.000000',1,'2022-02-11 04:21:15',5),(8019,'subadmin4@gmail.com','Riley','Carter','6dd5a09353f5cc61f6a7f68dd6bcc967',NULL,NULL,NULL,NULL,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InN1YmFkbWluNEBnbWFpbC5jb20iLCJzdWIiOjgwMTksImlhdCI6MTY0NDYwMjE5MCwiZXhwIjoxNjQ0Njg4NTkwfQ.doTYWPlpJOn4oH18o8x1HFE0z0Yvb3uItpoizm9Kjy0','2022-02-11 01:34:03.185833','2022-02-11 22:56:30.000000',1,'2022-02-11 22:56:31',6),(8020,'subadmin5@gmail.com','Toby','Ezra','6dd5a09353f5cc61f6a7f68dd6bcc967',NULL,NULL,NULL,NULL,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InN1YmFkbWluNUBnbWFpbC5jb20iLCJzdWIiOjgwMjAsImlhdCI6MTY0NDU5MTU2MCwiZXhwIjoxNjQ0Njc3OTYwfQ.BhXnRF6_SEFbQhxVmK_ZTbrTi3E108waOf1Bzm7x_cc','2022-02-11 01:34:25.931395','2022-02-11 19:59:20.000000',1,'2022-02-11 19:59:20',7),(8021,'subadmin6@gmail.com','Jude','Frankie','6dd5a09353f5cc61f6a7f68dd6bcc967',NULL,NULL,NULL,NULL,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InN1YmFkbWluNkBnbWFpbC5jb20iLCJzdWIiOjgwMjEsImlhdCI6MTY0NDUzNTgwOCwiZXhwIjoxNjQ0NjIyMjA4fQ.0M40Ny3Hg2CIldWpYxBm_pEEQiuowRhT9D_iaQoNSe4','2022-02-11 01:34:50.493652','2022-02-11 04:30:08.000000',1,'2022-02-11 04:30:08',8),(8022,'parent@gmail.com','Albert','Arlo','6dd5a09353f5cc61f6a7f68dd6bcc967',NULL,NULL,NULL,NULL,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InBhcmVudEBnbWFpbC5jb20iLCJzdWIiOjgwMjIsImlhdCI6MTY0NDg2MTI3NywiZXhwIjoxNjQ0OTQ3Njc3fQ.gF8eJBIgosROn42eXAEiakk4XtL3JK4xyoB-rtTcWZQ','2022-02-11 01:35:35.090258','2022-02-14 22:54:37.000000',1,'2022-02-14 22:54:38',15),(8023,'student@gmail.com','Teddy','Benjamin','6dd5a09353f5cc61f6a7f68dd6bcc967',NULL,NULL,NULL,NULL,NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InN0dWRlbnRAZ21haWwuY29tIiwic3ViIjo4MDIzLCJpYXQiOjE2NDQ1OTE1NDEsImV4cCI6MTY0NDY3Nzk0MX0.1aJZa6XsHBnpQqjPYgMsPsswloNr3jsLcco4kHzEOo4','2022-02-11 01:36:20.593885','2022-02-11 19:59:01.000000',1,'2022-02-11 19:59:02',13),(8024,'observer@gmail.com','Max','Finley','6dd5a09353f5cc61f6a7f68dd6bcc967',NULL,NULL,NULL,NULL,NULL,NULL,'2022-02-11 01:37:01.188296','2022-02-11 01:37:01.188296',1,NULL,14),(8025,'teacher@gmail.com','Lucas','Archie','6dd5a09353f5cc61f6a7f68dd6bcc967',NULL,NULL,NULL,NULL,NULL,NULL,'2022-02-11 01:38:03.075143','2022-02-11 01:38:03.075143',1,NULL,16),(8026,'teacherassistant1@gmail.com','Isaac','Theo','6dd5a09353f5cc61f6a7f68dd6bcc967',NULL,NULL,NULL,NULL,NULL,NULL,'2022-02-11 01:38:52.422374','2022-02-11 01:38:52.422374',1,NULL,9),(8029,'teacherassistant2@gmail.com','Jasper','Jake','6dd5a09353f5cc61f6a7f68dd6bcc967',NULL,NULL,NULL,NULL,NULL,NULL,'2022-02-11 01:58:32.863314','2022-02-11 01:58:32.863314',1,NULL,10),(8030,'teacherassistant3@gmail.com','Jayden','Luke','6dd5a09353f5cc61f6a7f68dd6bcc967',NULL,NULL,NULL,NULL,NULL,NULL,'2022-02-11 01:59:07.712784','2022-02-11 01:59:07.712784',1,NULL,17),(8032,'partner@gmail.com','Oakley','Blake','6dd5a09353f5cc61f6a7f68dd6bcc967',NULL,NULL,NULL,NULL,NULL,NULL,'2022-02-11 02:02:46.992809','2022-02-11 02:02:46.992809',1,NULL,12);
/*!40000 ALTER TABLE `core_users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mth_address`
--

DROP TABLE IF EXISTS `mth_address`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mth_address` (
  `address_id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(20) DEFAULT NULL,
  `street` varchar(120) DEFAULT NULL,
  `street2` varchar(120) DEFAULT NULL,
  `city` varchar(60) DEFAULT NULL,
  `state` varchar(2) DEFAULT NULL,
  `zip` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`address_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mth_address`
--

LOCK TABLES `mth_address` WRITE;
/*!40000 ALTER TABLE `mth_address` DISABLE KEYS */;
/*!40000 ALTER TABLE `mth_address` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mth_announcements`
--

DROP TABLE IF EXISTS `mth_announcements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mth_announcements` (
  `announcement_id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned DEFAULT NULL,
  `published` int unsigned DEFAULT '0',
  `content` text,
  `subject` varchar(100) DEFAULT NULL,
  `date_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `date_published` datetime DEFAULT NULL,
  PRIMARY KEY (`announcement_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mth_announcements`
--

LOCK TABLES `mth_announcements` WRITE;
/*!40000 ALTER TABLE `mth_announcements` DISABLE KEYS */;
/*!40000 ALTER TABLE `mth_announcements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mth_application`
--

DROP TABLE IF EXISTS `mth_application`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mth_application` (
  `application_id` int unsigned NOT NULL AUTO_INCREMENT,
  `student_id` int unsigned DEFAULT NULL,
  `school_year_id` int unsigned DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  `city_of_residence` varchar(60) DEFAULT NULL,
  `agrees_to_policies` tinyint DEFAULT NULL,
  `referred_by` varchar(120) DEFAULT NULL,
  `date_started` datetime NOT NULL,
  `date_submitted` datetime DEFAULT NULL,
  `date_accepted` datetime DEFAULT NULL,
  `accepted_by_user_id` int unsigned DEFAULT NULL,
  `hidden` int unsigned NOT NULL DEFAULT '0',
  `midyear_application` tinyint DEFAULT NULL,
  `relation_status` int DEFAULT NULL,
  PRIMARY KEY (`application_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mth_application`
--

LOCK TABLES `mth_application` WRITE;
/*!40000 ALTER TABLE `mth_application` DISABLE KEYS */;
/*!40000 ALTER TABLE `mth_application` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mth_application_email`
--

DROP TABLE IF EXISTS `mth_application_email`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mth_application_email` (
  `application_email_id` int NOT NULL AUTO_INCREMENT,
  `application_id` int NOT NULL,
  `subject` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`application_email_id`),
  KEY `application_id` (`application_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mth_application_email`
--

LOCK TABLES `mth_application_email` WRITE;
/*!40000 ALTER TABLE `mth_application_email` DISABLE KEYS */;
/*!40000 ALTER TABLE `mth_application_email` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mth_archive`
--

DROP TABLE IF EXISTS `mth_archive`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mth_archive` (
  `archive_id` int NOT NULL AUTO_INCREMENT,
  `student_id` int NOT NULL DEFAULT '0',
  `student_status` int NOT NULL DEFAULT '0',
  `status_date` datetime DEFAULT NULL,
  `schedule_status` int NOT NULL DEFAULT '0',
  `schedule_date` datetime DEFAULT NULL,
  `homeroom_id` int DEFAULT '0',
  `school_year_id` int NOT NULL DEFAULT '0',
  `status` int NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`archive_id`),
  KEY `student_id` (`student_id`,`homeroom_id`),
  KEY `school_year_id` (`school_year_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mth_archive`
--

LOCK TABLES `mth_archive` WRITE;
/*!40000 ALTER TABLE `mth_archive` DISABLE KEYS */;
/*!40000 ALTER TABLE `mth_archive` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mth_assistant_user`
--

DROP TABLE IF EXISTS `mth_assistant_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mth_assistant_user` (
  `assistant_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL DEFAULT '0',
  `value` int DEFAULT '0',
  `type` int DEFAULT '0',
  `datecreated` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`assistant_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mth_assistant_user`
--

LOCK TABLES `mth_assistant_user` WRITE;
/*!40000 ALTER TABLE `mth_assistant_user` DISABLE KEYS */;
/*!40000 ALTER TABLE `mth_assistant_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mth_canvas_course`
--

DROP TABLE IF EXISTS `mth_canvas_course`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mth_canvas_course` (
  `canvas_course_id` int unsigned NOT NULL,
  `mth_course_id` int unsigned NOT NULL,
  `school_year_id` int unsigned NOT NULL,
  `workflow_state` tinyint unsigned NOT NULL,
  `canvas_teacher` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`canvas_course_id`),
  UNIQUE KEY `mth_course_id` (`mth_course_id`,`school_year_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mth_canvas_course`
--

LOCK TABLES `mth_canvas_course` WRITE;
/*!40000 ALTER TABLE `mth_canvas_course` DISABLE KEYS */;
/*!40000 ALTER TABLE `mth_canvas_course` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mth_canvas_enrollment`
--

DROP TABLE IF EXISTS `mth_canvas_enrollment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mth_canvas_enrollment` (
  `canvas_enrollment_id` int unsigned NOT NULL,
  `canvas_user_id` int unsigned NOT NULL,
  `canvas_course_id` int unsigned NOT NULL,
  `canvas_section_id` int unsigned DEFAULT NULL,
  `role` tinyint unsigned NOT NULL,
  `status` tinyint unsigned NOT NULL,
  `grade` float DEFAULT NULL,
  `grade_updated` datetime DEFAULT NULL,
  `zero_count` int DEFAULT NULL,
  `zero_count_updated` datetime DEFAULT NULL,
  `last_activity_at` timestamp NULL DEFAULT NULL,
  `late_count` int DEFAULT '0',
  PRIMARY KEY (`canvas_enrollment_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mth_canvas_enrollment`
--

LOCK TABLES `mth_canvas_enrollment` WRITE;
/*!40000 ALTER TABLE `mth_canvas_enrollment` DISABLE KEYS */;
/*!40000 ALTER TABLE `mth_canvas_enrollment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mth_canvas_error`
--

DROP TABLE IF EXISTS `mth_canvas_error`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mth_canvas_error` (
  `error_id` int unsigned NOT NULL AUTO_INCREMENT,
  `error_message` varchar(255) NOT NULL,
  `time` datetime NOT NULL,
  `command` varchar(255) NOT NULL,
  `post_fields` text NOT NULL,
  `full_response` text NOT NULL,
  `flag` tinyint unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`error_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mth_canvas_error`
--

LOCK TABLES `mth_canvas_error` WRITE;
/*!40000 ALTER TABLE `mth_canvas_error` DISABLE KEYS */;
/*!40000 ALTER TABLE `mth_canvas_error` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mth_canvas_section`
--

DROP TABLE IF EXISTS `mth_canvas_section`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mth_canvas_section` (
  `canvas_section_id` int unsigned NOT NULL,
  `canvas_course_id` int unsigned NOT NULL,
  `name` varchar(120) NOT NULL,
  PRIMARY KEY (`canvas_course_id`,`name`),
  UNIQUE KEY `canvas_section_id` (`canvas_section_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mth_canvas_section`
--

LOCK TABLES `mth_canvas_section` WRITE;
/*!40000 ALTER TABLE `mth_canvas_section` DISABLE KEYS */;
/*!40000 ALTER TABLE `mth_canvas_section` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mth_canvas_term`
--

DROP TABLE IF EXISTS `mth_canvas_term`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mth_canvas_term` (
  `canvas_term_id` int unsigned NOT NULL,
  `name` varchar(255) NOT NULL,
  `school_year_id` int unsigned NOT NULL,
  UNIQUE KEY `canvas_term_id` (`canvas_term_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mth_canvas_term`
--

LOCK TABLES `mth_canvas_term` WRITE;
/*!40000 ALTER TABLE `mth_canvas_term` DISABLE KEYS */;
/*!40000 ALTER TABLE `mth_canvas_term` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mth_canvas_user`
--

DROP TABLE IF EXISTS `mth_canvas_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mth_canvas_user` (
  `canvas_user_id` int unsigned NOT NULL,
  `mth_person_id` int unsigned DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `to_be_pushed` tinyint unsigned NOT NULL,
  `last_pushed` datetime DEFAULT NULL,
  `canvas_login_id` int unsigned DEFAULT NULL,
  `last_login` timestamp NULL DEFAULT NULL,
  `avatar_url` varchar(250) DEFAULT NULL,
  PRIMARY KEY (`canvas_user_id`),
  UNIQUE KEY `mth_person_id` (`mth_person_id`),
  KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mth_canvas_user`
--

LOCK TABLES `mth_canvas_user` WRITE;
/*!40000 ALTER TABLE `mth_canvas_user` DISABLE KEYS */;
/*!40000 ALTER TABLE `mth_canvas_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mth_cas_ticket`
--

DROP TABLE IF EXISTS `mth_cas_ticket`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mth_cas_ticket` (
  `ticket_str` varchar(64) NOT NULL,
  `user_id` int unsigned NOT NULL,
  `service_url` varchar(255) NOT NULL,
  `date` datetime NOT NULL,
  PRIMARY KEY (`ticket_str`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mth_cas_ticket`
--

LOCK TABLES `mth_cas_ticket` WRITE;
/*!40000 ALTER TABLE `mth_cas_ticket` DISABLE KEYS */;
/*!40000 ALTER TABLE `mth_cas_ticket` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mth_city_zip`
--

DROP TABLE IF EXISTS `mth_city_zip`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mth_city_zip` (
  `zip` varchar(20) NOT NULL,
  `city` varchar(120) NOT NULL,
  PRIMARY KEY (`zip`,`city`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mth_city_zip`
--

LOCK TABLES `mth_city_zip` WRITE;
/*!40000 ALTER TABLE `mth_city_zip` DISABLE KEYS */;
/*!40000 ALTER TABLE `mth_city_zip` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mth_course`
--

DROP TABLE IF EXISTS `mth_course`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mth_course` (
  `course_id` int unsigned NOT NULL AUTO_INCREMENT,
  `subject_id` int unsigned NOT NULL,
  `title` varchar(255) NOT NULL,
  `allow_other_mth` tinyint unsigned NOT NULL DEFAULT '1',
  `allow_custom` tinyint unsigned NOT NULL DEFAULT '1',
  `allow_tp` tinyint unsigned NOT NULL DEFAULT '1',
  `min_grade_level` tinyint unsigned NOT NULL DEFAULT '1',
  `alternative_min_grade_level` tinyint unsigned DEFAULT NULL,
  `max_grade_level` tinyint unsigned NOT NULL DEFAULT '12',
  `alternative_max_grade_level` tinyint unsigned DEFAULT NULL,
  `diploma_valid` tinyint unsigned NOT NULL DEFAULT '0',
  `available` tinyint NOT NULL DEFAULT '1',
  `allow_2nd_sem_change` varchar(28) NOT NULL DEFAULT '',
  `teacher_user_id` int DEFAULT NULL,
  `allowance` float DEFAULT '0',
  `archived` tinyint unsigned NOT NULL DEFAULT '0',
  `custom_course_description` text,
  PRIMARY KEY (`course_id`),
  KEY `subject_id` (`subject_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mth_course`
--

LOCK TABLES `mth_course` WRITE;
/*!40000 ALTER TABLE `mth_course` DISABLE KEYS */;
/*!40000 ALTER TABLE `mth_course` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mth_course_state_code`
--

DROP TABLE IF EXISTS `mth_course_state_code`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mth_course_state_code` (
  `course_state_code_id` int NOT NULL AUTO_INCREMENT,
  `school_year_id` int DEFAULT NULL,
  `grade` int DEFAULT NULL,
  `course_id` int DEFAULT NULL,
  `subject_id` int DEFAULT NULL,
  `state_code` varchar(50) DEFAULT NULL,
  `teacher_name` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`course_state_code_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mth_course_state_code`
--

LOCK TABLES `mth_course_state_code` WRITE;
/*!40000 ALTER TABLE `mth_course_state_code` DISABLE KEYS */;
/*!40000 ALTER TABLE `mth_course_state_code` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mth_email_logs`
--

DROP TABLE IF EXISTS `mth_email_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mth_email_logs` (
  `email_batch_id` varchar(36) NOT NULL DEFAULT '',
  `student_id` int unsigned NOT NULL,
  `parent_id` int unsigned NOT NULL,
  `school_year_id` int unsigned NOT NULL,
  `status` tinyint unsigned NOT NULL,
  `type` varchar(50) DEFAULT NULL,
  `email_address` varchar(30) DEFAULT NULL,
  `error_message` longtext,
  `date_created` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`email_batch_id`,`student_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mth_email_logs`
--

LOCK TABLES `mth_email_logs` WRITE;
/*!40000 ALTER TABLE `mth_email_logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `mth_email_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mth_emailbatch`
--

DROP TABLE IF EXISTS `mth_emailbatch`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mth_emailbatch` (
  `batch_id` int NOT NULL AUTO_INCREMENT,
  `type` varchar(50) DEFAULT NULL,
  `title` varchar(120) DEFAULT NULL,
  `category` varchar(60) DEFAULT NULL,
  `template` longtext,
  `school_year_id` int DEFAULT NULL,
  `sent_by_id` int DEFAULT NULL,
  `batch_date` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`batch_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mth_emailbatch`
--

LOCK TABLES `mth_emailbatch` WRITE;
/*!40000 ALTER TABLE `mth_emailbatch` DISABLE KEYS */;
/*!40000 ALTER TABLE `mth_emailbatch` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mth_emailverifier`
--

DROP TABLE IF EXISTS `mth_emailverifier`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mth_emailverifier` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned DEFAULT NULL,
  `email` varchar(90) NOT NULL DEFAULT '0',
  `date_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `date_verified` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `verified` tinyint DEFAULT '0',
  `verification_type` tinyint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mth_emailverifier`
--

LOCK TABLES `mth_emailverifier` WRITE;
/*!40000 ALTER TABLE `mth_emailverifier` DISABLE KEYS */;
/*!40000 ALTER TABLE `mth_emailverifier` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mth_events`
--

DROP TABLE IF EXISTS `mth_events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mth_events` (
  `event_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(90) DEFAULT '0',
  `color` varchar(50) DEFAULT '#1e88e5',
  `content` text,
  `start_date` datetime DEFAULT NULL,
  `end_date` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`event_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mth_events`
--

LOCK TABLES `mth_events` WRITE;
/*!40000 ALTER TABLE `mth_events` DISABLE KEYS */;
/*!40000 ALTER TABLE `mth_events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mth_familynote`
--

DROP TABLE IF EXISTS `mth_familynote`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mth_familynote` (
  `id` int NOT NULL AUTO_INCREMENT,
  `parent_id` int NOT NULL DEFAULT '0',
  `note` text,
  `date_created` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `date_updated` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `parent_id` (`parent_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mth_familynote`
--

LOCK TABLES `mth_familynote` WRITE;
/*!40000 ALTER TABLE `mth_familynote` DISABLE KEYS */;
/*!40000 ALTER TABLE `mth_familynote` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mth_file`
--

DROP TABLE IF EXISTS `mth_file`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mth_file` (
  `file_id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(60) NOT NULL,
  `type` varchar(60) NOT NULL,
  `item1` varchar(60) NOT NULL,
  `item2` varchar(60) NOT NULL,
  `item3` varchar(250) NOT NULL,
  `year` int unsigned NOT NULL,
  `is_new_upload_type` tinyint DEFAULT '0',
  PRIMARY KEY (`file_id`),
  KEY `item1` (`item1`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mth_file`
--

LOCK TABLES `mth_file` WRITE;
/*!40000 ALTER TABLE `mth_file` DISABLE KEYS */;
/*!40000 ALTER TABLE `mth_file` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mth_homeroom`
--

DROP TABLE IF EXISTS `mth_homeroom`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mth_homeroom` (
  `canvas_course_id` int unsigned NOT NULL,
  `school_year_id` int unsigned NOT NULL,
  `name` varchar(50) NOT NULL,
  `deleted` tinyint unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`canvas_course_id`),
  KEY `school_year_id` (`school_year_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mth_homeroom`
--

LOCK TABLES `mth_homeroom` WRITE;
/*!40000 ALTER TABLE `mth_homeroom` DISABLE KEYS */;
/*!40000 ALTER TABLE `mth_homeroom` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mth_immunization_settings`
--

DROP TABLE IF EXISTS `mth_immunization_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mth_immunization_settings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(40) DEFAULT NULL,
  `min_grade_level` varchar(5) DEFAULT NULL,
  `max_grade_level` varchar(5) DEFAULT NULL,
  `min_school_year_required` int NOT NULL,
  `max_school_year_required` int NOT NULL,
  `immunity_allowed` int NOT NULL,
  `exempt_update` int NOT NULL,
  `level_exempt_update` longtext,
  `consecutive_vaccine` int NOT NULL,
  `min_spacing_interval` int NOT NULL,
  `min_spacing_date` tinyint(1) DEFAULT NULL,
  `max_spacing_interval` int NOT NULL,
  `max_spacing_date` tinyint(1) DEFAULT NULL,
  `email_update_template` varchar(40) DEFAULT NULL,
  `date_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `date_updated` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `tooltip` longtext,
  `auto_populate_date_from` int DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mth_immunization_settings`
--

LOCK TABLES `mth_immunization_settings` WRITE;
/*!40000 ALTER TABLE `mth_immunization_settings` DISABLE KEYS */;
/*!40000 ALTER TABLE `mth_immunization_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mth_immunizations`
--

DROP TABLE IF EXISTS `mth_immunizations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mth_immunizations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(40) DEFAULT NULL,
  `min_grade_level` varchar(5) DEFAULT NULL,
  `max_grade_level` varchar(5) DEFAULT NULL,
  `min_school_year_required` int NOT NULL,
  `max_school_year_required` int NOT NULL,
  `immunity_allowed` int NOT NULL,
  `requires_update` int NOT NULL,
  `exempt_update` int NOT NULL,
  `level_requires_update` longtext,
  `level_exempt_update` longtext,
  `consecutive_vaccine` int NOT NULL,
  `min_spacing_interval` int NOT NULL,
  `min_spacing_date` datetime DEFAULT NULL,
  `max_spacing_interval` int NOT NULL,
  `max_spacing_date` datetime DEFAULT NULL,
  `email_update_template` varchar(40) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mth_immunizations`
--

LOCK TABLES `mth_immunizations` WRITE;
/*!40000 ALTER TABLE `mth_immunizations` DISABLE KEYS */;
/*!40000 ALTER TABLE `mth_immunizations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mth_intervention`
--

DROP TABLE IF EXISTS `mth_intervention`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mth_intervention` (
  `intervention_id` int NOT NULL AUTO_INCREMENT,
  `mth_student_id` int NOT NULL,
  `zero_count` int DEFAULT NULL,
  `grade` float DEFAULT NULL,
  `school_year_id` int DEFAULT NULL,
  `last_login` datetime DEFAULT NULL,
  `date_updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `label_id` int DEFAULT NULL,
  `resolve` int DEFAULT '0',
  PRIMARY KEY (`intervention_id`),
  KEY `mth_student_id` (`mth_student_id`),
  KEY `school_year_id` (`school_year_id`),
  KEY `label_id` (`label_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mth_intervention`
--

LOCK TABLES `mth_intervention` WRITE;
/*!40000 ALTER TABLE `mth_intervention` DISABLE KEYS */;
/*!40000 ALTER TABLE `mth_intervention` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mth_intervention_notes`
--

DROP TABLE IF EXISTS `mth_intervention_notes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mth_intervention_notes` (
  `notes_id` int NOT NULL AUTO_INCREMENT,
  `intervention_id` int DEFAULT NULL,
  `user_id` int NOT NULL,
  `notes` text,
  `date_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`notes_id`),
  KEY `intervention_id` (`intervention_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mth_intervention_notes`
--

LOCK TABLES `mth_intervention_notes` WRITE;
/*!40000 ALTER TABLE `mth_intervention_notes` DISABLE KEYS */;
/*!40000 ALTER TABLE `mth_intervention_notes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mth_label`
--

DROP TABLE IF EXISTS `mth_label`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mth_label` (
  `label_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(90) DEFAULT NULL,
  `user_id` int NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`label_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mth_label`
--

LOCK TABLES `mth_label` WRITE;
/*!40000 ALTER TABLE `mth_label` DISABLE KEYS */;
/*!40000 ALTER TABLE `mth_label` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mth_log`
--

DROP TABLE IF EXISTS `mth_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mth_log` (
  `log_id` int unsigned NOT NULL AUTO_INCREMENT,
  `person_id` int unsigned NOT NULL,
  `field` varchar(255) NOT NULL,
  `new_value` text NOT NULL,
  `old_value` text NOT NULL,
  `field_id` int unsigned NOT NULL,
  `changed_by_user_id` int unsigned NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `notified` tinyint unsigned NOT NULL,
  PRIMARY KEY (`log_id`),
  KEY `person_id` (`person_id`),
  KEY `field` (`field`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mth_log`
--

LOCK TABLES `mth_log` WRITE;
/*!40000 ALTER TABLE `mth_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `mth_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mth_offense_notif`
--

DROP TABLE IF EXISTS `mth_offense_notif`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mth_offense_notif` (
  `offense_id` int unsigned NOT NULL AUTO_INCREMENT,
  `intervention_id` int NOT NULL,
  `type` int NOT NULL COMMENT '1 if first 2 if final',
  `date_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `mth_student_id` int unsigned DEFAULT NULL,
  `school_year_id` int DEFAULT NULL,
  PRIMARY KEY (`offense_id`),
  KEY `mth_student_id` (`mth_student_id`),
  KEY `intervention_id` (`intervention_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mth_offense_notif`
--

LOCK TABLES `mth_offense_notif` WRITE;
/*!40000 ALTER TABLE `mth_offense_notif` DISABLE KEYS */;
/*!40000 ALTER TABLE `mth_offense_notif` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mth_packet`
--

DROP TABLE IF EXISTS `mth_packet`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mth_packet` (
  `packet_id` int unsigned NOT NULL AUTO_INCREMENT,
  `student_id` int unsigned NOT NULL,
  `status` varchar(20) NOT NULL,
  `deadline` date DEFAULT NULL,
  `date_submitted` datetime DEFAULT NULL,
  `date_last_submitted` datetime DEFAULT NULL,
  `date_accepted` datetime DEFAULT NULL,
  `school_district` varchar(255) DEFAULT NULL,
  `special_ed` varchar(120) DEFAULT NULL,
  `understands_special_ed` tinyint unsigned NOT NULL DEFAULT '0',
  `special_ed_desc` text,
  `last_school` varchar(120) DEFAULT NULL,
  `last_school_address` varchar(255) DEFAULT NULL,
  `last_school_type` tinyint unsigned DEFAULT NULL,
  `permission_to_request_records` tinyint unsigned DEFAULT NULL,
  `hispanic` tinyint unsigned DEFAULT NULL,
  `race` varchar(120) DEFAULT NULL,
  `language` varchar(120) DEFAULT NULL,
  `language_home` varchar(120) DEFAULT NULL,
  `language_home_child` varchar(120) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `language_friends` varchar(120) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `language_home_preferred` varchar(120) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `work_move` tinyint unsigned DEFAULT NULL,
  `living_location` tinyint unsigned DEFAULT NULL,
  `lives_with` tinyint unsigned DEFAULT NULL,
  `secondary_contact_first` varchar(60) DEFAULT NULL,
  `secondary_contact_last` varchar(60) DEFAULT NULL,
  `secondary_phone` varchar(15) DEFAULT NULL,
  `secondary_email` varchar(120) DEFAULT NULL,
  `birth_place` varchar(120) DEFAULT NULL,
  `birth_country` varchar(50) DEFAULT NULL,
  `worked_in_agriculture` tinyint DEFAULT NULL,
  `military` tinyint DEFAULT NULL,
  `household_size` tinyint unsigned DEFAULT NULL,
  `household_income` int unsigned DEFAULT NULL,
  `agrees_to_policy` tinyint unsigned DEFAULT NULL,
  `approves_enrollment` tinyint unsigned DEFAULT NULL,
  `ferpa_agreement` tinyint unsigned DEFAULT NULL,
  `photo_permission` tinyint unsigned DEFAULT NULL,
  `dir_permission` tinyint unsigned DEFAULT NULL,
  `signature_name` varchar(120) DEFAULT NULL,
  `signature_file_id` int unsigned DEFAULT NULL,
  `reupload_files` text,
  `understands_sped_scheduling` tinyint unsigned NOT NULL DEFAULT '0',
  `deleted` tinyint DEFAULT '0',
  `military_branch` varchar(60) DEFAULT NULL,
  `exemp_immunization` tinyint DEFAULT NULL,
  `exemption_form_date` datetime DEFAULT NULL,
  `reenroll_files` text,
  `admin_notes` text,
  `immunization_notes` text,
  `medical_exemption` tinyint(1) DEFAULT '0',
  `date_assigned_to_soe` datetime DEFAULT NULL,
  PRIMARY KEY (`packet_id`),
  KEY `student_id` (`student_id`),
  KEY `status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mth_packet`
--

LOCK TABLES `mth_packet` WRITE;
/*!40000 ALTER TABLE `mth_packet` DISABLE KEYS */;
/*!40000 ALTER TABLE `mth_packet` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mth_packet_file`
--

DROP TABLE IF EXISTS `mth_packet_file`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mth_packet_file` (
  `file_id` int unsigned NOT NULL AUTO_INCREMENT,
  `packet_id` int unsigned NOT NULL,
  `mth_file_id` int unsigned DEFAULT NULL,
  `kind` varchar(60) NOT NULL,
  `name` varchar(60) DEFAULT NULL,
  `type` varchar(60) DEFAULT NULL,
  `item1` varchar(60) DEFAULT NULL,
  `item2` varchar(60) DEFAULT NULL,
  `year` int unsigned DEFAULT NULL,
  PRIMARY KEY (`file_id`),
  KEY `packet_id` (`packet_id`),
  KEY `mth_file_id` (`mth_file_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mth_packet_file`
--

LOCK TABLES `mth_packet_file` WRITE;
/*!40000 ALTER TABLE `mth_packet_file` DISABLE KEYS */;
/*!40000 ALTER TABLE `mth_packet_file` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mth_parent`
--

DROP TABLE IF EXISTS `mth_parent`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mth_parent` (
  `parent_id` int unsigned NOT NULL AUTO_INCREMENT,
  `person_id` int unsigned NOT NULL,
  PRIMARY KEY (`parent_id`),
  KEY `person_id` (`person_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mth_parent`
--

LOCK TABLES `mth_parent` WRITE;
/*!40000 ALTER TABLE `mth_parent` DISABLE KEYS */;
/*!40000 ALTER TABLE `mth_parent` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mth_person`
--

DROP TABLE IF EXISTS `mth_person`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mth_person` (
  `person_id` int unsigned NOT NULL AUTO_INCREMENT,
  `first_name` varchar(60) DEFAULT NULL,
  `last_name` varchar(60) DEFAULT NULL,
  `middle_name` varchar(60) DEFAULT NULL,
  `preferred_first_name` varchar(60) DEFAULT NULL,
  `preferred_last_name` varchar(60) DEFAULT NULL,
  `gender` varchar(10) DEFAULT NULL,
  `email` varchar(120) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  PRIMARY KEY (`person_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mth_person`
--

LOCK TABLES `mth_person` WRITE;
/*!40000 ALTER TABLE `mth_person` DISABLE KEYS */;
/*!40000 ALTER TABLE `mth_person` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mth_person_address`
--

DROP TABLE IF EXISTS `mth_person_address`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mth_person_address` (
  `person_id` int unsigned NOT NULL,
  `address_id` int unsigned NOT NULL,
  UNIQUE KEY `person_id` (`person_id`,`address_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mth_person_address`
--

LOCK TABLES `mth_person_address` WRITE;
/*!40000 ALTER TABLE `mth_person_address` DISABLE KEYS */;
/*!40000 ALTER TABLE `mth_person_address` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mth_phone`
--

DROP TABLE IF EXISTS `mth_phone`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mth_phone` (
  `phone_id` int unsigned NOT NULL AUTO_INCREMENT,
  `person_id` int unsigned NOT NULL,
  `name` varchar(20) DEFAULT NULL,
  `number` varchar(15) DEFAULT NULL,
  `ext` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`phone_id`),
  KEY `person_id` (`person_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mth_phone`
--

LOCK TABLES `mth_phone` WRITE;
/*!40000 ALTER TABLE `mth_phone` DISABLE KEYS */;
/*!40000 ALTER TABLE `mth_phone` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mth_provider`
--

DROP TABLE IF EXISTS `mth_provider`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mth_provider` (
  `provider_id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `desc` varchar(255) DEFAULT NULL,
  `led_by` tinyint unsigned NOT NULL DEFAULT '0',
  `min_grade_level` tinyint unsigned NOT NULL DEFAULT '1',
  `alternative_min_grade_level` tinyint unsigned DEFAULT NULL,
  `max_grade_level` tinyint unsigned NOT NULL DEFAULT '12',
  `alternative_max_grade_level` tinyint unsigned DEFAULT NULL,
  `diploma_valid` tinyint unsigned NOT NULL DEFAULT '0',
  `available` tinyint unsigned NOT NULL DEFAULT '0',
  `allow_2nd_sem_change` tinyint unsigned NOT NULL DEFAULT '0',
  `deleted` tinyint unsigned NOT NULL DEFAULT '0',
  `diploma_only` tinyint unsigned NOT NULL DEFAULT '0',
  `popup` tinyint unsigned NOT NULL DEFAULT '0',
  `popup_content` text,
  `available_in_school_assignment` tinyint(1) DEFAULT '0',
  `archived` tinyint unsigned NOT NULL DEFAULT '0',
  `requires_multiple_periods` tinyint unsigned NOT NULL DEFAULT '0',
  `multiple_periods` varchar(50) NOT NULL DEFAULT '',
  PRIMARY KEY (`provider_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mth_provider`
--

LOCK TABLES `mth_provider` WRITE;
/*!40000 ALTER TABLE `mth_provider` DISABLE KEYS */;
/*!40000 ALTER TABLE `mth_provider` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mth_provider_course`
--

DROP TABLE IF EXISTS `mth_provider_course`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mth_provider_course` (
  `provider_course_id` int unsigned NOT NULL AUTO_INCREMENT,
  `provider_id` int unsigned NOT NULL,
  `title` varchar(255) NOT NULL,
  `available` tinyint unsigned NOT NULL DEFAULT '1',
  `diploma_only` tinyint unsigned NOT NULL DEFAULT '0',
  `archived` tinyint unsigned NOT NULL DEFAULT '0',
  `full_schedule` tinyint unsigned NOT NULL DEFAULT '0',
  `full_schedule_periods` varchar(50) NOT NULL DEFAULT '',
  `reduceTechAllowance` tinyint unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`provider_course_id`),
  KEY `provider_id` (`provider_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mth_provider_course`
--

LOCK TABLES `mth_provider_course` WRITE;
/*!40000 ALTER TABLE `mth_provider_course` DISABLE KEYS */;
/*!40000 ALTER TABLE `mth_provider_course` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mth_provider_course_mapping`
--

DROP TABLE IF EXISTS `mth_provider_course_mapping`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mth_provider_course_mapping` (
  `provider_course_id` int unsigned NOT NULL,
  `course_id` int unsigned NOT NULL,
  PRIMARY KEY (`provider_course_id`,`course_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mth_provider_course_mapping`
--

LOCK TABLES `mth_provider_course_mapping` WRITE;
/*!40000 ALTER TABLE `mth_provider_course_mapping` DISABLE KEYS */;
/*!40000 ALTER TABLE `mth_provider_course_mapping` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mth_purchasedcourse`
--

DROP TABLE IF EXISTS `mth_purchasedcourse`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mth_purchasedcourse` (
  `purchasedCourse_id` int unsigned NOT NULL AUTO_INCREMENT,
  `mth_parent_id` int unsigned NOT NULL,
  `wooCommerce_customer_id` int unsigned NOT NULL,
  `wooCommerce_order_id` int unsigned NOT NULL,
  `wooCommerce_order_line_item_id` int unsigned NOT NULL,
  `quantity_item` tinyint unsigned NOT NULL,
  `date_purchased` datetime DEFAULT NULL,
  `canvas_course_id` int unsigned NOT NULL,
  `mth_school_year_id` int unsigned NOT NULL,
  `mth_student_id` int unsigned DEFAULT NULL,
  `student_canvas_enrollment_id` int unsigned DEFAULT NULL,
  `parent_canvas_enrollment_id` int unsigned DEFAULT NULL,
  `date_registered` datetime DEFAULT NULL,
  PRIMARY KEY (`purchasedCourse_id`),
  UNIQUE KEY `wooCommerce_order_id` (`wooCommerce_order_id`,`wooCommerce_order_line_item_id`,`quantity_item`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mth_purchasedcourse`
--

LOCK TABLES `mth_purchasedcourse` WRITE;
/*!40000 ALTER TABLE `mth_purchasedcourse` DISABLE KEYS */;
/*!40000 ALTER TABLE `mth_purchasedcourse` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mth_reimbursement`
--

DROP TABLE IF EXISTS `mth_reimbursement`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mth_reimbursement` (
  `reimbursement_id` int unsigned NOT NULL AUTO_INCREMENT,
  `parent_id` int unsigned NOT NULL,
  `student_id` int unsigned NOT NULL,
  `school_year_id` int unsigned NOT NULL,
  `at_least_80` tinyint unsigned NOT NULL DEFAULT '0',
  `schedule_period_id` int unsigned NOT NULL,
  `type` tinyint unsigned NOT NULL,
  `amount` float NOT NULL,
  `invalid_amount` float DEFAULT NULL,
  `description` text NOT NULL,
  `product_name` varchar(255) DEFAULT NULL,
  `product_sn` varchar(255) DEFAULT NULL,
  `product_amount` decimal(7,2) DEFAULT NULL,
  `status` tinyint unsigned NOT NULL,
  `date_submitted` datetime DEFAULT NULL,
  `date_resubmitted` datetime DEFAULT NULL,
  `date_paid` datetime DEFAULT NULL,
  `fields_last_changed` text NOT NULL,
  `require_new_receipt` tinyint unsigned NOT NULL DEFAULT '0',
  `last_modified` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `last_status` tinyint unsigned DEFAULT NULL,
  `confirm_receipt` tinyint unsigned NOT NULL DEFAULT '0',
  `confirm_related` tinyint unsigned NOT NULL DEFAULT '0',
  `confirm_dated` tinyint unsigned NOT NULL DEFAULT '0',
  `confirm_provided` tinyint unsigned NOT NULL DEFAULT '0',
  `confirm_allocation` tinyint unsigned NOT NULL DEFAULT '0',
  `confirm_update` tinyint unsigned NOT NULL DEFAULT '0',
  `type_tag` tinyint DEFAULT NULL,
  `is_direct_order` tinyint(1) DEFAULT '0',
  `direct_order_list_link` text,
  `direct_order_list_provider` varchar(255) DEFAULT NULL,
  `signature_name` varchar(120) DEFAULT NULL,
  `direct_order_confirmation` text,
  `resource_request_id` varchar(10) DEFAULT NULL,
  `approved_by_id` int DEFAULT NULL,
  PRIMARY KEY (`reimbursement_id`),
  KEY `parent_id` (`parent_id`,`student_id`,`school_year_id`,`schedule_period_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mth_reimbursement`
--

LOCK TABLES `mth_reimbursement` WRITE;
/*!40000 ALTER TABLE `mth_reimbursement` DISABLE KEYS */;
/*!40000 ALTER TABLE `mth_reimbursement` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mth_reimbursement_reciept`
--

DROP TABLE IF EXISTS `mth_reimbursement_reciept`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mth_reimbursement_reciept` (
  `reimbursement_id` int unsigned NOT NULL,
  `file_id` int unsigned NOT NULL,
  `upload_type` tinyint DEFAULT '0',
  `submission_id` int DEFAULT NULL,
  PRIMARY KEY (`reimbursement_id`,`file_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mth_reimbursement_reciept`
--

LOCK TABLES `mth_reimbursement_reciept` WRITE;
/*!40000 ALTER TABLE `mth_reimbursement_reciept` DISABLE KEYS */;
/*!40000 ALTER TABLE `mth_reimbursement_reciept` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mth_reimbursement_submission`
--

DROP TABLE IF EXISTS `mth_reimbursement_submission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mth_reimbursement_submission` (
  `submission_id` int NOT NULL AUTO_INCREMENT,
  `reimbursement_id` int NOT NULL DEFAULT '0',
  `date_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`submission_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mth_reimbursement_submission`
--

LOCK TABLES `mth_reimbursement_submission` WRITE;
/*!40000 ALTER TABLE `mth_reimbursement_submission` DISABLE KEYS */;
/*!40000 ALTER TABLE `mth_reimbursement_submission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mth_reimbursement_type`
--

DROP TABLE IF EXISTS `mth_reimbursement_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mth_reimbursement_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `placeholder` int NOT NULL DEFAULT '0',
  `label` varchar(50) NOT NULL DEFAULT '0',
  `is_enable` tinyint NOT NULL DEFAULT '0',
  `date_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `date_updated` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `enabled_for_direct_order` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mth_reimbursement_type`
--

LOCK TABLES `mth_reimbursement_type` WRITE;
/*!40000 ALTER TABLE `mth_reimbursement_type` DISABLE KEYS */;
/*!40000 ALTER TABLE `mth_reimbursement_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mth_resource_request`
--

DROP TABLE IF EXISTS `mth_resource_request`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mth_resource_request` (
  `request_id` int NOT NULL AUTO_INCREMENT,
  `parent_id` int NOT NULL DEFAULT '0',
  `student_id` int NOT NULL DEFAULT '0',
  `resource_id` int NOT NULL,
  `school_year_id` int NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`request_id`),
  KEY `parent_id` (`parent_id`),
  KEY `student_id` (`student_id`),
  KEY `resource_id` (`resource_id`),
  KEY `school_year_id` (`school_year_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mth_resource_request`
--

LOCK TABLES `mth_resource_request` WRITE;
/*!40000 ALTER TABLE `mth_resource_request` DISABLE KEYS */;
/*!40000 ALTER TABLE `mth_resource_request` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mth_resource_settings`
--

DROP TABLE IF EXISTS `mth_resource_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mth_resource_settings` (
  `resource_id` int NOT NULL AUTO_INCREMENT,
  `resource_name` varchar(90) DEFAULT NULL,
  `min_grade_level` tinyint DEFAULT NULL,
  `max_grade_level` tinyint DEFAULT NULL,
  `hidden` tinyint DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `show_parent` tinyint DEFAULT '1',
  `image` varchar(160) DEFAULT NULL,
  `content` text,
  `cost` float DEFAULT NULL,
  `show_cost` tinyint DEFAULT '0',
  `resource_type` tinyint DEFAULT '1',
  `is_direct_deduction` tinyint DEFAULT '0',
  PRIMARY KEY (`resource_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mth_resource_settings`
--

LOCK TABLES `mth_resource_settings` WRITE;
/*!40000 ALTER TABLE `mth_resource_settings` DISABLE KEYS */;
/*!40000 ALTER TABLE `mth_resource_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mth_schedule`
--

DROP TABLE IF EXISTS `mth_schedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mth_schedule` (
  `schedule_id` int unsigned NOT NULL AUTO_INCREMENT,
  `student_id` int unsigned NOT NULL,
  `school_year_id` int unsigned NOT NULL,
  `status` tinyint unsigned NOT NULL DEFAULT '0',
  `date_accepted` datetime DEFAULT NULL,
  `last_modified` datetime DEFAULT NULL,
  `date_submitted` datetime DEFAULT NULL,
  `current_submission` datetime DEFAULT NULL,
  PRIMARY KEY (`schedule_id`),
  KEY `student_id` (`student_id`),
  KEY `school_year_id` (`school_year_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mth_schedule`
--

LOCK TABLES `mth_schedule` WRITE;
/*!40000 ALTER TABLE `mth_schedule` DISABLE KEYS */;
/*!40000 ALTER TABLE `mth_schedule` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mth_schedule_period`
--

DROP TABLE IF EXISTS `mth_schedule_period`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mth_schedule_period` (
  `schedule_period_id` int unsigned NOT NULL AUTO_INCREMENT,
  `schedule_id` int unsigned NOT NULL,
  `period` tinyint unsigned NOT NULL,
  `second_semester` tinyint unsigned NOT NULL DEFAULT '0',
  `subject_id` int unsigned DEFAULT NULL,
  `course_id` int unsigned DEFAULT NULL,
  `course_type` tinyint unsigned DEFAULT NULL,
  `mth_provider_id` int unsigned DEFAULT NULL,
  `provider_course_id` int unsigned DEFAULT NULL,
  `tp_name` varchar(255) DEFAULT NULL,
  `tp_course` varchar(255) DEFAULT NULL,
  `tp_phone` varchar(255) DEFAULT NULL,
  `tp_website` varchar(255) DEFAULT NULL,
  `tp_desc` varchar(255) DEFAULT NULL,
  `tp_district` varchar(255) DEFAULT NULL,
  `custom_desc` text CHARACTER SET utf8 COLLATE utf8_unicode_ci,
  `reimbursed` float DEFAULT NULL,
  `require_change` datetime DEFAULT NULL,
  `changed` datetime DEFAULT NULL,
  `allow_below_min_grade_level` tinyint unsigned DEFAULT NULL,
  `allow_above_max_grade_level` tinyint unsigned DEFAULT NULL,
  `template_course_description` text,
  `provisional_provider_id` int unsigned DEFAULT NULL,
  PRIMARY KEY (`schedule_period_id`),
  KEY `schedule_id` (`schedule_id`),
  KEY `subject_id` (`subject_id`),
  KEY `course_id` (`course_id`),
  KEY `mth_provider_id` (`mth_provider_id`),
  KEY `provider_course_id` (`provider_course_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mth_schedule_period`
--

LOCK TABLES `mth_schedule_period` WRITE;
/*!40000 ALTER TABLE `mth_schedule_period` DISABLE KEYS */;
/*!40000 ALTER TABLE `mth_schedule_period` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mth_schoolyear`
--

DROP TABLE IF EXISTS `mth_schoolyear`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mth_schoolyear` (
  `school_year_id` int unsigned NOT NULL AUTO_INCREMENT,
  `date_begin` date DEFAULT NULL,
  `date_end` date DEFAULT NULL,
  `date_reg_open` date DEFAULT NULL,
  `date_reg_close` date DEFAULT NULL,
  `reimburse_open` date DEFAULT NULL,
  `reimburse_tech_open` date DEFAULT NULL,
  `reimburse_close` date DEFAULT NULL,
  `direct_order_open` date DEFAULT NULL,
  `direct_order_tech_enabled` tinyint DEFAULT '0',
  `direct_order_tech_open` date DEFAULT NULL,
  `direct_order_close` date DEFAULT NULL,
  `second_sem_start` date DEFAULT NULL,
  `second_sem_open` date DEFAULT NULL,
  `second_sem_close` date DEFAULT NULL,
  `re_enroll_open` date DEFAULT NULL,
  `re_enroll_deadline` date DEFAULT NULL,
  `midyear_application` int DEFAULT '0',
  `log_submission_close` date DEFAULT NULL,
  `application_close` date DEFAULT NULL,
  `midyear_application_open` date DEFAULT NULL,
  `midyear_application_close` date DEFAULT NULL,
  `re_enroll_notification` int DEFAULT '5',
  `first_sem_learning_logs_close` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`school_year_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mth_schoolyear`
--

LOCK TABLES `mth_schoolyear` WRITE;
/*!40000 ALTER TABLE `mth_schoolyear` DISABLE KEYS */;
/*!40000 ALTER TABLE `mth_schoolyear` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mth_student`
--

DROP TABLE IF EXISTS `mth_student`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mth_student` (
  `student_id` int unsigned NOT NULL AUTO_INCREMENT,
  `person_id` int unsigned NOT NULL,
  `parent_id` int unsigned DEFAULT NULL,
  `parent2_id` int unsigned DEFAULT NULL,
  `grade_level` tinyint unsigned DEFAULT NULL,
  `special_ed` tinyint unsigned NOT NULL DEFAULT '0',
  `diploma_seeking` tinyint unsigned DEFAULT NULL,
  `hidden` tinyint unsigned NOT NULL DEFAULT '0',
  `school_of_enrollment` varchar(120) DEFAULT NULL COMMENT 'No longer used',
  `reenrolled` tinyint DEFAULT '0',
  `teacher_notes` text,
  PRIMARY KEY (`student_id`),
  KEY `person_id` (`person_id`),
  KEY `school_of_enrollment` (`school_of_enrollment`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mth_student`
--

LOCK TABLES `mth_student` WRITE;
/*!40000 ALTER TABLE `mth_student` DISABLE KEYS */;
/*!40000 ALTER TABLE `mth_student` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mth_student_grade_level`
--

DROP TABLE IF EXISTS `mth_student_grade_level`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mth_student_grade_level` (
  `student_id` int unsigned NOT NULL,
  `school_year_id` int unsigned NOT NULL,
  `grade_level` varchar(3) NOT NULL,
  PRIMARY KEY (`student_id`,`school_year_id`),
  KEY `grade_level` (`grade_level`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mth_student_grade_level`
--

LOCK TABLES `mth_student_grade_level` WRITE;
/*!40000 ALTER TABLE `mth_student_grade_level` DISABLE KEYS */;
/*!40000 ALTER TABLE `mth_student_grade_level` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mth_student_homeroom`
--

DROP TABLE IF EXISTS `mth_student_homeroom`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mth_student_homeroom` (
  `student_id` int unsigned NOT NULL,
  `school_year_id` int unsigned NOT NULL,
  `homeroom_canvas_course_id` int unsigned NOT NULL,
  PRIMARY KEY (`student_id`,`school_year_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mth_student_homeroom`
--

LOCK TABLES `mth_student_homeroom` WRITE;
/*!40000 ALTER TABLE `mth_student_homeroom` DISABLE KEYS */;
/*!40000 ALTER TABLE `mth_student_homeroom` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mth_student_immunizations`
--

DROP TABLE IF EXISTS `mth_student_immunizations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mth_student_immunizations` (
  `student_id` int NOT NULL,
  `immunization_id` int NOT NULL,
  `date_administered` datetime NOT NULL,
  `exempt` tinyint(1) NOT NULL,
  `nonapplicable` tinyint(1) NOT NULL,
  `updated_by` int NOT NULL,
  `date_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `date_updated` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `immune` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`student_id`,`immunization_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mth_student_immunizations`
--

LOCK TABLES `mth_student_immunizations` WRITE;
/*!40000 ALTER TABLE `mth_student_immunizations` DISABLE KEYS */;
/*!40000 ALTER TABLE `mth_student_immunizations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mth_student_reenrollment_status`
--

DROP TABLE IF EXISTS `mth_student_reenrollment_status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mth_student_reenrollment_status` (
  `student_id` int NOT NULL,
  `school_year_id` int NOT NULL,
  `reenrolled` tinyint DEFAULT '0',
  PRIMARY KEY (`student_id`,`school_year_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mth_student_reenrollment_status`
--

LOCK TABLES `mth_student_reenrollment_status` WRITE;
/*!40000 ALTER TABLE `mth_student_reenrollment_status` DISABLE KEYS */;
/*!40000 ALTER TABLE `mth_student_reenrollment_status` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mth_student_school`
--

DROP TABLE IF EXISTS `mth_student_school`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mth_student_school` (
  `student_id` int unsigned NOT NULL,
  `school_year_id` int unsigned NOT NULL,
  `school_of_enrollment` tinyint unsigned NOT NULL,
  PRIMARY KEY (`student_id`,`school_year_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mth_student_school`
--

LOCK TABLES `mth_student_school` WRITE;
/*!40000 ALTER TABLE `mth_student_school` DISABLE KEYS */;
/*!40000 ALTER TABLE `mth_student_school` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mth_student_section`
--

DROP TABLE IF EXISTS `mth_student_section`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mth_student_section` (
  `student_id` int unsigned NOT NULL,
  `period_num` tinyint unsigned NOT NULL,
  `schoolYear_id` int unsigned NOT NULL,
  `name` varchar(120) NOT NULL,
  PRIMARY KEY (`student_id`,`period_num`,`schoolYear_id`),
  KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mth_student_section`
--

LOCK TABLES `mth_student_section` WRITE;
/*!40000 ALTER TABLE `mth_student_section` DISABLE KEYS */;
/*!40000 ALTER TABLE `mth_student_section` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mth_student_status`
--

DROP TABLE IF EXISTS `mth_student_status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mth_student_status` (
  `student_id` int unsigned NOT NULL,
  `school_year_id` int unsigned NOT NULL,
  `status` tinyint unsigned NOT NULL,
  `date_updated` datetime DEFAULT NULL,
  PRIMARY KEY (`student_id`,`school_year_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mth_student_status`
--

LOCK TABLES `mth_student_status` WRITE;
/*!40000 ALTER TABLE `mth_student_status` DISABLE KEYS */;
/*!40000 ALTER TABLE `mth_student_status` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mth_student_status_history`
--

DROP TABLE IF EXISTS `mth_student_status_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mth_student_status_history` (
  `student_id` int unsigned NOT NULL,
  `school_year_id` int unsigned NOT NULL,
  `status` tinyint unsigned NOT NULL,
  `date_updated` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mth_student_status_history`
--

LOCK TABLES `mth_student_status_history` WRITE;
/*!40000 ALTER TABLE `mth_student_status_history` DISABLE KEYS */;
/*!40000 ALTER TABLE `mth_student_status_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mth_subject`
--

DROP TABLE IF EXISTS `mth_subject`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mth_subject` (
  `subject_id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `desc` varchar(255) DEFAULT NULL,
  `show_providers` tinyint unsigned NOT NULL DEFAULT '1',
  `require_tp_desc` tinyint unsigned NOT NULL DEFAULT '0',
  `allow_2nd_sem_change` varchar(28) NOT NULL DEFAULT '',
  `archived` tinyint unsigned NOT NULL DEFAULT '0',
  `available` tinyint unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`subject_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mth_subject`
--

LOCK TABLES `mth_subject` WRITE;
/*!40000 ALTER TABLE `mth_subject` DISABLE KEYS */;
/*!40000 ALTER TABLE `mth_subject` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mth_subject_period`
--

DROP TABLE IF EXISTS `mth_subject_period`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mth_subject_period` (
  `subject_id` int unsigned NOT NULL,
  `period` tinyint unsigned NOT NULL,
  PRIMARY KEY (`subject_id`,`period`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mth_subject_period`
--

LOCK TABLES `mth_subject_period` WRITE;
/*!40000 ALTER TABLE `mth_subject_period` DISABLE KEYS */;
/*!40000 ALTER TABLE `mth_subject_period` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mth_system_log`
--

DROP TABLE IF EXISTS `mth_system_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mth_system_log` (
  `log_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL DEFAULT '0',
  `new_value` longtext,
  `old_value` longtext,
  `type` varchar(50) DEFAULT NULL,
  `archive` int DEFAULT '0',
  `tag` varchar(50) DEFAULT '0',
  `date_created` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `date_updated` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`log_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mth_system_log`
--

LOCK TABLES `mth_system_log` WRITE;
/*!40000 ALTER TABLE `mth_system_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `mth_system_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mth_testoptout`
--

DROP TABLE IF EXISTS `mth_testoptout`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mth_testoptout` (
  `testOptOut_id` int unsigned NOT NULL AUTO_INCREMENT,
  `in_attendance` tinyint unsigned NOT NULL,
  `parent_id` int unsigned NOT NULL,
  `sig_file_id` int unsigned NOT NULL,
  `school_year_id` int unsigned NOT NULL,
  `date_submitted` datetime NOT NULL,
  PRIMARY KEY (`testOptOut_id`),
  KEY `parent_id` (`parent_id`),
  KEY `school_year_id` (`school_year_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mth_testoptout`
--

LOCK TABLES `mth_testoptout` WRITE;
/*!40000 ALTER TABLE `mth_testoptout` DISABLE KEYS */;
/*!40000 ALTER TABLE `mth_testoptout` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mth_testoptout_student`
--

DROP TABLE IF EXISTS `mth_testoptout_student`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mth_testoptout_student` (
  `testOptOut_id` int unsigned NOT NULL,
  `student_id` int unsigned NOT NULL,
  `sent_to_dropbox` tinyint unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`testOptOut_id`,`student_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mth_testoptout_student`
--

LOCK TABLES `mth_testoptout_student` WRITE;
/*!40000 ALTER TABLE `mth_testoptout_student` DISABLE KEYS */;
/*!40000 ALTER TABLE `mth_testoptout_student` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mth_transitioned`
--

DROP TABLE IF EXISTS `mth_transitioned`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mth_transitioned` (
  `transition_id` int unsigned NOT NULL AUTO_INCREMENT,
  `student_id` int unsigned DEFAULT NULL,
  `school_year_id` int unsigned DEFAULT NULL,
  `reason` tinyint unsigned DEFAULT NULL,
  `new_school_name` varchar(255) DEFAULT NULL,
  `new_school_address` varchar(255) DEFAULT NULL,
  `sig_file_id` int unsigned DEFAULT NULL,
  `datetime` datetime DEFAULT NULL,
  `status` tinyint unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`transition_id`),
  KEY `student_id` (`student_id`),
  KEY `school_year_id` (`school_year_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mth_transitioned`
--

LOCK TABLES `mth_transitioned` WRITE;
/*!40000 ALTER TABLE `mth_transitioned` DISABLE KEYS */;
/*!40000 ALTER TABLE `mth_transitioned` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mth_user_announcement`
--

DROP TABLE IF EXISTS `mth_user_announcement`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mth_user_announcement` (
  `id` int NOT NULL AUTO_INCREMENT,
  `announcement_id` int NOT NULL DEFAULT '0',
  `user_id` int NOT NULL DEFAULT '0',
  `status` int NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `announcement_id` (`announcement_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mth_user_announcement`
--

LOCK TABLES `mth_user_announcement` WRITE;
/*!40000 ALTER TABLE `mth_user_announcement` DISABLE KEYS */;
/*!40000 ALTER TABLE `mth_user_announcement` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mth_withdrawal`
--

DROP TABLE IF EXISTS `mth_withdrawal`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mth_withdrawal` (
  `withdrawal_id` int unsigned NOT NULL AUTO_INCREMENT,
  `student_id` int unsigned DEFAULT NULL,
  `school_year_id` int unsigned DEFAULT NULL,
  `reason` tinyint unsigned DEFAULT NULL,
  `new_school_name` varchar(255) DEFAULT NULL,
  `new_school_address` varchar(255) DEFAULT NULL,
  `sig_file_id` int unsigned DEFAULT NULL,
  `datetime` datetime DEFAULT NULL,
  `status` tinyint unsigned NOT NULL DEFAULT '0',
  `reason_txt` text,
  `intent_reenroll_action` datetime DEFAULT NULL,
  `effective_date` datetime DEFAULT NULL,
  `active` tinyint(1) DEFAULT '1',
  `created_by` int DEFAULT NULL,
  `automatically_withdrawn` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`withdrawal_id`),
  KEY `student_id` (`student_id`),
  KEY `school_year_id` (`school_year_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mth_withdrawal`
--

LOCK TABLES `mth_withdrawal` WRITE;
/*!40000 ALTER TABLE `mth_withdrawal` DISABLE KEYS */;
/*!40000 ALTER TABLE `mth_withdrawal` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nav`
--

DROP TABLE IF EXISTS `nav`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nav` (
  `nav` varchar(60) NOT NULL,
  `nav_item_id` int unsigned NOT NULL AUTO_INCREMENT,
  `order` int NOT NULL DEFAULT '0',
  `path` varchar(256) DEFAULT NULL,
  `title` varchar(60) DEFAULT NULL,
  `parent_nav_item_id` int unsigned DEFAULT NULL,
  PRIMARY KEY (`nav_item_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nav`
--

LOCK TABLES `nav` WRITE;
/*!40000 ALTER TABLE `nav` DISABLE KEYS */;
/*!40000 ALTER TABLE `nav` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `parent`
--

DROP TABLE IF EXISTS `parent`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `parent` (
  `id` int NOT NULL AUTO_INCREMENT,
  `child_id` int NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `parent_email` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_ed40c643fb21de46a695777d4db` (`child_id`),
  CONSTRAINT `FK_ed40c643fb21de46a695777d4db` FOREIGN KEY (`child_id`) REFERENCES `core_users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `parent`
--

LOCK TABLES `parent` WRITE;
/*!40000 ALTER TABLE `parent` DISABLE KEYS */;
/*!40000 ALTER TABLE `parent` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `parent_users`
--

DROP TABLE IF EXISTS `parent_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `parent_users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `child_id` int NOT NULL,
  `parent_email` varchar(255) NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  KEY `FK_7fc2a2095725d28a052c68c028d` (`child_id`),
  CONSTRAINT `FK_7fc2a2095725d28a052c68c028d` FOREIGN KEY (`child_id`) REFERENCES `core_users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `parent_users`
--

LOCK TABLES `parent_users` WRITE;
/*!40000 ALTER TABLE `parent_users` DISABLE KEYS */;
/*!40000 ALTER TABLE `parent_users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `query-result-cache`
--

DROP TABLE IF EXISTS `query-result-cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `query-result-cache` (
  `id` int NOT NULL AUTO_INCREMENT,
  `identifier` varchar(255) DEFAULT NULL,
  `time` bigint NOT NULL,
  `duration` int NOT NULL,
  `query` text NOT NULL,
  `result` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `query-result-cache`
--

LOCK TABLES `query-result-cache` WRITE;
/*!40000 ALTER TABLE `query-result-cache` DISABLE KEYS */;
/*!40000 ALTER TABLE `query-result-cache` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `region`
--

DROP TABLE IF EXISTS `region`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `region` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `region_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_54bf2818af7cc627f2f81f091a6` (`region_id`),
  CONSTRAINT `FK_54bf2818af7cc627f2f81f091a6` FOREIGN KEY (`region_id`) REFERENCES `user_region` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `region`
--

LOCK TABLES `region` WRITE;
/*!40000 ALTER TABLE `region` DISABLE KEYS */;
INSERT INTO `region` VALUES (1,'Arizona','2022-01-26 00:22:40.451421','2022-01-26 00:22:40.451421',NULL),(2,'Colorado','2022-01-26 00:23:13.362035','2022-01-26 00:23:13.362035',NULL),(3,'Idaho','2022-01-26 00:23:23.294119','2022-01-26 00:23:23.294119',NULL),(4,'Indiana','2022-01-26 00:23:30.109060','2022-01-26 00:23:30.109060',NULL),(5,'Wyoming','2022-01-26 00:23:36.392794','2022-01-26 00:23:36.392794',NULL);
/*!40000 ALTER TABLE `region` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `level` int NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `role_user_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_3ca5e3663cd241f5136599d60f3` (`role_user_id`),
  CONSTRAINT `FK_3ca5e3663cd241f5136599d60f3` FOREIGN KEY (`role_user_id`) REFERENCES `core_users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'Super Admin',1,'2022-01-24 22:51:20.897739','2022-01-24 22:51:20.930279',NULL),(2,'Admin',2,'2022-01-24 22:51:20.897739','2022-01-24 22:51:20.930279',NULL),(3,'Sub Admin Reimbursements/Direct Orders',3,'2022-01-24 22:51:20.897739','2022-02-11 21:15:50.292371',NULL),(4,'Sub Admin Enrollment',4,'2022-01-24 22:51:20.897739','2022-01-24 22:51:20.930279',NULL),(5,'Sub Admin Interventions',5,'2022-01-24 22:51:20.897739','2022-01-24 22:51:20.930279',NULL),(6,'Sub Admin Homeroom Resources',6,'2022-01-24 22:51:20.897739','2022-01-24 22:51:20.930279',NULL),(7,'Sub Admin Announcements',7,'2022-01-24 22:51:20.897739','2022-01-24 22:51:20.930279',NULL),(8,'Sub Admin Clubs/Classes',8,'2022-01-24 22:51:20.897739','2022-01-24 22:51:20.930279',NULL),(9,'Teacher Assistant (TA) Provider',9,'2022-01-24 22:51:20.897739','2022-01-24 22:51:20.930279',NULL),(10,'Teacher Assistant (TA) School of Enrollment',10,'2022-01-24 22:51:20.897739','2022-01-24 22:51:20.930279',NULL),(12,'School Partner',12,'2022-01-24 22:51:20.897739','2022-01-24 22:51:20.930279',NULL),(13,'Student',13,'2022-01-24 22:51:20.897739','2022-01-24 22:51:20.930279',NULL),(14,'Observer',14,'2022-01-24 22:51:20.897739','2022-01-24 22:51:20.930279',NULL),(15,'Parent',15,'2022-01-24 22:51:20.897739','2022-01-24 22:51:20.930279',NULL),(16,'Teacher',16,'2022-01-24 22:51:20.897739','2022-01-24 22:51:20.930279',NULL),(17,'Teacher Assistant Sped',11,'2022-01-24 22:51:20.897739','2022-01-24 22:51:20.930279',NULL);
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `settings`
--

DROP TABLE IF EXISTS `settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `settings` (
  `name` varchar(60) NOT NULL,
  `category` varchar(60) NOT NULL DEFAULT '',
  `title` varchar(120) DEFAULT NULL,
  `type` varchar(50) NOT NULL,
  `value` mediumtext NOT NULL,
  `description` text,
  `user_changeable` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`name`,`category`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `settings`
--

LOCK TABLES `settings` WRITE;
/*!40000 ALTER TABLE `settings` DISABLE KEYS */;
/*!40000 ALTER TABLE `settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_access`
--

DROP TABLE IF EXISTS `user_access`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_access` (
  `id` int NOT NULL AUTO_INCREMENT,
  `access_id` int NOT NULL,
  `user_id` int NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  KEY `FK_28c120cfc3b647c3e640ec9cad8` (`access_id`),
  KEY `FK_ef280129d58c9c4e0a0536bace1` (`user_id`),
  CONSTRAINT `FK_28c120cfc3b647c3e640ec9cad8` FOREIGN KEY (`access_id`) REFERENCES `access` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_ef280129d58c9c4e0a0536bace1` FOREIGN KEY (`user_id`) REFERENCES `core_users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=245 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_access`
--

LOCK TABLES `user_access` WRITE;
/*!40000 ALTER TABLE `user_access` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_access` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_region`
--

DROP TABLE IF EXISTS `user_region`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_region` (
  `id` int NOT NULL AUTO_INCREMENT,
  `region_id` int NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_7088249272d24af667dad6197c4` (`region_id`),
  KEY `FK_ca74d606b02413df47cbee68df9` (`user_id`),
  CONSTRAINT `FK_7088249272d24af667dad6197c4` FOREIGN KEY (`region_id`) REFERENCES `region` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_ca74d606b02413df47cbee68df9` FOREIGN KEY (`user_id`) REFERENCES `core_users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=188 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_region`
--

LOCK TABLES `user_region` WRITE;
/*!40000 ALTER TABLE `user_region` DISABLE KEYS */;
INSERT INTO `user_region` VALUES (185,1,'2022-02-11 01:59:07.758538','2022-02-11 01:59:07.758538',8030),(187,1,'2022-02-11 02:02:47.032624','2022-02-11 02:02:47.032624',8032);
/*!40000 ALTER TABLE `user_region` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_roles`
--

DROP TABLE IF EXISTS `user_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `role_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_b23c65e50a758245a33ee35fda1` (`role_id`),
  KEY `FK_87b8888186ca9769c960e926870` (`user_id`),
  CONSTRAINT `FK_87b8888186ca9769c960e926870` FOREIGN KEY (`user_id`) REFERENCES `core_users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `FK_b23c65e50a758245a33ee35fda1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=108 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_roles`
--

LOCK TABLES `user_roles` WRITE;
/*!40000 ALTER TABLE `user_roles` DISABLE KEYS */;
INSERT INTO `user_roles` VALUES (104,8029,'2022-02-11 01:58:32.896250','2022-02-11 01:58:32.896250',10),(105,8030,'2022-02-11 01:59:07.740156','2022-02-11 01:59:07.740156',17),(107,8032,'2022-02-11 02:02:47.013698','2022-02-11 02:02:47.013698',12);
/*!40000 ALTER TABLE `user_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(120) NOT NULL,
  `first_name` varchar(60) DEFAULT NULL,
  `last_name` varchar(60) DEFAULT NULL,
  `password` varchar(120) NOT NULL,
  `level` tinyint unsigned NOT NULL DEFAULT '1',
  `cookie` varchar(120) DEFAULT NULL,
  `last_login` datetime DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `yoda_answers_file`
--

DROP TABLE IF EXISTS `yoda_answers_file`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `yoda_answers_file` (
  `id` int NOT NULL AUTO_INCREMENT,
  `student_assesment_id` int DEFAULT NULL,
  `mth_file_id` int NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `student_assesment_id` (`student_assesment_id`),
  KEY `mth_file_id` (`mth_file_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `yoda_answers_file`
--

LOCK TABLES `yoda_answers_file` WRITE;
/*!40000 ALTER TABLE `yoda_answers_file` DISABLE KEYS */;
/*!40000 ALTER TABLE `yoda_answers_file` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `yoda_assessment_answers`
--

DROP TABLE IF EXISTS `yoda_assessment_answers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `yoda_assessment_answers` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `yoda_student_asses_id` int NOT NULL,
  `yoda_assessment_question_id` int NOT NULL,
  `data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `type` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `yoda_student_asses_id` (`yoda_student_asses_id`),
  KEY `yoda_assessment_question_id` (`yoda_assessment_question_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `yoda_assessment_answers`
--

LOCK TABLES `yoda_assessment_answers` WRITE;
/*!40000 ALTER TABLE `yoda_assessment_answers` DISABLE KEYS */;
/*!40000 ALTER TABLE `yoda_assessment_answers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `yoda_assessment_question`
--

DROP TABLE IF EXISTS `yoda_assessment_question`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `yoda_assessment_question` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `yoda_teacher_asses_id` int NOT NULL,
  `data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `type` int DEFAULT NULL,
  `number` int DEFAULT NULL,
  `special` tinyint DEFAULT '0',
  `plg_subject` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_required` tinyint DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `yoda_assessment_question`
--

LOCK TABLES `yoda_assessment_question` WRITE;
/*!40000 ALTER TABLE `yoda_assessment_question` DISABLE KEYS */;
/*!40000 ALTER TABLE `yoda_assessment_question` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `yoda_courses`
--

DROP TABLE IF EXISTS `yoda_courses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `yoda_courses` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `mth_course_id` int NOT NULL,
  `school_year_id` int NOT NULL,
  `workflow_state` int DEFAULT NULL,
  `type` int NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `teacher_user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `mth_course_id` (`mth_course_id`),
  KEY `school_year_id` (`school_year_id`),
  KEY `teacher_user_id` (`teacher_user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `yoda_courses`
--

LOCK TABLES `yoda_courses` WRITE;
/*!40000 ALTER TABLE `yoda_courses` DISABLE KEYS */;
/*!40000 ALTER TABLE `yoda_courses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `yoda_files`
--

DROP TABLE IF EXISTS `yoda_files`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `yoda_files` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `user_id` int NOT NULL,
  `file_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `yoda_files`
--

LOCK TABLES `yoda_files` WRITE;
/*!40000 ALTER TABLE `yoda_files` DISABLE KEYS */;
/*!40000 ALTER TABLE `yoda_files` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `yoda_homeroom_messages`
--

DROP TABLE IF EXISTS `yoda_homeroom_messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `yoda_homeroom_messages` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `title` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `teacher_user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `yoda_homeroom_messages_yoda_course_id_teacher_user_id_index` (`teacher_user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `yoda_homeroom_messages`
--

LOCK TABLES `yoda_homeroom_messages` WRITE;
/*!40000 ALTER TABLE `yoda_homeroom_messages` DISABLE KEYS */;
/*!40000 ALTER TABLE `yoda_homeroom_messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `yoda_homeroom_messages_recepient`
--

DROP TABLE IF EXISTS `yoda_homeroom_messages_recepient`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `yoda_homeroom_messages_recepient` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `yoda_homeroom_messages_id` int NOT NULL,
  `person_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `person_id` (`person_id`),
  KEY `yoda_homeroom_messages_id` (`yoda_homeroom_messages_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `yoda_homeroom_messages_recepient`
--

LOCK TABLES `yoda_homeroom_messages_recepient` WRITE;
/*!40000 ALTER TABLE `yoda_homeroom_messages_recepient` DISABLE KEYS */;
/*!40000 ALTER TABLE `yoda_homeroom_messages_recepient` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `yoda_messages`
--

DROP TABLE IF EXISTS `yoda_messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `yoda_messages` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `person_id` int NOT NULL,
  `message_title` text CHARACTER SET utf8 COLLATE utf8_general_ci,
  `message_content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `message_thread_id` int NOT NULL,
  `viewed` int DEFAULT NULL,
  `to_person_id` int DEFAULT NULL,
  `archived` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `person_id` (`person_id`),
  KEY `to_person_id` (`to_person_id`),
  KEY `message_thread_id` (`message_thread_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `yoda_messages`
--

LOCK TABLES `yoda_messages` WRITE;
/*!40000 ALTER TABLE `yoda_messages` DISABLE KEYS */;
/*!40000 ALTER TABLE `yoda_messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `yoda_plgs`
--

DROP TABLE IF EXISTS `yoda_plgs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `yoda_plgs` (
  `plg_id` int NOT NULL AUTO_INCREMENT,
  `grade_level` varchar(50) NOT NULL DEFAULT '0',
  `plg_name` varchar(250) NOT NULL DEFAULT '0',
  `school_year_id` int NOT NULL DEFAULT '0',
  `subject` varchar(50) NOT NULL DEFAULT '0',
  `plg_type` int NOT NULL DEFAULT '1',
  `date_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`plg_id`),
  KEY `plg_id` (`plg_id`),
  KEY `school_year_id` (`school_year_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `yoda_plgs`
--

LOCK TABLES `yoda_plgs` WRITE;
/*!40000 ALTER TABLE `yoda_plgs` DISABLE KEYS */;
/*!40000 ALTER TABLE `yoda_plgs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `yoda_portfolios`
--

DROP TABLE IF EXISTS `yoda_portfolios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `yoda_portfolios` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `user_id` int NOT NULL,
  `portfolio_data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `yoda_portfolios`
--

LOCK TABLES `yoda_portfolios` WRITE;
/*!40000 ALTER TABLE `yoda_portfolios` DISABLE KEYS */;
/*!40000 ALTER TABLE `yoda_portfolios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `yoda_section`
--

DROP TABLE IF EXISTS `yoda_section`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `yoda_section` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` int NOT NULL,
  `yoda_course_id` int NOT NULL,
  `school_year_id` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `yoda_section`
--

LOCK TABLES `yoda_section` WRITE;
/*!40000 ALTER TABLE `yoda_section` DISABLE KEYS */;
/*!40000 ALTER TABLE `yoda_section` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `yoda_sign_on_pages`
--

DROP TABLE IF EXISTS `yoda_sign_on_pages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `yoda_sign_on_pages` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `url` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `sso_data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_sso` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `yoda_sign_on_pages`
--

LOCK TABLES `yoda_sign_on_pages` WRITE;
/*!40000 ALTER TABLE `yoda_sign_on_pages` DISABLE KEYS */;
/*!40000 ALTER TABLE `yoda_sign_on_pages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `yoda_student_assessments`
--

DROP TABLE IF EXISTS `yoda_student_assessments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `yoda_student_assessments` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `person_id` int NOT NULL,
  `assessment_id` int NOT NULL,
  `is_late` int NOT NULL DEFAULT '0',
  `grade` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `message_id` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `reset` int DEFAULT NULL,
  `excused` int DEFAULT NULL,
  `draft` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `person_id` (`person_id`),
  KEY `assessment_id` (`assessment_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `yoda_student_assessments`
--

LOCK TABLES `yoda_student_assessments` WRITE;
/*!40000 ALTER TABLE `yoda_student_assessments` DISABLE KEYS */;
/*!40000 ALTER TABLE `yoda_student_assessments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `yoda_student_homeroom`
--

DROP TABLE IF EXISTS `yoda_student_homeroom`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `yoda_student_homeroom` (
  `student_id` int NOT NULL,
  `school_year_id` int NOT NULL,
  `yoda_course_id` int NOT NULL,
  `date_assigned` datetime NOT NULL,
  UNIQUE KEY `student_year` (`student_id`,`school_year_id`),
  KEY `yoda_course_id` (`yoda_course_id`),
  KEY `student_id` (`student_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `yoda_student_homeroom`
--

LOCK TABLES `yoda_student_homeroom` WRITE;
/*!40000 ALTER TABLE `yoda_student_homeroom` DISABLE KEYS */;
/*!40000 ALTER TABLE `yoda_student_homeroom` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `yoda_teacher_assessments`
--

DROP TABLE IF EXISTS `yoda_teacher_assessments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `yoda_teacher_assessments` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `created_by_user_id` int NOT NULL,
  `course_id` int NOT NULL,
  `title` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `deadline` datetime NOT NULL,
  `type` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `course_id` (`course_id`),
  KEY `created_by_user_id` (`created_by_user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `yoda_teacher_assessments`
--

LOCK TABLES `yoda_teacher_assessments` WRITE;
/*!40000 ALTER TABLE `yoda_teacher_assessments` DISABLE KEYS */;
/*!40000 ALTER TABLE `yoda_teacher_assessments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `yoda_todos`
--

DROP TABLE IF EXISTS `yoda_todos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `yoda_todos` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `user_id` int NOT NULL,
  `todo` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` int NOT NULL,
  `type​` int NOT NULL,
  `type_id` int NOT NULL,
  `deadline` datetime NOT NULL,
  `date_completed` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `yoda_todos`
--

LOCK TABLES `yoda_todos` WRITE;
/*!40000 ALTER TABLE `yoda_todos` DISABLE KEYS */;
/*!40000 ALTER TABLE `yoda_todos` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-02-15  2:07:15
