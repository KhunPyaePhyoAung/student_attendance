const express = require('express');
const router = express.Router();

const userRepository = require('../repository/UserRepository')();
const userService = require('../service/UserService')({userRepository});
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

module.exports = router;