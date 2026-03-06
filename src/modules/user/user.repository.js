const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../../db/db.json');

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

function create(data) {
  const id = crypto.randomUUID();
  const user = {
    id,
    email: data.email.trim().toLowerCase(),
    name: data.name.trim(),
    type: data.type,
    password: data.password,
  };
  const db = readDb();
  if (!db.users) db.users = [];
  db.users.push(user);
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

module.exports = {
  findAll,
  findById,
  findByEmail,
  create,
  update,
  updatePassword,
  remove,
};
