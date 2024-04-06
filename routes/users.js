const express = require('express');
const router = express.Router();
const dbModule = require('../modules/dbModule');
const db = dbModule.initializeDatabase();


router.get('/users', (req, res) => {

    // Check if the email exists in the database
    const sql = 'SELECT username ,user_id, profile_pic , email, email FROM users';
    db.execute(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }

        if (results.length === 0) {
            return res.status(401).json({ error: 'Authentication failed' });   
        }
        res.json(results);
    });
});

module.exports = router;