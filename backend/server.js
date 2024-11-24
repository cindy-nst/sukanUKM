const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const multer = require('multer');  // Import multer for file handling
const path = require('path');

const app = express();
const port = 5000;
const fs = require('fs');

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
// Modify the existing login endpoint to include role checking
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // First, check the user credentials and get basic user info
  const userQuery = 'SELECT * FROM user WHERE UserID = ?';
  db.execute(userQuery, [username], (err, userResults) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }

    if (userResults.length > 0) {
      const user = userResults[0];

      // Check password
      const checkPassword = () => {
        // Check for plain text password first
        if (password === user.Password) {
          determineUserRole(user);
          return;
        }

        // Then try bcrypt comparison
        bcrypt.compare(password, user.Password, (err, isMatch) => {
          if (err) {
            return res.status(500).json({ message: 'Error comparing passwords', error: err });
          }

          if (isMatch) {
            determineUserRole(user);
          } else {
            return res.status(401).json({ message: 'Invalid username or password' });
          }
        });
      };

      // Helper function to determine user role
      const determineUserRole = (user) => {
        // Check if user exists in student table
        const studentQuery = 'SELECT * FROM student WHERE StudentID = ?';
        db.execute(studentQuery, [user.UserID], (err, studentResults) => {
          if (err) {
            return res.status(500).json({ message: 'Database error', error: err });
          }

          if (studentResults.length > 0) {
            // User is a student
            return res.status(200).json({
              user: user,
              role: 'Student',
              details: studentResults[0]
            });
          } else {
            // Check if user exists in staff table
            const staffQuery = 'SELECT * FROM ukmsportdepartment WHERE StaffID = ?';
            db.execute(staffQuery, [user.UserID], (err, staffResults) => {
              if (err) {
                return res.status(500).json({ message: 'Database error', error: err });
              }

              if (staffResults.length > 0) {
                // User is a staff member
                return res.status(200).json({
                  user: user,
                  role: 'Staff',
                  details: staffResults[0]
                });
              } else {
                // User exists in user table but not in student or staff tables
                return res.status(401).json({ message: 'User role not found' });
              }
            });
          }
        });
      };

      // Start the password check process
      checkPassword();

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


// API endpoint to fetch court details by ID
app.get('/api/sportequipment/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM sportequipment WHERE ItemID = ?';

  db.execute(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }

    if (results.length > 0) {
      res.status(200).json(results[0]);  // Return the court details
    } else {
      res.status(404).json({ message: 'Equipment not found' });
    }
  });
});

// Add this endpoint to your server file

// In your server.js file, update the PUT endpoint:
app.put('/api/sportequipment/:ItemID', upload.single('sportImage'), async (req, res) => {
  const { ItemID } = req.params;
  const { ItemName, ItemQuantity } = req.body;

  try {
    // Input validation
    if (!ItemName || ItemQuantity === undefined) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        required: ['ItemName', 'ItemQuantity'],
        received: req.body 
      });
    }

    // Start building the update query and values
    let query = 'UPDATE sportequipment SET ItemName = ?, ItemQuantity = ?';
    let values = [ItemName, ItemQuantity];

    // If there's a new image uploaded, handle it
    if (req.file) {
      // First, get the old image filename
      const [oldImage] = await db.promise().execute(
        'SELECT SportPic FROM sportequipment WHERE ItemID = ?',
        [ItemID]
      );

      // Add SportPic to the update query
      query += ', SportPic = ?';
      values.push(req.file.filename);

      // Delete old image if it exists
      if (oldImage[0]?.SportPic) {
        const oldPath = path.join(__dirname, 'uploads', oldImage[0].SportPic);
        if (fs.existsSync(oldPath)) {
          try {
            fs.unlinkSync(oldPath);
          } catch (err) {
            console.error('Error deleting old image:', err);
            // Continue with the update even if image deletion fails
          }
        }
      }
    }

    // Complete the query
    query += ' WHERE ItemID = ?';
    values.push(ItemID);

    // Execute the update
    const [result] = await db.promise().execute(query, values);

    if (result.affectedRows === 0) {
      // If a new image was uploaded but update failed, delete it
      if (req.file) {
        const filePath = path.join(__dirname, 'uploads', req.file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      return res.status(404).json({ 
        message: 'Equipment not found',
        itemId: ItemID 
      });
    }

    // Fetch the updated record to return
    const [updated] = await db.promise().execute(
      'SELECT * FROM sportequipment WHERE ItemID = ?',
      [ItemID]
    );

    res.status(200).json({ 
      message: 'Equipment updated successfully',
      equipment: updated[0]
    });

  } catch (error) {
    console.error('Database error:', error);
    
    // If there was an error and we uploaded a new file, clean it up
    if (req.file) {
      const filePath = path.join(__dirname, 'uploads', req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    return res.status(500).json({ 
      message: 'Error updating equipment',
      error: error.message 
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
