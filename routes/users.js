const express = require('express');
const router = express.Router();
const dbModule = require('../modules/dbModule');
const db = dbModule.initializeDatabase();
const verify = require('../middleware/jwtMiddleware');

router.get('/users', verify.verifyToken , (req, res) => {

    // Check if the email exists in the database
    const decoded = req.decoded; // Accessing decoded property
    

    // This query retrieves all distinct member information associated with conversation IDs related to a
    // specified user ID from the members table.
    // It excludes the user's own ID and fetches the corresponding profile pictures from the users table.
    const getQuery = `SELECT DISTINCT members.conversation_id, users.username, users.user_id, users.profile_pic
    FROM members
    JOIN users ON members.username_id = users.user_id
    WHERE members.conversation_id IN (
        SELECT DISTINCT members.conversation_id
        FROM members
        WHERE members.username_id = '${decoded.user_id}'
    )
    AND members.username_id != '${decoded.user_id}'
    GROUP BY members.conversation_id, users.username, users.user_id, users.profile_pic`;

    db.execute(getQuery, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err });
        }

        if (results.length === 0) {
            return res.status(401).json({ error: 'Result is empty' });   
        }
        res.json(results);
    });
});

router.get('/explore-users', verify.verifyToken , (req, res) => {
    // Check if the email exists in the database
    const decoded = req.decoded; // Accessing decoded property
    

    // The objective of this SQL query is to retrieve conversation information for users who are not associated with a specific user ID in the members table.
    // The query aims to gather data such as conversation IDs, usernames, user IDs, and profile pictures.
    const getQuery = `SELECT DISTINCT members.conversation_id, users.username, users.user_id, users.profile_pic
    FROM members
    JOIN users ON members.username_id = users.user_id`;

    const getUsernames = `SELECT DISTINCT users.username, users.user_id, users.profile_pic
    FROM users
    LEFT JOIN members ON users.user_id = members.username_id
        WHERE members.username_id IS NULL`;

    db.query(getQuery, (err, members) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        
    db.query(getUsernames, (err, results) => {
        
        if (err) {
            return res.status(500).json({ error: err });
        }

        if (results.length === 0 && members.length === 0) {
            return res.status(401).json({ error: 'Result is empty' });   
        }
        let array = members;
        array = array.filter(item => item.user_id == decoded.user_id);
        let newMember = members.filter(item => {
                if(array.findIndex(index => index.conversation_id == item.conversation_id) > -1)
                    return item
            });
        members = members.filter(ar => !newMember.find(rm => (rm.user_id === ar.user_id) ));
        res.json(removeDuplicatesByUserId(results.concat(members)).filter(item => item.user_id != decoded.user_id));
    });
    });
});

// Route to handle the request
router.get('/retreive-user', verify.verifyToken , (req, res) => {
    try {
      // Verify and decode the token
      const decoded = req.decoded; // Accessing decoded property  
      // Send the extracted information back in the response
      res.json({ user_id: decoded.user_id, email: decoded.email, username: decoded.username , profile_pic: decoded.profile_pic });
    } catch (err) {
      res.status(500).json({ message: 'Error in server', error: err.message });
    }
  });

  const removeDuplicatesByUserId = (arr) => {
    const seen = new Map();
    return arr.filter(item => {
      const value = item.user_id;
      if (seen.has(value)) {
        return false;
      }
      seen.set(value, true);
      return true;
    });
  };

module.exports = router;