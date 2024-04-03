const express = require('express');
const router = express.Router();
const dbModule = require('../modules/dbModule');

const db = dbModule.initializeDatabase();

// Load Edit Form
router.get('/api/messages', (req, res) => {

    const getQuery = `SELECT messages.id_message, messages.message_text, messages.username, messages.time, messages.user_id, users.profile_pic 
    FROM messages
    LEFT JOIN users ON messages.user_id = users.user_id
    `;

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