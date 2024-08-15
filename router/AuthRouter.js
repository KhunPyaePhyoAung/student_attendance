const express = require('express');
const router = express.Router();

const userRepository = require('../repository/UserRepository')();
const passwordEncryptService = require('../service/Md5PasswordEncryptService');
const authService = require('../service/AuthService')({userRepository, passwordEncryptService});
const userService = require('../service/UserService')({userRepository});
const tokenService = require('../service/JwtTokenService');
const authController = require('../controller/AuthControlller')({authService, userService, tokenService});

router.post(
    ['/login'],
    authController.login
);

router.post(
    ['/logout'],
    authController.logout
);

module.exports = router;