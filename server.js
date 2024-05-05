const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const socketIO = require('socket.io');
const dbModule = require('./modules/dbModule');
const websocketModule = require('./modules/websocketModule');
const app = express();
const port = 3001;
const server = http.createServer(app);
app.use(bodyParser.urlencoded({ extended: false }));
let messagesRoute = require('./routes/messages');
let membersRoute = require('./routes/members');
let authRoute = require('./routes/auth');
let usersRoute = require('./routes/users');
const io = socketIO(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(bodyParser.json());

const db = dbModule.initializeDatabase();
// Initialize WebSocket module passing the 'io' instance

// Route Files
app.use('/', messagesRoute);
app.use('/api', membersRoute);
app.use('/api', authRoute);
app.use('/api', usersRoute);


websocketModule.initializeWebSocket(io, db);

server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
