const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require("socket.io");

const {connectDB} = require('./database');
const newsRoutes = require('./routes/newsRoutes');
const {errorHandler, unknownEndpoint} = require('./utils/errorHandler'); 
const {requestLogger} = require('./utils/logsHandler'); 

dotenv.config();
const URL_BASE = `/api`;
const PORT = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = new Server(server,{ cors: { origin: '*' } });

connectDB();

app.set('io', io);
app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.use(`${URL_BASE}/news`, newsRoutes);

app.use(errorHandler);
app.use(unknownEndpoint);


io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = {app,server};