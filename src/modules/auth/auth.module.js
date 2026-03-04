const { Router } = require('express');
const { wrapHandler } = require('../../common/utils/wrap-handler');
const authController = require('./auth.controller');

const router = Router();

router.post('/signin', wrapHandler(authController.signIn));

module.exports = router;
