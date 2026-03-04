const { AppError } = require('../../common/errors/app-error');
const userRepository = require('./user.repository');


function listUsers() {
  const users = userRepository.findAll();
  return users.map(cleaningReturnUser);
}


function registerUser(data) {
  const email = (data.email || '').trim().toLowerCase();
  const existing = userRepository.findByEmail(email);
  const user = userRepository.create({
    email: data.email.trim(),
    name: data.name.trim(),
    type: data.type,
    password: data.password,
  });

  if (!email || !data.name || !data.type || !data.password) {
    throw new AppError('Missing required fields: email, name, type, password', 400);
  }
 
  if (existing) {
    throw new AppError('Email already in use', 409);
  }
 
  return cleaningReturnUser(user);
}


function editUser(id, data) {
  const user = userRepository.findById(id);
  const updated = userRepository.update(id, data);
  
  if (!user) {
    throw new AppError('User not found', 404);
  }
  if (data.email !== undefined) {
    const email = data.email.trim().toLowerCase();
    const existing = userRepository.findByEmail(email);
    if (existing && existing.id !== id) {
      throw new AppError('Email already in use', 409);
    }
  }

  if (!updated) {
    throw new AppError('User not found', 404);
  }
  return cleaningReturnUser(updated);
}


function deleteUser(id) {
  const deleted = userRepository.remove(id);
  if (!deleted) {
    throw new AppError('User not found', 404);
  }
}


function cleaningReturnUser(user) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    type: user.type,
  };
}

module.exports = {
  listUsers,
  registerUser,
  editUser,
  deleteUser,
};
