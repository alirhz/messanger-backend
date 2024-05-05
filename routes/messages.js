const express = require('express');
const router = express.Router();
const dbModule = require('../modules/dbModule');
const verify = require('../middleware/jwtMiddleware');
const db = dbModule.initializeDatabase();
const jwt = require('jsonwebtoken');

// Load Messages
router.get('/api/messages/:conversation_id', verify.verifyToken ,(req, res) => {
    const conversation_id = req.params.conversation_id;
    const getQuery = `SELECT DISTINCT messages.id_message, messages.message_text, messages.username, messages.time, messages.username_id, users.profile_pic 
    FROM messages
    JOIN users ON (messages.username_id = users.user_id)
    WHERE messages.conversation_id = ${conversation_id}`;




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