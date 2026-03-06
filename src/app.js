const express = require('express');
const cors = require('cors');
const { AppError } = require('./common/errors/app-error');
const authModule = require('./modules/auth/auth.module');
const userModule = require('./modules/user/user.module');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');


function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(authModule);
  
  app.get("/", (req, res) => {
    res.send("Hello World!");
  });
  app.use('/user', userModule);
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  
  app.use((err, req, res, _next) => {
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    if (err instanceof SyntaxError) {
      return res.status(400).json({ message: err.message || 'Invalid JSON' });
    }
    const statusCode = typeof err.status === 'number' ? err.status : err.statusCode;
    if (typeof statusCode === 'number') {
      return res.status(statusCode).json({ message: err.message || 'Bad request' });
    }
    return res.status(500).json({ message: 'Internal server error' });
  });
  return app;
}

module.exports = { createApp };
