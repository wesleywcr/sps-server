const userService = require('./user.service');


function registerUser(req, res) {
  const user = userService.registerUser(req.body);
  res.status(201).json(user);
}


function listUsers(req, res) {
  const users = userService.listUsers();
  res.json(users);
}

function getUserById(req, res) {
  const user = userService.getUserById(req.params.id);
  res.json(user);
}

function editUser(req, res) {
  const user = userService.editUser(req.params.id, req.body);
  res.json(user);
}


function deleteUser(req, res) {
  userService.deleteUser(req.params.id);
  res.status(204).send();
}

function changePassword(req, res) {
  userService.changePassword(req.params.id, req.body.password);
  res.status(200).json({ message: 'Password updated successfully' });
}

module.exports = {
  listUsers,
  getUserById,
  registerUser,
  editUser,
  deleteUser,
  changePassword,
};
