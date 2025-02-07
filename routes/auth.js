const express = require('express');
const router = express.Router();
const dbModule = require('../modules/dbModule');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mysql = require('mysql2');
const cors = require('cors');
const db = dbModule.initializeDatabase();

// User login endpoint
const secretKey = 'yourSecretKey';

router.post('/login' ,(req, res) => {

    const { email, password } = req.body;

    // Check if the email exists in the database
    const sql = 'SELECT password, username ,user_id, profile_pic , email, email FROM users WHERE email = ?';
    db.query(sql, [email], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (results.length === 0) {
            return res.status(401).json({ error: "User not found" });
        }

        
        const user = results[0];
        // Compare the provided password with the hashed password in the database
        bcrypt.compare(password, user.password, (bcryptErr, bcryptResult) => {
            if (bcryptErr || !bcryptResult) {
                return res.status(401).json({ error: err.message });
            }

            // Generate a JWT token
            const token = jwt.sign({ user_id: user.user_id, email: user.email, username: user.username , profile_pic: user.profile_pic }, secretKey);

            res.json({ token, email, username: user.username, user_id: user.user_id, profile_pic: user.profile_pic });
        });
    });
});

// User registration endpoint

router.post('/register', (req, res) => {
  let { username, password, email, fullname } = req.body;

  const color = ['steelblue', 'indigo', 'seagreen', 'maroon']

  // Ensure all required fields are provided
  if (!username || !password || !email || !fullname) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Hash the user's password
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }
    // Insert user into the database
    const sql = 'INSERT INTO users (username, password, email, fullname, profile_pic) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [username, hashedPassword, email, fullname, color[Math.floor((Math.random() * color.length))]], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
      }
      res.json({ username, email, fullname });
    });
  });
});


module.exports = router;