const express = require('express');
const router = express.Router();
const {authController} = require('../Dependencies');

router.post(
    ['/login'],
    authController.login
);

router.post(
    ['/logout'],
    authController.logout
);

module.exports = router;