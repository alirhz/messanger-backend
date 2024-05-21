// websocketModule.js
const messageController = require('../controllers/messageController');

function handleConnection(socket, io , db) {
  console.log('A user connected to WebSocket');

  socket.on('connected', handleConnectedUser);
  socket.on('message', (data) => {
    handleMessage(data, io , db)
  });
  socket.on('disconnect', handleDisconnect);
}

function handleConnectedUser(data) {
  console.log('Connected User:', data);
}

function handleMessage(data, io, db) {
  // Insert the message into the database
  messageController.insertMessageIntoDatabase(db, data)
    .then(() => {
      io.emit('message', data);
    }).catch((error) => {
      console.error('Error inserting message into database:', error);
    });
}

function handleDisconnect() {
  console.log('A user disconnected');
}

function initializeWebSocket(io, db) {
  io.on('connection', (socket) => {
    handleConnection(socket, io, db);
  });
}

module.exports = { initializeWebSocket };