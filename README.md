# Backend Application

A simple backend application built with Node.js and Express for user registration and login.

## Features

- User registration with username, password, name, location, phone number, and email.
- User login functionality.

## Installation

1. Clone the repository:

   ```
   git clone https://github.com/Team-Sharks-1/Backend.git
   ```

2. Navigate to the project directory:

   ```
   cd Backend
   ```

3. Install the dependencies:

   ```
   npm install
   ```

## Usage

1. Start the server:

   ```
   node index.js
   ```

2. Access the API at `http://localhost:3000`.

## API Endpoints

### Register User

- **POST** `/register`
- **Request Body**:

  ```json
  {
      "name": "John Doe",
      "email": "john.doe@example.com"
      "password": "testpassword",
  }
  ```

### Login User

- **POST** `/login`
- **Request Body**:

  ```json
  {
      "email": "john.doe@example.com"
      "password": "testpassword"
  }
  ```

## License

This project is licensed under the MIT License.
