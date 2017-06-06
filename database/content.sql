
-- SQL script for adding content

-- If you get Error Code 1175, Go to Edit -> Preferences -> "SQL Editor" -> "Other" -> uncheck "Safe Updates". Then go to Query -> Reconnect to Server

USE `eksamen`;

-- Disable foreign key checks until later
SET FOREIGN_KEY_CHECKS=0;

-- Deleting all previous entries
DELETE FROM `apartments`;
DELETE FROM `apartment_images`;


-- Reseting auto_increment
ALTER TABLE `apartments` AUTO_INCREMENT = 1;
ALTER TABLE `apartment_images` AUTO_INCREMENT = 1;


INSERT INTO apartments (apartmentnumber, description, featured_img) VALUES
('101', 'Fantastisk utsikt over fjorden', '1'),
('202', 'Fantastisk utsikt over fjorden 2', '4'),
('303', 'Fantastisk utsikt over fjorden 3', '6'),
('404', 'Fantastisk utsikt over fjorden 4', '8');


INSERT INTO apartment_images (apartmentid, path, imagetext) VALUES
('1', 'res/placeholder.png', 'Placeholder 123'),
('1', 'res/placeholder.png', 'Placeholder 321'),
('2', 'res/placeholder.png', 'Placeholder 1234'),
('2', 'res/placeholder.png', 'Placeholder 4321'),
('3', 'res/placeholder.png', 'Placeholder 12345'),
('3', 'res/placeholder.png', 'Placeholder 54321'),
('4', 'res/placeholder.png', 'Placeholder 123456'),
('4', 'res/placeholder.png', 'Placeholder 654321');


-- Reenable foreign key checks
SET FOREIGN_KEY_CHECKS=1;
