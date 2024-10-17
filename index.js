const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());

let users = []; // In-memory user storage

// Register endpoint
app.post('/register', (req, res) => {
    const { username, password, name, location, phoneNumber, email } = req.body;

    // Check if user already exists
    const existingUser = users.find(user => user.username === username);
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists!' });
    }

    // Register new user with additional details
    users.push({ username, password, name, location, phoneNumber, email });
    res.status(201).json({ message: 'User registered successfully!' });
});

// Login endpoint
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Check user credentials
    const user = users.find(user => user.username === username && user.password === password);
    if (user) {
        return res.status(200).json({ message: 'Login successful!' });
    } else {
        return res.status(401).json({ message: 'Invalid credentials!' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
