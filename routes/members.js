const express = require('express');
const router = express.Router();
const dbModule = require('../modules/dbModule');
const verify = require('../middleware/jwtMiddleware');
const db = dbModule.initializeDatabase();
const jwt = require('jsonwebtoken');

// Create Members
router.post('/members', verify.verifyToken ,(req, res) => {
    const body = req.body;
    const getQuery = `SELECT MAX(conversation_id) FROM messanger_db.members`;
    let conversation_id;
    const decoded = req.decoded; // Accessing decoded property

    db.query(getQuery, (err, result) => {
        if (err) {
            console.error('Error in Database:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            conversation_id = result[0]['MAX(conversation_id)'] + 1;
            body.push({user_id: decoded.user_id, username: decoded.username});
            let users = body.map(member => [conversation_id, member.user_id, member.username]);
                const insertQuery = 'INSERT INTO members (conversation_id, username_id, username) VALUES ?';
                db.query(insertQuery, [users], (err, result) => {
                    if (err) {
                        console.error('Error in Database:', err);
                        res.status(200).json(result)
                    } else {
                        conversation_id = result.conversation_id;
                        res.json(result); // Respond with the retrieved projects
                    }
                });
        }
    });
});

module.exports = router;