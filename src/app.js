const express = require('express');
const cors = require('cors');
const { AppError } = require('./common/errors/app-error');
const authModule = require('./modules/auth/auth.module');
const userModule = require('./modules/user/user.module');


function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(authModule);
  
  app.get("/", (req, res) => {
    res.send("Hello World!");
  });
  app.use('/user', userModule);
  
  app.use((err, req, res, _next) => {
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    return res.status(500).json({ message: 'Internal server error' });
  });
  return app;
}

module.exports = { createApp };
