// websocketModule.js
const messageController = require('../controllers/messageController');

function initializeWebSocket(io, db) {
  // Socket.IO connection handler
  io.on('connection', (socket) => {
    console.log('A user connected to WebSocket');

    // Handle incoming user from clients
    socket.on('connected', (data) => {
      console.log('connected User:', data);
    });

    // Handle incoming messages from clients
    socket.on('message', (data) => {
      console.log('Received message:', data);
      // Insert the message into the database
      messageController.insertMessageIntoDatabase(db, data)
        .then(() => {
          // Broadcast the message to all clients
          io.emit('message', data);
        })
        .catch((error) => {
          console.error('Error inserting message into database:', error);
        });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
  });
}

module.exports = {
  initializeWebSocket
};
