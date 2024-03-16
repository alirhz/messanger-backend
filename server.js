const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
const port = 3001;
const server = require('http').createServer(app); // Add this line
const io = require('socket.io')(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
}); // Add this line

app.use(cors());
app.use(bodyParser.json());

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

  // Socket.IO connection handler
  io.on('connection', (socket) => {
    console.log('A user connected to WebSocket');

    // Example: Broadcast received message to all clients
    socket.on('message', (data) => {
      console.log('Received message:', data);
      io.emit('message', data);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
  });

  // Start your Express server
  server.listen(port, () => {
    console.log(`Server started on port ${port}`);
  });
});
