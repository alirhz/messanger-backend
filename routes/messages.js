const express = require('express');
const router = express.Router();
const dbModule = require('../modules/dbModule');

const db = dbModule.initializeDatabase();

// Load Edit Form
router.get('/api/messages', (req, res) => {

    const getQuery = 'SELECT * FROM messages';

    db.execute(getQuery, (err, result) => {
        if (err) {
            console.error('Error retrieving messages:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.json(result); // Respond with the retrieved projects
        }
    });
});

module.exports = router;