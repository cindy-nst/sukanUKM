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

// API endpoint to delete a court by ID
app.delete('/api/courts/:id', (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM court WHERE CourtID = ?';
  db.execute(query, [id], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Error deleting court', error: err });
    }

    if (results.affectedRows > 0) {
      res.status(200).json({ message: 'Court deleted successfully.' });
    } else {
      res.status(404).json({ message: 'Court not found.' });
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


//for Add Court
app.post('/api/add-court', upload.single('courtImage'), (req, res) => {
  const { CourtID, CourtName, CourtDescription, CourtLocation } = req.body;

  if (!CourtID || !CourtName || !CourtDescription || !CourtLocation) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
  
   // Validate and format CourtLocation
   const locationRegex = /^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/;
   if (!locationRegex.test(CourtLocation)) {
     return res.status(400).json({ message: 'CourtLocation must be in the format "lat,lng".' });
   }

  let courtPic = null;
  if (req.file) {
    courtPic = req.file.filename; // Save only the filename in the database
  }

  const query = `
    INSERT INTO court (CourtID, CourtName, CourtDescription, CourtLocation, CourtPic) 
    VALUES (?, ?, ?, ?, ?)
  `;
  db.execute(
    query,
    [CourtID, CourtName, CourtDescription, CourtLocation, courtPic],
    (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Error adding court', error: err });
      }
      res.status(200).json({ message: 'Court added successfully!', courtID: CourtID });
    }
  );
});

// API endpoint to update court details
app.put('/api/courts/:CourtID', upload.single('courtImage'), async (req, res) => {
  const { CourtID } = req.params; // Extract CourtID from URL
  const { CourtName, CourtDescription, CourtLocation } = req.body;

  try {
    // Validate the required fields
    if (!CourtName || !CourtDescription || !CourtLocation) {
      return res.status(400).json({
        message: 'All fields (CourtName, CourtDescription, CourtLocation) are required.',
      });
    }

    // Validate and format CourtLocation
    const locationRegex = /^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/;
    if (!locationRegex.test(CourtLocation)) {
      return res.status(400).json({
        message: 'CourtLocation must be in the format "lat,lng".',
      });
    }

    // Start building the update query
    let query = 'UPDATE court SET CourtName = ?, CourtDescription = ?, CourtLocation = ?';
    let values = [CourtName, CourtDescription, CourtLocation];

    // If a new court image is uploaded, handle it
    if (req.file) {
      // Fetch the old image filename to delete it
      const [oldImage] = await db.promise().execute(
        'SELECT CourtPic FROM court WHERE CourtID = ?',
        [CourtID]
      );

      // Add CourtPic to the update query
      query += ', CourtPic = ?';
      values.push(req.file.filename);

      // Delete the old image file if it exists
      if (oldImage[0]?.CourtPic) {
        const oldPath = path.join(__dirname, 'uploads', oldImage[0].CourtPic);
        if (fs.existsSync(oldPath)) {
          try {
            fs.unlinkSync(oldPath); // Delete old image
          } catch (err) {
            console.error('Error deleting old image:', err);
          }
        }
      }
    }

    // Complete the query
    query += ' WHERE CourtID = ?';
    values.push(CourtID);

    // Execute the update query
    const [result] = await db.promise().execute(query, values);

    if (result.affectedRows === 0) {
      // If the update failed (for example, the court doesn't exist), clean up the uploaded file
      if (req.file) {
        const filePath = path.join(__dirname, 'uploads', req.file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      return res.status(404).json({
        message: 'Court not found',
        courtId: CourtID,
      });
    }

    // Fetch the updated record to return
    const [updatedCourt] = await db.promise().execute(
      'SELECT * FROM court WHERE CourtID = ?',
      [CourtID]
    );

    res.status(200).json({
      message: 'Court updated successfully',
      court: updatedCourt[0],
    });
  } catch (error) {
    console.error('Database error:', error);

    // Clean up the uploaded file if there was an error
    if (req.file) {
      const filePath = path.join(__dirname, 'uploads', req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    return res.status(500).json({
      message: 'Error updating court',
      error: error.message,
    });
  }
});


// API Endpoint to Add Equipment
app.post("/api/add-equipment", upload.single("SportPic"), (req, res) => {
  const { ItemID, ItemName, ItemQuantity } = req.body;

  // Validate the required fields
  if (!ItemID || !ItemName || !ItemQuantity) {
    return res.status(400).json({ message: "ItemID, ItemName, and ItemQuantity are required" });
  }

  // Ensure that a file is uploaded
  if (!req.file) {
    return res.status(400).json({ message: "Sport image (SportPic) is required" });
  }

  // Store the file path or filename (depending on how you plan to use the file)
  const SportPic = req.file.filename; // Save only the filename in the database

  // Prepare the SQL query to insert equipment into the database
  const query = `
    INSERT INTO sportequipment (ItemID, ItemName, ItemQuantity, SportPic)
    VALUES (?, ?, ?, ?)
  `;

  // Execute the query to insert the equipment
  db.query(query, [ItemID, ItemName, ItemQuantity, SportPic], (err, result) => {
    if (err) {
      console.error("Error inserting data: ", err);
      return res.status(500).json({ message: "Failed to add equipment", error: err });
    }

    // Return a success response with the newly inserted equipment ID
    res.status(200).json({
      message: "Equipment added successfully",
      equipmentId: result.insertId,
      equipment: { ItemID, ItemName, ItemQuantity, SportPic },
    });
  });
});


// API Endpoint to Retrieve User Profile
app.get("/api/profile", (req, res) => {
  const { userId, role } = req.query;

  if (!userId || !role) {
    return res.status(400).json({ message: "Missing userId or role" });
  }

  let tableName;
  let idColumn;

  if (role.toLowerCase() === "student") { // Normalize casing
    tableName = "student";
    idColumn = "StudentID";
  } else if (role.toLowerCase() === "staff") {
    tableName = "ukmsportdepartment";
    idColumn = "StaffID";
  } else {
    return res.status(400).json({ message: "Invalid role" });
  }

  const query = `SELECT * FROM ${tableName} WHERE ${idColumn} = ?`;

  db.query(query, [userId], (err, result) => {
    if (err) {
      console.error("Error retrieving user profile:", err);
      return res.status(500).json({ message: "Failed to retrieve user profile" });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ profile: result[0] });
  });
});

//DELETE SPORT EQUIPMENT

app.delete('/api/sportequipment/:id', (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM sportequipment WHERE ItemID = ?';
  db.execute(query, [id], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Error deleting Sport Equipment', error: err });
    }

    if (results.affectedRows > 0) {
      res.status(200).json({ message: 'Sport Equipment deleted successfully.' });
    } else {
      res.status(404).json({ message: 'Sport Equipment not found.' });
    }
  });
});


// For Add Booking Court
const { v4: uuidv4 } = require('uuid'); // Install UUID with `npm install uuid`

app.post('/api/addBookingCourt', async (req, res) => {
  const { CourtID, StudentID, BookingCourtTime, BookingCourtDate } = req.body;

  if (!CourtID || !StudentID || !BookingCourtTime || !BookingCourtDate) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  // Generate a unique BookingCourtID
  let BookingCourtID = uuidv4(); // Generate UUID

  try {
    // Check if the BookingCourtID already exists
    const checkQuery = `SELECT BookingCourtID FROM bookingcourt WHERE BookingCourtID = ?`;
    const [rows] = await db.promise().execute(checkQuery, [BookingCourtID]);

    // Regenerate if ID exists
    while (rows.length > 0) {
      BookingCourtID = uuidv4();
    }

    // Insert booking into the database
    const insertQuery = `
      INSERT INTO bookingcourt (BookingCourtID, CourtID, StudentID, BookingCourtTime, BookingCourtDate) 
      VALUES (?, ?, ?, ?, ?)
    `;
    await db.promise().execute(insertQuery, [
      BookingCourtID,
      CourtID,
      StudentID,
      BookingCourtTime,
      BookingCourtDate,
    ]);

    res.status(200).json({
      message: 'Booking court added successfully!',
      bookingCourtID: BookingCourtID,
    });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ message: 'Error adding booking court', error: err });
  }
});

// API to fetch the booked times for the selected date
app.get('/api/getBookedTimes', async (req, res) => {
  const { courtID, date } = req.query;

  if (!courtID || !date) {
    return res.status(400).json({ message: 'CourtID and date are required.' });
  }

  try {
    // Log the formatted date received from the client
    console.log("Received Date:", date);

    // Query to fetch all booked times for the selected court and date
    const query = `
      SELECT BookingCourtTime
      FROM bookingcourt
      WHERE CourtID = ? AND BookingCourtDate = ?
    `;

    const [rows] = await db.promise().execute(query, [courtID, date]);

    // Check if there are booked times
    if (rows.length === 0) {
      return res.status(200).json({ bookedTimes: [] }); // Return an empty array if no bookings exist
    }

    // Split comma-separated times and flatten them into a single array
    const bookedTimes = rows
      .map(row => row.BookingCourtTime.split(',').map(time => time.trim())) // Split by commas and remove extra spaces
      .flat(); // Flatten into a single array

    // Return the booked times as a JSON response
    res.status(200).json({ bookedTimes });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ message: 'Error fetching booked times', error: err });
  }
  app.get('/api/bookingcourthistories', async (req, res) => {
    const query =` 
      SELECT 
        bc.BookingCourtID,
        bc.CourtID,
        c.CourtName, 
        bc.StudentID,
        s.StudentName,  -- Fetching StudentName from student table
        bc.BookingCourtDate,
        bc.BookingCourtTime
      FROM 
        bookingcourt AS bc
      JOIN 
        court AS c ON bc.CourtID = c.CourtID
      JOIN 
        student AS s ON bc.StudentID = s.StudentID  -- Joining student table to fetch StudentName
      ORDER BY 
        bc.BookingCourtDate DESC, bc.BookingCourtTime ASC`
    ;
  
    try {
      const [results] = await db.execute(query);
      if (results.length > 0) {
        res.status(200).json(results);
      } else {
        res.status(404).json({ message: 'No booking court histories found.' });
      }
    } catch (err) {
      console.error('Database error:', err);
      res.status(500).json({ message: 'Database error', error: err });
    }
  });
});