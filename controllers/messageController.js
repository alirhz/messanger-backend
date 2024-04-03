// controllers/messageController.js

function insertMessageIntoDatabase(db, message) {
    return new Promise((resolve, reject) => {
      const { message_text, username, time, user_id } = message;
      const sql = 'INSERT INTO messages (message_text, username, time, user_id) VALUES (?, ?, ?, ?)';
      db.query(sql, [message_text, username, time, user_id], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  }
  
  module.exports = {
    insertMessageIntoDatabase
  };
  