const { AppError } = require('../../common/errors/app-error');
const userRepository = require('./user.repository');

const VALID_USER_TYPES = ['admin', 'user'];
const DEFAULT_ADMIN_EMAIL = 'admin@spsgroup.com.br';
const DEFAULT_PER_PAGE = 10;
const MAX_PER_PAGE = 100;

function listUsers({ page = 1, perPage = DEFAULT_PER_PAGE } = {}) {
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const perPageNum = Math.min(MAX_PER_PAGE, Math.max(1, parseInt(perPage, 10) || DEFAULT_PER_PAGE));
  const users = userRepository.findAll();
  const cleaned = users.map(cleaningReturnUser);
  const total = cleaned.length;
  const start = (pageNum - 1) * perPageNum;
  const end = start + perPageNum;
  const data = cleaned.slice(start, end);
  return { total, page: pageNum, perPage: perPageNum,data  };
}

function getUserById(id) {
  const user = userRepository.findById(id);
  if (!user) {
    throw new AppError('User not found', 404);
  }
  return cleaningReturnUser(user);
}

function registerUser(data) {
  const email = (data.email || '').trim().toLowerCase();
  if (!email || !data.name || !data.type || !data.password) {
    throw new AppError('Missing required fields: email, name, type, password', 400);
  }
  if (!VALID_USER_TYPES.includes(data.type)) {
    throw new AppError('Invalid type. Allowed values: admin, user', 400);
  }
  const existing = userRepository.findByEmail(email);
  if (existing) {
    throw new AppError('Email already in use', 409);
  }
  const user = userRepository.create({
    email: data.email.trim(),
    name: data.name.trim(),
    type: data.type,
    password: data.password,
  });
  return cleaningReturnUser(user);
}


function editUser(id, data) {

  const user = userRepository.findById(id);
  if (!user) {
    throw new AppError('User not found', 404);
  }
  if (data.type !== undefined && !VALID_USER_TYPES.includes(data.type)) {
    throw new AppError('Invalid type. Allowed values: admin, user', 400);
  }
  if (data.email !== undefined) {
    const email = data.email.trim().toLowerCase();
    const existing = userRepository.findByEmail(email);
    if (existing && existing.id !== id) {
      throw new AppError('Email already in use', 409);
    }
  }
  const updated = userRepository.update(id, data);
  if (!updated) {
    throw new AppError('User not found', 404);
  }
  return cleaningReturnUser(updated);
}


function deleteUser(id) {
  const user = userRepository.findById(id);
  if (!user) {
    throw new AppError('User not found', 404);
  }
  const emailNormalized = (user.email || '').trim().toLowerCase();
  if (emailNormalized === DEFAULT_ADMIN_EMAIL) {
    throw new AppError('Cannot delete the default admin account', 403);
  }
  const deleted = userRepository.remove(id);
  if (!deleted) {
    throw new AppError('User not found', 404);
  }
}

function changePassword(id, newPassword) {
  const trimmed = typeof newPassword === 'string' ? newPassword.trim() : '';
  if (!trimmed) {
    throw new AppError('New password is required', 400);
  }
  const updated = userRepository.updatePassword(id, trimmed);
  if (!updated) {
    throw new AppError('User not found', 404);
  }
}
function uploadAvatar(id, avatar) {
  const user = userRepository.findById(id);

  if (!avatar) {
    return res.status(400).json({ error: 'No avatar' });
  }
  if (!user) {
    throw new AppError('User not found', 404);
  }
  const updated = userRepository.uploadAvatar(id, avatar);
  if (!updated) {
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
  getUserById,
  registerUser,
  editUser,
  deleteUser,
  changePassword,
  uploadAvatar
};
