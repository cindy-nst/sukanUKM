const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

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
        // Password matches directly (plain-text comparison)
        return res.status(200).json({ user: user });
      }

      // Second condition: If the first comparison failed, attempt bcrypt comparison for hashed password
      bcrypt.compare(password, user.Password, (err, isMatch) => {
        if (err) {
          return res.status(500).json({ message: 'Error comparing passwords', error: err });
        }

        if (isMatch) {
          // Password matches after bcrypt comparison
          return res.status(200).json({ user: user });
        } else {
          // Invalid credentials
          return res.status(401).json({ message: 'Invalid username or password' });
        }
      });
    } else {
      // User not found
      return res.status(401).json({ message: 'Invalid username or password' });
    }
  });
});

// API endpoint to handle password reset
app.post('/forgot-password', (req, res) => {
  const { email, newPassword } = req.body;

  // Ensure the password meets security requirements (e.g., length, complexity)
  if (newPassword.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters long.' });
  }

  // Hash the new password before updating it in the database
  bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
    if (err) {
      return res.status(500).json({ message: 'Error hashing password', error: err });
    }

    // Query the database for the user with the provided email
    const query = 'SELECT * FROM user WHERE Email = ?';
    db.execute(query, [email], (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Database error', error: err });
      }

      if (results.length > 0) {
        // User found, update the password with the hashed password
        const updateQuery = 'UPDATE user SET Password = ? WHERE Email = ?';
        db.execute(updateQuery, [hashedPassword, email], (updateErr, updateResults) => {
          if (updateErr) {
            return res.status(500).json({ message: 'Error updating password', error: updateErr });
          }
          res.status(200).json({ message: 'Password reset successfully.' });
        });
      } else {
        // No user found with that email
        res.status(404).json({ message: 'No user found with that email.' });
      }
    });
  });
});

// API endpoint to fetch user name based on role
app.get('/getName/:role/:userID', (req, res) => {
    const { role, userID } = req.params;
  
    // Define queries for each role
    const queries = {
      Student: 'SELECT StudentName AS name FROM student WHERE StudentID = ?',
      Staff: 'SELECT StaffName AS name FROM ukmsportdepartment WHERE StaffID = ?',
    };
  
    // Check if the role is valid
    if (!queries[role]) {
      return res.status(400).json({ message: 'Invalid role' });
    }
  
    // Execute the appropriate query
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
  

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});


  
  