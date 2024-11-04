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
       id INT AUTO_INCREMENT PRIMARY KEY,
       name VARCHAR(255) NOT NULL,
       email VARCHAR(255) UNIQUE NOT NULL,
       password VARCHAR(255) NOT NULL
   );
   ```

3. Set MySQL root user to use `mysql_native_password` (to avoid authentication issues):
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
- **POST /register** - Register a new user with `name`, `email`, and `password`.
- **POST /login** - Log in an existing user with `email` and `password`.

## Additional Notes

- For production, it is recommended to create a dedicated MySQL user instead of using `root` for enhanced security.
- Ensure sensitive information, such as database credentials, is stored securely and not hard-coded in production environments.

This completes the setup for the backend and MySQL configuration. You can now push this `README.md` to your Git repository.
