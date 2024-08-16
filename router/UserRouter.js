const express = require('express');
const router = express.Router();

const userRepository = require('../repository/UserRepository')();
const passwordEncryptService = require('../service/Md5PasswordEncryptService');
const userService = require('../service/UserService')({userRepository, passwordEncryptService});
const userController = require('../controller/UserController')({userService});

router.get(
    '/',
    userController.getAll
)
router.get(
    '/:id',
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
    '/:id',
    userController.update
);

router.delete(
    '/:id',
    userController.delete
);

module.exports = router;