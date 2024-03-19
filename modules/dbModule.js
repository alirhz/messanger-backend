// dbModule.js
const mysql = require('mysql2');

function initializeDatabase() {
  const db = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'ali123@',
    database: 'messanger_db'
  });

  db.connect((err) => {
    if (err) {
      console.error('Error connecting to the database:', err);
      return;
    }
    console.log('Connected to the database');
  });

  return db;
}

module.exports = {
  initializeDatabase
};
