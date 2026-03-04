const jwt = require('jsonwebtoken');


function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader.slice(7);
  const secret = process.env.JWT_SECRET;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (!secret) {
    return res.status(500).json({ message: 'Server configuration error' });
  }
  try {
    const payload = jwt.verify(token, secret);
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ message: 'Unauthorized' });
  }
}

module.exports = { authenticate };
