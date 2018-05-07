'use strict';

// App Deps
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const errorHandler = require('./error-handler');

// App Setup
const app = express();
const router = express.Router();

// Middleware
app.use(cors());
app.use('/api/v1', router);
require('../route/user-route')(router);
require('../route/team-route')(router);
require('../route/tournament-route')(router);
require('../route/division-route')(router);
require('../route/game-route')(router);
require('../route/tournament-user-get')(router);
app.all('/{0,}', (req, res) => errorHandler(new Error('Path Error. Route not found.'), res));

// Server Controls
const server = module.exports = {};
server.start = () => {
  return new Promise((resolve, reject) => {
    if(server.isOn) return reject(new Error('Server Error. Cannot start server on the same port when already running.'));
    server.http = app.listen(process.env.PORT,  () => {
      console.log(`Listening on ${process.env.PORT}`);
      console.log(`Listening on ${process.env.MONGODB_URI}`);

      server.isOn = true;
      mongoose.connect(process.env.MONGODB_URI);
      return resolve(server);
    });
  });
};

server.stop = () => {
  return new Promise((resolve, reject) => {
    if(!server.isOn) return reject(new Error('Server Error. Cannot stop server that is not running.'));
    server.http.close(() => {
      server.isOn = false;
      mongoose.disconnect();
      return resolve();
    });
  });

};