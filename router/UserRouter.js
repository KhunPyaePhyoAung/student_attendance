const express = require('express');
const router = express.Router();

const userRepository = require('../repository/UserRepository')();
const passwordEncryptService = require('../service/Md5PasswordEncryptService');
const userService = require('../service/UserService')({userRepository, passwordEncryptService});
const userController = require('../controller/UserController')({userService});
const authMiddleware = require('../middleware/AuthMiddleware');

router.get(
    '/',
    userController.getAll
)
router.get(
    '/:id(\\d+)',
    userController.findOneById
);

router.get(
    '/email/:email',
    userController.findOneByEmail
)

router.post(
    '/',
    userController.create
);

router.put(
    '/:id(\\d+)',
    userController.update
);

router.delete(
    '/:id(\\d+)',
    userController.delete
);

router.post(
    '/change_password',
    [authMiddleware.verifyUserToken],
    userController.changePassword
);

module.exports = router;