const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const app = express();

// Mock MySQL Connection
jest.mock('mysql2', () => ({
  createConnection: () => ({
    connect: jest.fn().mockImplementation(callback => callback()),
    query: jest.fn().mockImplementation((query, params, callback) => {
      if (query.includes('SELECT')) {
        // Simulate checking for existing email in DB
        if (params[0] === 'user@example.com' || params[0] === 'professional@example.com') {
          return callback(null, [{ email: params[0], password: 'hashedpassword' }]); // Mock email already exists
        }
      }
      return callback(null, []); // Default case for no matching records
    }),
  }),
}));

// Middlewares and Routes setup
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(bodyParser.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

// Validation middlewares
const validateRegistration = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
  body('name').trim().notEmpty()
];

const validateProfessionalRegistration = [
  body('serviceType').trim().notEmpty(),
  body('name').trim().notEmpty(),
  body('address').trim().notEmpty(),
  body('email').isEmail().normalizeEmail(),
  body('phoneNumber').trim().notEmpty(),
  body('licenseId').trim().notEmpty(),
  body('password').isLength({ min: 8 })
];

// Mock database for testing purposes
const mockDatabase = [];

// User Registration Endpoint
app.post('/api/register', validateRegistration, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Simulate checking if email already exists
  const existingUser = mockDatabase.find(user => user.email === req.body.email);
  if (existingUser) {
    return res.status(400).json({ message: 'Email is already taken' });
  }

  // Simulate saving user to DB
  mockDatabase.push(req.body);
  res.status(201).json({ message: 'User registered successfully' });
});

// Professional Registration Endpoint
app.post('/api/professional_register', validateProfessionalRegistration, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Simulate checking if email already exists
  const existingProfessional = mockDatabase.find(professional => professional.email === req.body.email);
  if (existingProfessional) {
    return res.status(400).json({ message: 'Email is already taken' });
  }

  // Simulate saving professional to DB
  mockDatabase.push(req.body);
  res.status(201).json({ message: 'Professional registered successfully' });
});

// User Login Endpoint
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const user = mockDatabase.find(user => user.email === email);

  if (!user || user.password !== password) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  res.status(200).json({ message: 'Login successful' });
});

// Tests
describe('User and Professional Registration and Login', () => {
  let userCredentials = {
    email: 'user@example.com',
    password: 'password123',
    name: 'Test User'
  };

  let professionalCredentials = {
    email: 'professional@example.com',
    password: 'password123',
    serviceType: 'Plumber',
    name: 'Test Professional',
    address: '123 Main St',
    phoneNumber: '1234567890',
    licenseId: 'ABC123'
  };

  it('should register a user successfully', async () => {
    const response = await request(app)
      .post('/api/register')
      .send(userCredentials);
    
    expect(response.status).toBe(201);
    expect(response.body.message).toBe('User registered successfully');
  });

  it('should not allow duplicate email for user registration', async () => {
    const response = await request(app)
      .post('/api/register')
      .send(userCredentials);
    
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Email is already taken');
  });

  it('should register a professional successfully', async () => {
    const response = await request(app)
      .post('/api/professional_register')
      .send(professionalCredentials);
    
    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Professional registered successfully');
  });

  it('should not allow duplicate email for professional registration', async () => {
    const response = await request(app)
      .post('/api/professional_register')
      .send(professionalCredentials);
    
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Email is already taken');
  });

  it('should login a user successfully with correct credentials', async () => {
    const response = await request(app)
      .post('/api/login')
      .send({ email: 'user@example.com', password: 'password123' });
    
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Login successful');
  });

  it('should fail login with incorrect password', async () => {
    const response = await request(app)
      .post('/api/login')
      .send({ email: 'user@example.com', password: 'wrongpassword' });
    
    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Invalid email or password');
  });

  it('should fail login with incorrect email', async () => {
    const response = await request(app)
      .post('/api/login')
      .send({ email: 'nonexistent@example.com', password: 'password123' });
    
    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Invalid email or password');
  });

  it('should reject invalid email format during user registration', async () => {
    const response = await request(app)
      .post('/api/register')
      .send({ ...userCredentials, email: 'invalidemail' });
    
    expect(response.status).toBe(400);
    expect(response.body.errors).toHaveLength(1);
    expect(response.body.errors[0].msg).toBe('Invalid value');
  });

  it('should reject password shorter than 8 characters', async () => {
    const response = await request(app)
      .post('/api/register')
      .send({ ...userCredentials, password: 'short' });
    
    expect(response.status).toBe(400);
    expect(response.body.errors).toHaveLength(1);
    expect(response.body.errors[0].msg).toBe('Invalid value');
  });
});
