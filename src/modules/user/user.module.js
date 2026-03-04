const { Router } = require('express');
const { authenticate } = require('../../common/middleware/authenticate');
const { wrapHandler } = require('../../common/utils/wrap-handler');
const userController = require('./user.controller');

const router = Router();

router.use(authenticate);

router.get('/', wrapHandler(userController.listUsers));
router.post('/', wrapHandler(userController.registerUser));
router.put('/:id', wrapHandler(userController.editUser));
router.delete('/:id', wrapHandler(userController.deleteUser));

module.exports = router;
