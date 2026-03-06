const { Router } = require('express');
const { authenticate } = require('../../common/middleware/authenticate');
const { wrapHandler } = require('../../common/utils/wrap-handler');
const userController = require('./user.controller');

const router = Router();

router.use(authenticate);

router.get('/', wrapHandler(userController.listUsers));
router.get('/:id', wrapHandler(userController.getUserById));
router.post('/', wrapHandler(userController.registerUser));
router.put('/:id', wrapHandler(userController.editUser));
router.patch('/:id/password', wrapHandler(userController.changePassword));
router.delete('/:id', wrapHandler(userController.deleteUser));

module.exports = router;
