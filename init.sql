-- Database creation and selection
CREATE DATABASE IF NOT EXISTS urban_connect;
USE urban_connect;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
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
  service_type VARCHAR(255) NOT NULL
);

-- Insert sample data into professionals table
INSERT INTO professionals (name, rating, jobs, experience, cost_per_hour, location, description, image, service_type)
VALUES 
  ('John Doe', 4.8, 156, 5, 45.0, 'Downtown', 'Certified electrician specializing in residential and commercial electrical services.', 'https://via.placeholder.com/100', 'electrician'),
  ('Sarah Smith', 4.9, 203, 8, 55.0, 'Westside', 'Master electrician with expertise in smart home installations.', 'https://via.placeholder.com/100', 'electrician'),
  ('Mike Johnson', 4.7, 178, 6, 50.0, 'Eastside', 'Licensed plumber specializing in emergency repairs and installations.', 'https://via.placeholder.com/100', 'plumber');

-- Set MySQL root password authentication method
ALTER USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY 'root';
FLUSH PRIVILEGES;
