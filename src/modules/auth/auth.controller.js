const authService = require('./auth.service');


function signIn(req, res) {
  const { accessToken } = authService.signIn(req.body.email, req.body.password);
  res.json({ accessToken });
}

module.exports = { signIn };
