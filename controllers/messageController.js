// controllers/messageController.js

function insertMessageIntoDatabase(db, message) {
    return new Promise((resolve, reject) => {
      const { message_text, username, time } = message;
      const sql = 'INSERT INTO messages (message_text, username, time) VALUES (?, ?, ?)';
      db.query(sql, [message_text, username, time], (error, results) => {
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
  