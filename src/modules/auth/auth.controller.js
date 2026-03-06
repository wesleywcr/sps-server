const authService = require('./auth.service');


function signIn(req, res) {
  const { accessToken ,payload} = authService.signIn(req.body.email, req.body.password);

  res.json({ 
    id: payload.id,
    name: payload.name,
    email: payload.email,
    type: payload.type,
    accessToken,
  });
}

module.exports = { signIn };
