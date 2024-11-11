const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const mysql = require('mysql2');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3001;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';

// MySQL Database Connection to localhost
const db = mysql.createConnection({
  host: 'localhost',
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

// Professional Login Endpoint
app.post('/api/login_professional', validateProfessionalLogin, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: 'Validation error', details: errors.array() });
  }

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

    // Login successful
    console.log('Login successful for professional:', email);
    return res.status(200).json({ message: 'Login successful!', professional: { id: professional.id, name: professional.name, email: professional.email } });

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

    // Login successful
    console.log('Login successful for user:', email);
    return res.status(200).json({ message: 'Login successful!', user: { id: user.id, name: user.name, email: user.email } });

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

  try {
    const [results] = await db.promise().query('SELECT * FROM professionals WHERE service_type = ?', [serviceType]);
    res.json(results);
  } catch (error) {
    console.error('Error fetching professionals:', error);
    res.status(500).json({ error: 'Failed to fetch professionals' });
  }
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
