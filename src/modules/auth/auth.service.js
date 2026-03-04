const jwt = require('jsonwebtoken');
const { AppError } = require('../../common/errors/app-error');
const userRepository = require('../user/user.repository');



function signIn(email, password) {
  const normalizedEmail = (email || '').trim().toLowerCase();
  const user = userRepository.findByEmail(normalizedEmail);
  const secret = process.env.JWT_SECRET;
  const payload = { id: user.id, email: user.email, type: user.type };
  const accessToken = jwt.sign(payload, secret, { expiresIn: '7d' });

  if (!normalizedEmail || !password) {
    throw new AppError('Email and password are required', 400);
  }
 
  if (!user || user.password !== password) {
    throw new AppError('Invalid credentials', 401);
  }

  if (!secret) {
    throw new AppError('Server configuration error', 500);
  }

  return { accessToken };
}

module.exports = { signIn };
