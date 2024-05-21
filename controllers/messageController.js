// controllers/messageController.js

function insertMessageIntoDatabase(db, message) {
    return new Promise((resolve, reject) => {
      console.log(message)
      const { message_text, username, user_id, conversation_id } = message;
      let time = Date.now();
      const sql = 'INSERT INTO messages (message_text, username, time, username_id, conversation_id) VALUES (?, ?, ?, ?, ?)';
      db.query(sql, [message_text, username, time, user_id, conversation_id], (error, results) => {
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
  