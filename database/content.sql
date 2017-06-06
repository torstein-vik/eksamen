
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


INSERT INTO apartments (apartmentnumber, description, price, featured_img) VALUES
('101', '2-etasjers leilighet med kjøkken, 2 bad, stue, og 2 soverom. Vi kan love fantastisk utsikt over fjorden!', '499', '1'),
('202', 'Koslig flat leilighet med stor stue, 1 bad, og ett soverom. Hva skal med kjøkken, sant?', '199', '4'),
('303', 'Denne store leiligheten har alt man trenger; 5 bad, 3 soverom, og kjempestor stue. I tillegg har den et skikkelig kjøkken!', '999', '7'),
('404', 'Rimelig og koslig leilighet med stue, bad, og soverom. ', '99', '8');


INSERT INTO apartment_images (apartmentid, path, imagetext) VALUES
('1', 'res/apartment1a.jpg', 'Koslig kjøkken'),
('1', 'res/apartment1b.jpg', 'Moderne stue'),
('2', 'res/apartment2a.jpg', 'Kvit sofa'),
('2', 'res/apartment2b.jpg', 'hvitt bord med plante på'),
('3', 'res/apartment3a.jpg', 'Luksuriøst kjøkken'),
('3', 'res/apartment3b.jpg', 'Dekt bord med utsikt'),
('3', 'res/apartment3b.jpg', 'Den store stua'),
('4', 'res/apartment4a.jpg', 'Den rimelige stua');


-- Reenable foreign key checks
SET FOREIGN_KEY_CHECKS=1;
