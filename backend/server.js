const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const multer = require('multer');  // Import multer for file handling
const path = require('path');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Set up multer storage for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Store files in the "uploads" folder
    cb(null, './uploads/');
  },
  filename: (req, file, cb) => {
    // Generate a unique filename for each file
    cb(null, Date.now() + path.extname(file.originalname));  // Using timestamp for uniqueness
  }
});

const upload = multer({ storage: storage });  // Create multer instance with the storage configuration

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'sukanukm',
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    process.exit(1); // Exit process if database connection fails
  }
  console.log('Database connected successfully!');
});

// Serve static files from "uploads" folder
app.use('/images', express.static(path.join(__dirname, 'uploads')));

// API endpoint to handle login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Query the database for the user
  const query = 'SELECT * FROM user WHERE UserID = ?';
  db.execute(query, [username], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }

    if (results.length > 0) {
      const user = results[0];  // Assuming 'user' object contains the password field

      // First condition: Direct comparison with plain-text password (assuming the stored password may be plain-text)
      if (password === user.Password) {
        return res.status(200).json({ user: user });
      }

      // Second condition: If the first comparison failed, attempt bcrypt comparison for hashed password
      bcrypt.compare(password, user.Password, (err, isMatch) => {
        if (err) {
          return res.status(500).json({ message: 'Error comparing passwords', error: err });
        }

        if (isMatch) {
          return res.status(200).json({ user: user });
        } else {
          return res.status(401).json({ message: 'Invalid username or password' });
        }
      });
    } else {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
  });
});

// API endpoint to handle password reset
app.post('/forgot-password', (req, res) => {
  const { email, newPassword } = req.body;

  if (newPassword.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters long.' });
  }

  bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
    if (err) {
      return res.status(500).json({ message: 'Error hashing password', error: err });
    }

    const query = 'SELECT * FROM user WHERE Email = ?';
    db.execute(query, [email], (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Database error', error: err });
      }

      if (results.length > 0) {
        const updateQuery = 'UPDATE user SET Password = ? WHERE Email = ?';
        db.execute(updateQuery, [hashedPassword, email], (updateErr, updateResults) => {
          if (updateErr) {
            return res.status(500).json({ message: 'Error updating password', error: updateErr });
          }
          res.status(200).json({ message: 'Password reset successfully.' });
        });
      } else {
        res.status(404).json({ message: 'No user found with that email.' });
      }
    });
  });
});

// API endpoint to fetch user name based on role
app.get('/getName/:role/:userID', (req, res) => {
  const { role, userID } = req.params;

  const queries = {
    Student: 'SELECT StudentName AS name FROM student WHERE StudentID = ?',
    Staff: 'SELECT StaffName AS name FROM ukmsportdepartment WHERE StaffID = ?',
  };

  if (!queries[role]) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  db.execute(queries[role], [userID], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }

    if (results.length > 0) {
      return res.status(200).json({ name: results[0].name });
    } else {
      return res.status(404).json({ message: `${role} not found` });
    }
  });
});

// API endpoint to fetch all courts
app.get('/api/courts', (req, res) => {
  const query = 'SELECT * FROM court';
  db.execute(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    res.status(200).json(results);
  });
});

// API endpoint to fetch court details by ID
app.get('/api/courts/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM court WHERE CourtID = ?';
  db.execute(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }

    if (results.length > 0) {
      res.status(200).json(results[0]);  // Return the court details
    } else {
      res.status(404).json({ message: 'Court not found' });
    }
  });
});

// API endpoint to handle file upload
app.post('/upload', upload.single('courtImage'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  const filePath = req.file.path.replace(/\\/g, '/'); // Adjust for cross-platform compatibility
  res.status(200).json({
    message: 'File uploaded successfully!',
    filePath: filePath
  });
});

// API endpoint to fetch all sports equipment
app.get('/api/sportequipment', (req, res) => {
  const query = 'SELECT * FROM sportequipment'; // Replace with your actual table name if different
  db.execute(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching equipment data', error: err });
    }
    res.status(200).json(results); // Send the data as a JSON response
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});