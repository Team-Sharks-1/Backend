const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const mysql = require('mysql2');
const multer = require('multer');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3001;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';

// MySQL Database Connection to localhost
const db = mysql.createConnection({
  host: 'mysql-container',
  user: 'root',
  password: 'root',
  database: 'urban_connect'
});

db.connect((err) => {
  if (err) {
    console.error('Database connection error:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Middleware
app.use(cors({
  origin: CORS_ORIGIN,
  credentials: true
}));
app.use(bodyParser.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Input validation middleware
const validateRegistration = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
  body('name').trim().notEmpty()
];

const validateLogin = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
];

// Additional validation for professional registration
const validateProfessionalRegistration = [
  body('serviceType').trim().notEmpty(),
  body('name').trim().notEmpty(),
  body('address').trim().notEmpty(),
  body('email').isEmail().normalizeEmail(),
  body('phoneNumber').trim().notEmpty(),
  body('licenseId').trim().notEmpty(),
  body('password').isLength({ min: 8 })
];

// Validation for professional login
const validateProfessionalLogin = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
];

const jwt = require('jsonwebtoken');

// JWT secret key (store securely in .env or config)
const JWT_SECRET = 'your_secret_key';

// Middleware to verify professional JWT token and extract user info (like `id`)
const verifyJWT = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Get token from Authorization header
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Failed to authenticate token' });
    }

    // Store decoded user ID in request object
    req.professionalId = decoded.id;
    next();
  });
};

// Professional Login Endpoint
app.post('/api/login_professional', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find professional by email in the professionals_login table
    const [rows] = await db.promise().query('SELECT * FROM professionals_login WHERE email = ?', [email]);
    if (rows.length === 0) {
      console.log('Professional not found with email:', email);
      return res.status(401).json({ error: 'Invalid email or password!' });
    }

    const professional = rows[0];
    console.log('Found professional:', professional);

    // Compare provided password with stored hash
    const isMatch = await bcrypt.compare(password, professional.password);
    if (!isMatch) {
      console.log('Password mismatch for professional:', email);
      return res.status(401).json({ error: 'Invalid email or password!' });
    }

    // Generate JWT token with professional id
    const token = jwt.sign(
      { id: professional.id },
      JWT_SECRET,
      { expiresIn: '1h' } // Token expires in 1 hour (adjust as needed)
    );

    // Login successful, return the JWT token and professional details
    console.log('Login successful for professional:', email);
    return res.status(200).json({
      message: 'Login successful!',
      token: token, // Send the token back to the client
      professional: {
        id: professional.id,
        name: professional.name,
        email: professional.email
      }
    });

  } catch (error) {
    console.error('Error during professional login:', error);
    return res.status(500).json({ error: 'Error during login', details: error.message });
  }
});

// Register Professional Endpoint
app.post('/api/register_professionals', validateProfessionalRegistration, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { serviceType, name, address, email, phoneNumber, licenseId, password } = req.body;

  try {
    // Check if professional with the same email already exists
    const [existingProfessional] = await db.promise().query('SELECT * FROM professionals_login WHERE email = ?', [email]);
    if (existingProfessional.length) {
      return res.status(400).json({ error: 'Professional already registered with this email!' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert professional into the professionals_login table
    await db.promise().query(
      'INSERT INTO professionals_login (service_type, name, address, email, phone_number, license_id, password) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [serviceType, name, address, email, phoneNumber, licenseId, hashedPassword]
    );

    res.status(201).json({ message: 'Professional registered successfully!' });
  } catch (error) {
    console.error('Error registering professional:', error);
    res.status(500).json({ error: 'Error registering professional', details: error.message });
  }
});

// Register endpoint
app.post('/api/register', validateRegistration, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password, name, location } = req.body; // Include location

  try {
    // Check if user already exists
    const [existingUser] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser.length) {
      return res.status(400).json({ error: 'User already exists!' });
    }
  
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
  
    // Insert user into the database (including location)
    await db.promise().query('INSERT INTO users (name, email, password, location) VALUES (?, ?, ?, ?)', [name, email, hashedPassword, location]);
  
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Error registering user', details: error.message });
  }
});

// Login endpoint
app.post('/api/login', validateLogin, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: 'Validation error', details: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // Find user by email
    const [rows] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      console.log('User not found with email:', email);
      return res.status(401).json({ error: 'Invalid email or password!' });
    }

    const user = rows[0];
    console.log('Found user:', user);

    // Compare provided password with stored hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password mismatch for user:', email);
      return res.status(401).json({ error: 'Invalid email or password!' });
    }

    // Generate JWT token with user id
    const token = jwt.sign(
      { id: user.id },
      JWT_SECRET,
      { expiresIn: '1h' } // Token expires in 1 hour (adjust as needed)
    );

    // Login successful, return the JWT token and user details
    console.log('Login successful for user:', email);
    return res.status(200).json({
      message: 'Login successful!',
      token: token, // Send the token back to the client
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ error: 'Error during login', details: error.message });
  }
});

// API to fetch professionals based on service type
app.get('/api/professionals', async (req, res) => {
  const serviceType = req.query.service;

  if (!serviceType) {
    return res.status(400).json({ error: 'Service type is required' });
  }

  // Check if serviceType is a non-empty string
  if (typeof serviceType !== 'string' || serviceType.trim() === '') {
    return res.status(400).json({ error: 'Invalid service type provided' });
  } 

  try {
    const [results] = await db.promise().query('SELECT * FROM professionals WHERE service_type = ?', [serviceType]);
    // Check if any professionals were found
    if (results.length === 0) {
      return res.status(404).json({ error: 'No professionals found for the given service type' });
    }
    res.json(results);
  } catch (error) {
    console.error('Error fetching professionals:', error);
    res.status(500).json({ error: 'Failed to fetch professionals' });
  }
});

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

app.post('/api/create_professional', upload.single('image'), (req, res) => {
  const { name, experience, cost_per_hour, location, description, service_type, email } = req.body;
  const image = req.file ? req.file.path : null;
  const rating = 5.0; // Default rating value, adjust as needed
  const jobs = 0; // Default jobs completed
  

  db.query(
    'INSERT INTO professionals (name, rating, jobs, experience, cost_per_hour, location, description, service_type, email, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [name, rating, jobs, experience, cost_per_hour, location, description, service_type, email, image],
    (error, results) => {
      if (error) {
        console.error("Database Error: ", error); // Log the specific database error
        return res.status(500).json({ message: 'Error creating professional profile', error: error.message });
      }
      res.status(201).json({ message: 'Professional profile created successfully' });
    }
  );
});

// Endpoint to get professional by ID
app.get('/api/get_professional/:id', (req, res) => {
  const professionalId = req.params.id;

  db.query('SELECT * FROM professionals WHERE id = ?', [professionalId], (error, results) => {
    if (error) {
      console.error("Database Error:", error);
      return res.status(500).json({ message: 'Error retrieving professional data' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Professional not found' });
    }
    res.json(results[0]); // Return the first result as the professional data
  });
});

// API endpoint to handle form submission
app.post('/api/book', (req, res) => {
  const { date, time, description } = req.body;

  // SQL query to insert form data into the database
  const query = 'INSERT INTO bookings (date, time, description) VALUES (?, ?, ?)';

  db.execute(query, [date, time, description], (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.status(200).json({ message: 'Booking confirmed', data: result });
  });
});

// Endpoint to get professional by ID
app.get('/api/get_professional/:id', (req, res) => {
  const professionalId = req.params.id;

  db.query('SELECT * FROM professionals WHERE id = ?', [professionalId], (error, results) => {
    if (error) {
      console.error("Database Error:", error);
      return res.status(500).json({ message: 'Error retrieving professional data' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Professional not found' });
    }
    res.json(results[0]); // Return the first result as the professional data
  });
});

//Change professional password
app.post('/api/professional_change_password', async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  const token = req.headers['authorization']?.split(' ')[1]; // Get token from Authorization header

  // Check if the token is present
  if (!token) {
    return res.status(401).json({ error: 'Authorization token is required.' });
  }

  // Validate that all fields are provided
  if (!currentPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  // Validate that new password and confirm password match
  if (newPassword !== confirmPassword) {
    return res.status(400).json({ error: 'New password and confirm password do not match.' });
  }

  // Validate that new password is different from the current password
  if (currentPassword === newPassword) {
    return res.status(400).json({ error: 'New password cannot be the same as the current password.' });
  }

  try {
    // Verify the token and extract the professional id
    const decoded = jwt.verify(token, JWT_SECRET);
    const professionalId = decoded.id; // Extract the ID from the JWT

    // Find the professional by id
    const [rows] = await db.promise().query('SELECT * FROM professionals_login WHERE id = ?', [professionalId]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Professional not found.' });
    }

    const professional = rows[0];

    // Compare the current password with the stored hash
    const isMatch = await bcrypt.compare(currentPassword, professional.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Current password is incorrect.' });
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update the password in the database
    await db.promise().query('UPDATE professionals_login SET password = ? WHERE id = ?', [hashedNewPassword, professionalId]);

    // Respond with success
    res.status(200).json({ message: 'Password updated successfully.' });
  } catch (error) {
    console.error('Error updating password:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid or expired token.' });
    }
    res.status(500).json({ error: 'An error occurred while updating the password.' });
  }
});

// Booking acceptance/rejection endpoint
app.post('/api/booking/:id/action', verifyJWT, async (req, res) => {
  const bookingId = req.params.id;
  const { action } = req.body; // "accept" or "reject"
  const professionalId = req.professionalId; // Retrieved from the JWT

  if (!["accept", "reject"].includes(action)) {
    return res.status(400).json({ error: "Invalid action. Allowed actions: 'accept', 'reject'" });
  }

  try {
    // Check the current status of the booking
    const [bookingRows] = await db.promise().query('SELECT * FROM bookings WHERE id = ?', [bookingId]);

    if (bookingRows.length === 0) {
      return res.status(404).json({ error: 'Booking not found.' });
    }

    const booking = bookingRows[0];

    // If the booking is already accepted by another vendor, reject the action
    if (booking.status === 'accepted' && booking.professional_id !== professionalId) {
      return res.status(403).json({ error: 'Booking has already been accepted by another professional.' });
    }

    // Update the booking status based on the action
    let newStatus = '';
    if (action === 'accept') {
      newStatus = 'accepted';
    } else if (action === 'reject') {
      newStatus = 'rejected';
    }

    // Update booking in the database
    await db.promise().query(
      'UPDATE bookings SET status = ?, professional_id = ? WHERE id = ?',
      [newStatus, action === 'accept' ? professionalId : null, bookingId]
    );

    return res.status(200).json({ message: `Booking successfully ${action}ed.` });
  } catch (error) {
    console.error('Error updating booking:', error);
    return res.status(500).json({ error: 'Failed to update booking.', details: error.message });
  }
});

app.get('/api/bookings', verifyJWT, async (req, res) => {
  const professionalId = req.professionalId;

  try {
    // First, fetch the service type of the logged-in professional from the professional's table
    const [professional] = await db.promise().query(
      'SELECT service_type FROM professionals_login WHERE id = ?',
      [professionalId]
    );

    if (professional.length === 0) {
      return res.status(404).json({ error: 'Professional not found' });
    }

    const serviceType = professional[0].service_type;

    // Now fetch the bookings that match the service type and have either no assigned professional or match the logged-in professional's ID
    const [bookings] = await db.promise().query(
      'SELECT * FROM bookings WHERE (professional_id IS NULL OR professional_id = ?) AND service_type = ?',
      [professionalId, serviceType]
    );

    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings.' });
  }
});

// Get profile endpoint
app.get('/api/profile', (req, res) => {
  const email = req.session?.user?.email; // Assuming session stores user data
  if (!email) {
    return res.status(401).json({ error: 'User not logged in' });
  }

  db.promise()
    .query('SELECT name, email, phone FROM users WHERE email = ?', [email])
    .then(([rows]) => {
      if (rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json({ user: rows[0] });
    })
    .catch(err => res.status(500).json({ error: 'Database error', details: err.message }));
});

// Middleware to verify user JWT token and extract user info (like `id`)
const verifyUserJWT = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Get token from Authorization header

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Failed to authenticate token or not a user' });
    }

    req.userId = decoded.id; // Store user ID in the request object
    next();
  });
};

// Create Booking Endpoint
app.post('/api/bookings', verifyUserJWT, async (req, res) => {
  const { date, time, description, service, price, location } = req.body; // Include location in request body
  const userId = req.userId; // Extracted from JWT for the authenticated user (userId)

  if (!date || !time || !description || !service || !price || !location) {
    return res.status(400).json({ error: 'All fields (date, time, description, service, price, and location) are required.' });
  }

  try {
    // Step 1: Fetch the customer name from the users table
    const [userResult] = await db.promise().query(
      'SELECT name FROM users WHERE id = ?',
      [userId]
    );

    if (userResult.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const customerName = userResult[0].name;

    // Step 2: Insert the booking into the bookings table with the customer name, price, location, and other details
    const [result] = await db.promise().query(
      'INSERT INTO bookings (user_id, professional_id, date, time, description, status, service_type, customer_name, price, location) ' +
      'VALUES (?, NULL, ?, ?, ?, ?, ?, ?, ?, ?)',
      [userId, date, time, description, 'pending', service, customerName, price, location] // Include location
    );

    res.status(201).json({
      message: 'Booking created successfully!',
      bookingId: result.insertId, // Return the newly created booking ID
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Failed to create booking.', details: error.message });
  }
});

// Assuming we are fetching all bookings for the logged-in user
app.get('/api/user_bookings', verifyUserJWT, async (req, res) => {
  const userId = req.userId; // Extracted from JWT for the authenticated user (userId)

  try {
    // Fetch bookings from the database
    const [bookings] = await db.promise().query(
      'SELECT * FROM bookings WHERE user_id = ? ORDER BY date DESC',
      [userId]
    );

    if (bookings.length === 0) {
      return res.status(404).json({ error: 'No bookings found for this user.' });
    }

    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings.', details: error.message });
  }
});

// Change user password
app.post('/api/user_change_password', async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  const token = req.headers['authorization']?.split(' ')[1]; // Get token from Authorization header

  // Check if the token is present
  if (!token) {
    return res.status(401).json({ error: 'Authorization token is required.' });
  }

  // Validate that all fields are provided
  if (!currentPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  // Validate that new password and confirm password match
  if (newPassword !== confirmPassword) {
    return res.status(400).json({ error: 'New password and confirm password do not match.' });
  }

  // Validate that new password is different from the current password
  if (currentPassword === newPassword) {
    return res.status(400).json({ error: 'New password cannot be the same as the current password.' });
  }

  try {
    // Verify the token and extract the user id
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id; // Extract the ID from the JWT

    // Find the user by id
    const [rows] = await db.promise().query('SELECT * FROM users WHERE id = ?', [userId]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const user = rows[0];

    // Compare the current password with the stored hash
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Current password is incorrect.' });
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update the password in the database
    await db.promise().query('UPDATE users SET password = ? WHERE id = ?', [hashedNewPassword, userId]);

    // Respond with success
    res.status(200).json({ message: 'Password updated successfully.' });
  } catch (error) {
    console.error('Error updating password:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid or expired token.' });
    }
    res.status(500).json({ error: 'An error occurred while updating the password.' });
  }
});

// Define an API endpoint to get professional details
app.get("/api/professionaldetails", (req, res) => {
  const query = `
 SELECT id, name, service_type AS profession, email AS contact from professionals;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching professional details: ", err);
      return res.status(500).json({ error: "Database query error" });
    }
    return res.json(results); // Send the fetched data as JSON
  });
});

// Route to get all users details
app.get('/api/usersdetails', (req, res) => {
  const query = 'SELECT id, name, email FROM users'; // Selecting only required fields
  
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error fetching users' });
    }
    res.json(results); // Send the results as JSON
  });
});

// Route to get all bookings details
app.get('/api/bookingsdetails', (req, res) => {
  const query = `
    SELECT 
      b.id, 
      u.name AS user, 
      b.service_type AS service, 
      b.date, 
      b.time
    FROM bookings b
    JOIN users u ON b.user_id = u.id
  `;

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error fetching bookings' });
    }
    res.json(results); // Send the results as JSON
  });
});

// Route to delete a booking
app.delete('/api/bookingsdetails/:id', (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM bookings WHERE id = ?';
  
  db.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error deleting booking' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.status(200).json({ message: `Booking with ID ${id} deleted successfully` });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
