const userService = require('./user.service');


function registerUser(req, res) {
  const user = userService.registerUser(req.body);
  res.status(201).json(user);
}


function listUsers(req, res) {
  const users = userService.listUsers();
  res.json(users);
}


function editUser(req, res) {
  const user = userService.editUser(req.params.id, req.body);
  res.json(user);
}


function deleteUser(req, res) {
  userService.deleteUser(req.params.id);
  res.status(204).send();
}

module.exports = {
  listUsers,
  registerUser,
  editUser,
  deleteUser,
};
