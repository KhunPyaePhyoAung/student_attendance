-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema student_attendance
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `student_attendance` ;

-- -----------------------------------------------------
-- Schema student_attendance
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `student_attendance` DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ;
USE `student_attendance` ;

-- -----------------------------------------------------
-- Table `student_attendance`.`instructor`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `student_attendance`.`instructor` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NULL,
  `nrc` VARCHAR(45) NOT NULL,
  `gender` ENUM('MALE', 'FEMALE') NOT NULL,
  `date_of_birth` DATE NOT NULL,
  `phone` VARCHAR(45) NOT NULL,
  `address` VARCHAR(500) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `nrc_UNIQUE` (`nrc` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `student_attendance`.`user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `student_attendance`.`user` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(255) NOT NULL,
  `password` VARCHAR(100) NOT NULL,
  `role` ENUM('ADMIN', 'INSTRUCTOR', 'STUDENT') NOT NULL,
  `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `student_attendance`.`student`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `student_attendance`.`student` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL,
  `nrc` VARCHAR(45) NOT NULL,
  `role_no` VARCHAR(45) NOT NULL,
  `phone` VARCHAR(45) NOT NULL,
  `family_phone` VARCHAR(45) NOT NULL,
  `gender` ENUM('MALE', 'FEMALE') NOT NULL,
  `date_of_birth` DATE NOT NULL,
  `address` VARCHAR(500) NOT NULL,
  `year` ENUM('Y1', 'Y2', 'Y3', 'Y4', 'Y5', 'Y6') NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `nrc_UNIQUE` (`nrc` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `student_attendance`.`subject`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `student_attendance`.`subject` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `code` VARCHAR(45) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `instructor_id` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `code_UNIQUE` (`code` ASC),
  INDEX `fk_subject_instructor1_idx` (`instructor_id` ASC),
  CONSTRAINT `fk_subject_instructor1`
    FOREIGN KEY (`instructor_id`)
    REFERENCES `student_attendance`.`instructor` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `student_attendance`.`term`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `student_attendance`.`term` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `start_date` DATE NOT NULL,
  `end_date` DATE NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `name_UNIQUE` (`name` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `student_attendance`.`term_has_subject`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `student_attendance`.`term_has_subject` (
  `term_id` INT NOT NULL,
  `subject_id` INT NOT NULL,
  PRIMARY KEY (`term_id`, `subject_id`),
  INDEX `fk_term_has_subject_subject1_idx` (`subject_id` ASC),
  INDEX `fk_term_has_subject_term_idx` (`term_id` ASC),
  CONSTRAINT `fk_term_has_subject_term`
    FOREIGN KEY (`term_id`)
    REFERENCES `student_attendance`.`term` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_term_has_subject_subject1`
    FOREIGN KEY (`subject_id`)
    REFERENCES `student_attendance`.`subject` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `student_attendance`.`term_has_student`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `student_attendance`.`term_has_student` (
  `term_id` INT NOT NULL,
  `student_id` INT NOT NULL,
  PRIMARY KEY (`term_id`, `student_id`),
  INDEX `fk_term_has_student_student1_idx` (`student_id` ASC),
  INDEX `fk_term_has_student_term1_idx` (`term_id` ASC),
  CONSTRAINT `fk_term_has_student_term1`
    FOREIGN KEY (`term_id`)
    REFERENCES `student_attendance`.`term` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_term_has_student_student1`
    FOREIGN KEY (`student_id`)
    REFERENCES `student_attendance`.`student` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `student_attendance`.`roll_call`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `student_attendance`.`roll_call` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `date` DATE NOT NULL,
  `start_time` TIME NOT NULL,
  `end_time` TIME NOT NULL,
  `status` ENUM('OPENING', 'CLOSED') NOT NULL DEFAULT 'OPENING',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `instructor_id` INT UNSIGNED NOT NULL,
  `subject_id` INT NOT NULL,
  `attendance_code` VARCHAR(500) NOT NULL,
  `term_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_roll_call_instructor1_idx` (`instructor_id` ASC),
  INDEX `fk_roll_call_subject1_idx` (`subject_id` ASC),
  INDEX `fk_roll_call_term1_idx` (`term_id` ASC),
  CONSTRAINT `fk_roll_call_instructor1`
    FOREIGN KEY (`instructor_id`)
    REFERENCES `student_attendance`.`instructor` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_roll_call_subject1`
    FOREIGN KEY (`subject_id`)
    REFERENCES `student_attendance`.`subject` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_roll_call_term1`
    FOREIGN KEY (`term_id`)
    REFERENCES `student_attendance`.`term` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `student_attendance`.`attendance`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `student_attendance`.`attendance` (
  `roll_call_id` INT UNSIGNED NOT NULL,
  `student_id` INT NOT NULL,
  INDEX `fk_attendance_roll_call1_idx` (`roll_call_id` ASC),
  PRIMARY KEY (`student_id`, `roll_call_id`),
  CONSTRAINT `fk_attendance_roll_call1`
    FOREIGN KEY (`roll_call_id`)
    REFERENCES `student_attendance`.`roll_call` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_attendance_student1`
    FOREIGN KEY (`student_id`)
    REFERENCES `student_attendance`.`student` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
