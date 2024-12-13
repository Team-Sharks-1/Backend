# Backend for Capstone Project

This backend is built with Node.js and Express, using MySQL as the database to store user registration information.

## Prerequisites

Ensure the following are installed on your system:
- [Node.js and npm](https://nodejs.org/)
- [MySQL Server](https://dev.mysql.com/)

## Setup Instructions

### 1. Clone the Repository
Clone the project repository to your local machine:
```bash
git clone https://github.com/your-username/your-repository.git
cd your-repository/backend
```

### 2. Install Node.js Dependencies
Install the required Node.js packages:
```bash
npm install
```

### 3. MySQL Setup

#### Install MySQL
1. Update your package list:
   ```bash
   sudo apt update
   ```

2. Install MySQL Server:
   ```bash
   sudo apt install mysql-server
   ```

3. Start and enable MySQL service to run on startup:
   ```bash
   sudo systemctl start mysql
   sudo systemctl enable mysql
   ```

4. Secure the MySQL installation:
   ```bash
   sudo mysql_secure_installation
   ```
   - Follow the prompts to set a root password and apply additional security settings.

#### Configure the Database
1. Log into MySQL as the root user:
   ```bash
   sudo mysql -u root -p
   ```
   - Enter the password you set during the `mysql_secure_installation` process.

2. Create the database and `users` table:
   ```sql
   CREATE DATABASE urban_connect;
   USE urban_connect;
   CREATE TABLE users (
     id INT PRIMARY KEY AUTO_INCREMENT,
     name VARCHAR(255) NOT NULL,
     email VARCHAR(255) UNIQUE NOT NULL,
     password VARCHAR(255) NOT NULL,
     location VARCHAR(255)
   );
   ```
   Create table for professionals_login
   ```sql
   CREATE TABLE professionals_login (
   id INT PRIMARY KEY AUTO_INCREMENT,
   service_type VARCHAR(255) NOT NULL,
   name VARCHAR(255) NOT NULL,
   address VARCHAR(255) NOT NULL,
   email VARCHAR(255) UNIQUE NOT NULL,
   phone_number VARCHAR(20) NOT NULL,
   license_id VARCHAR(100) NOT NULL,
   password VARCHAR(255) NOT NULL,
   license_image_url VARCHAR(255),  -- Column to store the URL of the license image
   is_verified BOOLEAN DEFAULT FALSE, 
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- Automatically sets the current timestamp
   );
   ```
   Create table professionals:
    ```sql
   CREATE TABLE professionals (
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

   ```
Insert raw data for professional information:
   ```sql
   INSERT INTO professionals (name, rating, jobs, experience, cost_per_hour, location, description, image, service_type, email) 
      VALUES 
      -- Electrician
      ('John Doe', 4.7, 120, 5, 25.0, 'Downtown', 'Experienced electrician with expertise in residential wiring and repairs.', 'https://example.com/images/john_doe.jpg', 'electrician', 'johndoe@example.com'),
      ('Jane Smith', 4.5, 95, 3, 22.0, 'Uptown', 'Certified electrician offering reliable and safe electrical services.', 'https://example.com/images/jane_smith.jpg', 'electrician', 'janesmith@example.com'),
      
      -- Plumber
      ('Michael Brown', 4.8, 140, 7, 30.0, 'Eastside', 'Expert plumber for installations, maintenance, and emergency repairs.', 'https://example.com/images/michael_brown.jpg', 'plumber', 'michaelbrown@example.com'),
      ('Laura Wilson', 4.6, 110, 4, 28.0, 'Westside', 'Skilled plumber with a focus on quick and efficient solutions.', 'https://example.com/images/laura_wilson.jpg', 'plumber', 'laurawilson@example.com'),
      
      -- Gardener
      ('Peter Green', 4.9, 150, 6, 20.0, 'Downtown', 'Passionate gardener specializing in landscaping and plant care.', 'https://example.com/images/peter_green.jpg', 'gardener', 'petergreen@example.com'),
      ('Sophie Bloom', 4.7, 100, 3, 18.0, 'Eastside', 'Dedicated to creating beautiful gardens and green spaces.', 'https://example.com/images/sophie_bloom.jpg', 'gardener', 'sophiebloom@example.com'),
      
      -- Tutor
      ('Emily White', 4.8, 80, 5, 40.0, 'Uptown', 'Experienced tutor specializing in math and science.', 'https://example.com/images/emily_white.jpg', 'tutor', 'emilywhite@example.com'),
      ('Robert Black', 4.6, 60, 4, 35.0, 'Westside', 'Expert in languages and literature tutoring.', 'https://example.com/images/robert_black.jpg', 'tutor', 'robertblack@example.com'),
      
      -- Maid
      ('Anna Brown', 4.9, 200, 8, 15.0, 'Downtown', 'Professional cleaner with a focus on thoroughness and attention to detail.', 'https://example.com/images/anna_brown.jpg', 'maid', 'annabrown@example.com'),
      ('Chris Taylor', 4.7, 180, 6, 14.0, 'Uptown', 'Reliable maid service for residential and commercial cleaning.', 'https://example.com/images/chris_taylor.jpg', 'maid', 'christaylor@example.com'),
      
      -- Carpenter
      ('Liam Wood', 4.8, 130, 6, 25.0, 'Eastside', 'Skilled carpenter specializing in custom furniture and repairs.', 'https://example.com/images/liam_wood.jpg', 'carpenter', 'liamwood@example.com'),
      ('Olivia Craft', 4.6, 110, 4, 24.0, 'Westside', 'Experienced in creating unique woodwork designs.', 'https://example.com/images/olivia_craft.jpg', 'carpenter', 'oliviacraft@example.com'),
      
      -- Mechanic
      ('Ethan Carver', 4.9, 160, 7, 30.0, 'Downtown', 'Reliable mechanic with expertise in engine repairs and maintenance.', 'https://example.com/images/ethan_carver.jpg', 'mechanic', 'ethancarver@example.com'),
      ('Sophia Drive', 4.7, 140, 5, 28.0, 'Uptown', 'Certified auto repair technician with years of experience.', 'https://example.com/images/sophia_drive.jpg', 'mechanic', 'sophiadrive@example.com'),
      
      -- Pet Care
      ('Daniel Paw', 4.8, 120, 5, 20.0, 'Eastside', 'Caring pet sitter with experience in handling various animals.', 'https://example.com/images/daniel_paw.jpg', 'petcare', 'danielpaw@example.com'),
      ('Sarah Furry', 4.6, 100, 4, 18.0, 'Westside', 'Reliable pet caregiver specializing in dog walking and sitting.', 'https://example.com/images/sarah_furry.jpg', 'petcare', 'sarahfurry@example.com'),
      
      -- Healthcare
      ('Dr. Alice Care', 4.9, 250, 10, 50.0, 'Downtown', 'Experienced healthcare professional providing home medical services.', 'https://example.com/images/alice_care.jpg', 'healthcare', 'alicecare@example.com'),
      ('Nurse Mark Heal', 4.7, 180, 8, 45.0, 'Uptown', 'Compassionate home nurse with a focus on patient well-being.', 'https://example.com/images/mark_heal.jpg', 'healthcare', 'markheal@example.com');
   ```

Create table bookings:

 ```sql
   CREATE TABLE bookings (
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

   ```
Insert raw data for multiple types of bookings
   ```sql
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

   ```
4. Set MySQL root user to use `mysql_native_password` (to avoid authentication issues):
   ```sql
   ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root';
   FLUSH PRIVILEGES;
   ```

#### Install MySQL Node.js Library
Back in the project directory, install the `mysql2` package to enable MySQL connectivity in Node.js:
```bash
npm install mysql2
```

### 4. Update Database Configuration in `index.js`
In your project’s `index.js` file, set up the MySQL connection configuration with the database details:

```javascript
const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',     // MySQL root password
  database: 'urban_connect'
});

db.connect((err) => {
  if (err) {
    console.error('Database connection error:', err);
    return;
  }
  console.log('Connected to MySQL database');
});
```

### 5. Start the Server
To start the backend server, run:
```bash
sudo node index.js
```
The server should now be running on `http://localhost:5000`.

### 6. API Endpoints

The following endpoints are available in this backend:

#### 1. POST /api/register - Register a new user.
   - **Description**: Registers a new user by creating a database entry with the user’s details.
   - **Request Body**:
     - `name` (string, required): User's full name.
     - `email` (string, required): User's email address (must be unique).
     - `password` (string, required): User’s password (minimum 8 characters, hashed).
     - `location` (string, required): User's location.
   - **Response**:
     - **201 Created**: `{ "message": "User registered successfully!" }`
     - **400 Bad Request**: `{ "error": "User already exists!" }` if the email is already in use.
     - **500 Internal Server Error**: `{ "error": "Error registering user", "details": "<error message>" }` for any other errors.

#### 2. POST /api/login - Log in an existing user.
   - **Description**: Authenticates a user with email and password.
   - **Request Body**:
     - `email` (string, required): User’s email address.
     - `password` (string, required): User’s password.
   - **Response**:
     - **200 OK**: `{ "message": "Login successful!", "user": { "id": <id>, "name": "<name>", "email": "<email>" } }` if login is successful.
     - **401 Unauthorized**: `{ "error": "Invalid email or password!" }` if email or password is incorrect.
     - **500 Internal Server Error**: `{ "error": "Error during login", "details": "<error message>" }` for any other errors.

#### 3. GET /api/professionals - Fetch professionals by service type.
   - **Description**: Returns a list of professionals based on a specified service type.
   - **Query Parameter**:
     - `service` (string, required): Service type to filter professionals (e.g., `electrician`, `plumber`).
   - **Response**:
     - **200 OK**: An array of professional objects for the specified service type.
     - **400 Bad Request**: `{ "error": "Service type is required" }` if the `service` query parameter is missing.
     - **500 Internal Server Error**: `{ "error": "Failed to fetch professionals" }` for other errors.

#### 4. POST /api/login_professional - Log in an existing professional.
   - **Description**: Authenticates a professional using email and password.
   - **Request Body**:
     - `email` (string, required): Professional’s email address.
     - `password` (string, required): Professional’s password.
   - **Response**:
     - **200 OK**: `{ "message": "Login successful!", "professional": { "id": <id>, "name": "<name>", "email": "<email>" } }` if login is successful.
     - **401 Unauthorized**: `{ "error": "Invalid email or password!" }` if the email or password is incorrect.
     - **500 Internal Server Error**: `{ "error": "Error during login", "details": "<error message>" }` for other errors.

#### 5. POST /api/register_professionals - Register a new professional.
   - **Description**: Registers a new professional by creating an entry in the `professionals_login` table with their details.
   - **Request Body**:
     - `serviceType` (string, required): Type of service the professional provides (e.g., electrician, plumber).
     - `name` (string, required): Professional’s full name.
     - `address` (string, required): Professional’s address.
     - `email` (string, required): Professional’s email address (must be unique).
     - `phoneNumber` (string, required): Professional’s contact number.
     - `licenseId` (string, required): License ID of the professional.
     - `password` (string, required): Professional’s password (minimum 8 characters, hashed).
   - **Response**:
     - **201 Created**: `{ "message": "Professional registered successfully!" }`
     - **400 Bad Request**: `{ "error": "Professional already registered with this email!" }` if the email is already in use.
     - **500 Internal Server Error**: `{ "error": "Error registering professional", "details": "<error message>" }` for any other errors.



## Additional Notes

- For production, it is recommended to create a dedicated MySQL user instead of using `root` for enhanced security.
- Ensure sensitive information, such as database credentials, is stored securely and not hard-coded in production environments.

This completes the setup for the backend and MySQL configuration. You can now push this `README.md` to your Git repository.
