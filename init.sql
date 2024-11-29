-- Database creation and selection
CREATE DATABASE IF NOT EXISTS urban_connect;
USE urban_connect;

-- Create users table
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  location VARCHAR(255)
);

-- Create professionals_login table
CREATE TABLE IF NOT EXISTS professionals_login (
  id INT PRIMARY KEY AUTO_INCREMENT,
  service_type VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  license_id VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create professionals table
CREATE TABLE IF NOT EXISTS professionals (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  rating FLOAT NOT NULL,
  jobs INT NOT NULL,
  experience INT NOT NULL,
  cost_per_hour FLOAT NOT NULL,
  location VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  image VARCHAR(255) NOT NULL,
  service_type VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
   id INT PRIMARY KEY AUTO_INCREMENT, -- Unique ID for each booking
   customer_name VARCHAR(255) NOT NULL, -- Name of the customer
   date DATE NOT NULL, -- Booking date
   time TIME NOT NULL, -- Booking time
   location VARCHAR(255) NOT NULL, -- Location of the service
   price DECIMAL(10, 2) NOT NULL, -- Booking price
   status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending', -- Booking status, defaults to 'pending'
   professional_id INT DEFAULT NULL, -- ID of the professional handling the booking, default is NULL
   user_id INT, -- ID of the user associated with the booking
   description TEXT, -- Description of the booking
   service_type VARCHAR(255) DEFAULT NULL, -- Service type (new field added)
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- When the booking was created
   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- Last update time
   FOREIGN KEY (professional_id) REFERENCES professionals_login(id), -- Link to professionals_login table
   FOREIGN KEY (user_id) REFERENCES users(id) -- Link to users table
);

CREATE INDEX idx_status ON bookings (status);
CREATE INDEX idx_professional_id ON bookings (professional_id);

INSERT INTO bookings (customer_name, date, time, location, price, status, professional_id, created_at, updated_at, user_id, description, service_type)
VALUES
 -- Electrician
 ('John Doe', '2023-12-01', '09:00:00', 'City Center', 80.00, 'pending', NULL, NOW(), NOW(), NULL, 'Electrical wiring installation', 'electrician'),
 ('Jane Smith', '2023-12-02', '10:30:00', 'Downtown', 95.00, 'pending', NULL, NOW(), NOW(), NULL, 'Lighting repair', 'electrician'),
 ('Alice Cooper', '2023-12-03', '13:00:00', 'North Park', 100.00, 'pending', NULL, NOW(), NOW(), NULL, 'Socket replacement', 'electrician'),

 -- Plumber
 ('Bob Marley', '2023-12-04', '11:00:00', 'Uptown', 120.00, 'pending', NULL, NOW(), NOW(), NULL, 'Leaky faucet repair', 'plumber'),
 ('Michael Jordan', '2023-12-05', '14:30:00', 'Eastside', 150.00, 'pending', NULL, NOW(), NOW(), NULL, 'Pipe replacement', 'plumber'),
 ('Emily Stone', '2023-12-06', '16:00:00', 'Westside', 180.00, 'pending', NULL, NOW(), NOW(), NULL, 'Clogged drain repair', 'plumber'),

 -- Gardener
 ('Sarah Connor', '2023-12-07', '08:00:00', 'South Park', 80.00, 'pending', NULL, NOW(), NOW(), NULL, 'Lawn mowing', 'gardener'),
 ('Chris Hemsworth', '2023-12-08', '10:30:00', 'West End', 110.00, 'pending', NULL, NOW(), NOW(), NULL, 'Tree pruning', 'gardener'),
 ('Natalie Portman', '2023-12-09', '12:00:00', 'North Hills', 90.00, 'pending', NULL, NOW(), NOW(), NULL, 'Garden design', 'gardener'),

 -- Tutor
 ('Tom Hanks', '2023-12-10', '09:30:00', 'City Center', 70.00, 'pending', NULL, NOW(), NOW(), NULL, 'Math tutoring', 'tutor'),
 ('Leonardo DiCaprio', '2023-12-11', '14:00:00', 'Uptown', 90.00, 'pending', NULL, NOW(), NOW(), NULL, 'English tutoring', 'tutor'),
 ('Emma Watson', '2023-12-12', '16:00:00', 'Eastside', 85.00, 'pending', NULL, NOW(), NOW(), NULL, 'History tutoring', 'tutor'),

 -- Maid
 ('Jennifer Lopez', '2023-12-13', '08:30:00', 'Southside', 150.00, 'pending', NULL, NOW(), NOW(), NULL, 'Home cleaning', 'maid'),
 ('Beyoncé Knowles', '2023-12-14', '10:15:00', 'North Park', 180.00, 'pending', NULL, NOW(), NOW(), NULL, 'Apartment cleaning', 'maid'),
 ('Rihanna Fenty', '2023-12-15', '12:00:00', 'West Hills', 160.00, 'pending', NULL, NOW(), NOW(), NULL, 'Spring cleaning', 'maid'),

 -- Carpenter
 ('Will Smith', '2023-12-16', '09:00:00', 'City Center', 130.00, 'pending', NULL, NOW(), NOW(), NULL, 'Furniture assembly', 'carpenter'),
 ('Dwayne Johnson', '2023-12-17', '11:30:00', 'Uptown', 140.00, 'pending', NULL, NOW(), NOW(), NULL, 'Cabinet installation', 'carpenter'),
 ('Keanu Reeves', '2023-12-18', '14:00:00', 'Eastside', 120.00, 'pending', NULL, NOW(), NOW(), NULL, 'Door repair', 'carpenter'),

 -- Mechanic
 ('Vin Diesel', '2023-12-19', '10:00:00', 'West End', 200.00, 'pending', NULL, NOW(), NOW(), NULL, 'Oil change', 'mechanic'),
 ('Paul Walker', '2023-12-20', '13:00:00', 'North Park', 250.00, 'pending', NULL, NOW(), NOW(), NULL, 'Brake replacement', 'mechanic'),
 ('Jason Statham', '2023-12-21', '15:30:00', 'South Park', 220.00, 'pending', NULL, NOW(), NOW(), NULL, 'Engine check-up', 'mechanic'),

 -- Pet Care
 ('Margot Robbie', '2023-12-22', '08:30:00', 'Uptown', 50.00, 'pending', NULL, NOW(), NOW(), NULL, 'Dog walking', 'petcare'),
 ('Brad Pitt', '2023-12-23', '10:00:00', 'Downtown', 60.00, 'pending', NULL, NOW(), NOW(), NULL, 'Pet sitting', 'petcare'),
 ('Angelina Jolie', '2023-12-24', '12:00:00', 'West Hills', 55.00, 'pending', NULL, NOW(), NOW(), NULL, 'Pet grooming', 'petcare'),

 -- Healthcare
 ('Julia Roberts', '2023-12-25', '09:30:00', 'Northside', 200.00, 'pending', NULL, NOW(), NOW(), NULL, 'Home healthcare visit', 'healthcare'),
 ('Meryl Streep', '2023-12-26', '14:00:00', 'Eastside', 220.00, 'pending', NULL, NOW(), NOW(), NULL, 'Nursing services', 'healthcare'),
 ('Nicole Kidman', '2023-12-27', '16:30:00', 'Southside', 250.00, 'pending', NULL, NOW(), NOW(), NULL, 'Elder care', 'healthcare');

   DELIMITER $$
   CREATE TRIGGER prevent_double_accept
   BEFORE UPDATE ON bookings
   FOR EACH ROW
   BEGIN
     IF NEW.status = 'accepted' AND OLD.status = 'accepted' THEN
       SIGNAL SQLSTATE '45000'
       SET MESSAGE_TEXT = 'This booking has already been accepted by another professional.';
     END IF;
   END$$
   DELIMITER ;

INSERT INTO professionals (name, rating, jobs, experience, cost_per_hour, location, description, image, service_type, email)
VALUES 
  ('John Doe', 4.8, 156, 5, 45.0, 'Downtown', 'Certified electrician specializing in residential and commercial electrical services.', 'https://via.placeholder.com/100', 'electrician', 'johndoe@example.com'),
  ('Sarah Smith', 4.9, 203, 8, 55.0, 'Westside', 'Master electrician with expertise in smart home installations.', 'https://via.placeholder.com/100', 'electrician', 'sarahsmith@example.com'),
  ('Mike Johnson', 4.7, 178, 6, 50.0, 'Eastside', 'Licensed plumber specializing in emergency repairs and installations.', 'https://via.placeholder.com/100', 'plumber', 'mikejohnson@example.com');


-- Set MySQL root password authentication method
ALTER USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY 'root';
FLUSH PRIVILEGES;