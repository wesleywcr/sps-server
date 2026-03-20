const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../../db/db.json');
const uploadDir = path.resolve('uploads');


function readDb() {
  const raw = fs.readFileSync(DB_PATH, 'utf-8');
  return JSON.parse(raw);
}

function writeDb(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

function findAll() {
  const db = readDb();
  return db.users ?? [];
}

function findById(id) {
  return findAll().find((u) => u.id === id);
}

function findByEmail(email) {
  const normalized = email.trim().toLowerCase();
  return findAll().find((u) => u.email.toLowerCase() === normalized);
}

async function create(data, avatar) {
  const id = crypto.randomUUID();
  const user = {
    id,
    email: data.email.trim().toLowerCase(),
    name: data.name.trim(),
    type: data.type,
    password: data.password,
    avatar: "",
  };
  const db = readDb();
  if (!db.users) db.users = [];
  db.users.push(user);

  const pathAvatar = await uploadAvatar(user.id, avatar);
  db.users[db.users.length - 1].avatar = pathAvatar;
  writeDb(db);

  return user;
}

function update(id, data) {
  const db = readDb();
  const users = db.users ?? [];
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) return undefined;
  const user = users[index];
  if (data.email !== undefined) user.email = data.email.trim().toLowerCase();
  if (data.name !== undefined) user.name = data.name.trim();
  if (data.type !== undefined) user.type = data.type;
  users[index] = user;
  writeDb(db);
  return user;
}

function updatePassword(id, newPassword) {
  const db = readDb();
  const users = db.users ?? [];
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) return undefined;
  users[index].password = newPassword;
  writeDb(db);
  return users[index];
}

function remove(id) {
  const db = readDb();
  const users = db.users ?? [];
  const initialLength = users.length;
  db.users = users.filter((u) => u.id !== id);
  const removed = db.users.length < initialLength;
  if (removed) writeDb(db);
  return removed;
}
async function uploadAvatar(id, avatar) {
  const db = readDb();
  const users = db.users ?? [];
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) return undefined;

  const existingUser = users[index];
  const oldAvatar = existingUser?.avatar || null;
  const pathAvatar = `http://localhost:3333/${avatar.path}`

  existingUser.avatar = pathAvatar;
  writeDb(db);
  if (oldAvatar && oldAvatar.includes('/uploads/')) {
    const oldFileName = oldAvatar.split('/uploads/')[1];

    if (oldFileName && oldFileName.length > 0) {
      const oldFilePath = path.join(uploadDir, oldFileName);
      fs.unlink(oldFilePath, (err) => {
        if (err) throw err;
        console.warn('File deleted');
      });
    }
  }

  return pathAvatar;
}

module.exports = {
  findAll,
  findById,
  findByEmail,
  create,
  update,
  updatePassword,
  remove,
  uploadAvatar,
};
