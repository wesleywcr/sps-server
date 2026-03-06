
function requireAdmin(req, res, next) {
  if (req.user?.type !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }
  next();
}


function requireOwnerOrAdmin(req, res, next) {
  const isAdmin = req.user?.type === 'admin';
  const isOwner = req.user?.id === req.params.id;
  if (!isAdmin && !isOwner) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  next();
}

module.exports = { requireAdmin, requireOwnerOrAdmin };
