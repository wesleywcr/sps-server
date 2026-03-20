const { Router } = require('express');
const { authenticate } = require('../../common/middleware/authenticate');
const { requireAdmin, requireOwnerOrAdmin } = require('../../common/middleware/authorize');
const { wrapHandler } = require('../../common/utils/wrap-handler');
const userController = require('./user.controller');
const uploadAvatarUser = require('../../common/upload/storage-avatar');

const router = Router();

router.use(authenticate);

router.get('/', wrapHandler(userController.listUsers));
router.get('/:id', wrapHandler(userController.getUserById));
router.post('/', requireAdmin,  uploadAvatarUser.single('avatar'),wrapHandler(userController.registerUser));
router.patch('/:id',  uploadAvatarUser.single('avatar'),requireOwnerOrAdmin, wrapHandler(userController.editUser));
router.patch('/:id/password', requireOwnerOrAdmin, wrapHandler(userController.changePassword));
router.delete('/:id', requireOwnerOrAdmin, wrapHandler(userController.deleteUser));
router.patch("/:id/avatar", requireOwnerOrAdmin, uploadAvatarUser.single('avatar'), wrapHandler(userController.uploadAvatar));
module.exports = router;
