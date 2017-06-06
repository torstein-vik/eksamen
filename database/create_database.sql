SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Database of eksamen
-- -----------------------------------------------------

CREATE SCHEMA IF NOT EXISTS `eksamen` DEFAULT CHARACTER SET utf8 ;
USE `eksamen` ;

-- User table
CREATE TABLE IF NOT EXISTS `users` (
  `userid` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(45) NOT NULL,
  `passhash` BINARY(32) NOT NULL,
  `passsalt` BINARY(32) NOT NULL,
  `privilege` ENUM('user', 'admin') NOT NULL,
  `address` VARCHAR(45) NOT NULL,
  `postnummer` VARCHAR(4) NOT NULL,
  `telefonnummer` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`userid`),
  FOREIGN KEY (`postnummer`)
    REFERENCES `poststed` (`postnummer`),
  UNIQUE INDEX `username_UNIQUE` (`username` ASC))
ENGINE = InnoDB;

-- Apartment table
CREATE TABLE IF NOT EXISTS `apartments` (
  `apartmentid` INT NOT NULL AUTO_INCREMENT,
  `apartmentnumber` CHAR(4) NOT NULL,
  PRIMARY KEY (`apartmentid`))
ENGINE = InnoDB;

-- Apartment image table
CREATE TABLE IF NOT EXISTS `apartment_images` (
  `apartment_imageid` INT NOT NULL AUTO_INCREMENT,
  `apartmentid` INT NOT NULL,
  `path` VARCHAR(45) NOT NULL,
  `imagetext` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`apartment_imageid`),
  FOREIGN KEY (`apartmentid`)
    REFERENCES `apartments` (`apartmentid`))
ENGINE = InnoDB;

-- Reservations table
CREATE TABLE `reservations` (
  `reservationid` INT NOT NULL AUTO_INCREMENT,
  `userid` INT NOT NULL,
  `apartmentid` INT NOT NULL,
  `date_start` TIMESTAMP NOT NULL,
  `date_end` TIMESTAMP NOT NULL,
  PRIMARY KEY(`reservationid`),
  FOREIGN KEY (`userid`)
    REFERENCES `users` (`userid`),
  FOREIGN KEY (`apartmentid`)
    REFERENCES `apartments` (`apartmentid`))
ENGINE = InnoDB;

-- Poststed table
CREATE TABLE IF NOT EXISTS `poststed` (
    `postnummer` VARCHAR(4) NOT NULL,
    `poststed` VARCHAR(45) NOT NULL,
    PRIMARY KEY (`postnummer`))
ENGINE = InnoDB;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
