const { Router } = require('express');
const { authenticate } = require('../../common/middleware/authenticate');
const { requireAdmin, requireOwnerOrAdmin } = require('../../common/middleware/authorize');
const { wrapHandler } = require('../../common/utils/wrap-handler');
const userController = require('./user.controller');

const router = Router();

router.use(authenticate);

router.get('/', wrapHandler(userController.listUsers));
router.get('/:id', wrapHandler(userController.getUserById));
router.post('/', requireAdmin, wrapHandler(userController.registerUser));
router.patch('/:id', requireOwnerOrAdmin, wrapHandler(userController.editUser));
router.patch('/:id/password', requireOwnerOrAdmin, wrapHandler(userController.changePassword));
router.delete('/:id', requireOwnerOrAdmin, wrapHandler(userController.deleteUser));

module.exports = router;
