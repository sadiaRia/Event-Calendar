const express = require("express");
const path = require("path");
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dbConfig = require('../../db');
const fs = require('fs');
const socketIO = require('socket.io');
const async = require('async');
const router = express.Router();
const axios = require('axios');
const cors = require('cors');
require('./model');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(router);

fs.readdirSync(path.join(__dirname, '/config/routes')).map((file) => {
	require('./config/routes/' + file)(app);
});

mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.db, { useNewUrlParser: true });
mongoose.set('useFindAndModify', false);
const connection = mongoose.connection;
connection.once('open', function() {
	console.log('MongoDB database connection established successfully');
});

const publicPath = path.resolve(__dirname, '..', '..', 'public');
app.get('/', (req, res) => {
	res.sendFile(`${publicPath}/index.html`);
});

app.use(express.static(publicPath));

const server = app.listen(3000, () => {
  console.log("MERN Boilerplate listening on port 3000!");
});

//socket connection
const io = socketIO(server);
io.on("connection", socket => {
  console.log("New client connected");
  const sockets = require('./event/index');
  sockets.useSocket(socket);
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});
