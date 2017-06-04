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
  PRIMARY KEY (`userid`),
  UNIQUE INDEX `username_UNIQUE` (`username` ASC))
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
