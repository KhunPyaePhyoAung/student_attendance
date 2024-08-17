const express = require('express');
const router = express.Router();

const instructorRepository = require('../repository/InstructorRepository')();
const userRepository = require('../repository/UserRepository')();
const passwordEncryptService = require('../service/Md5PasswordEncryptService');
const userService = require('../service/UserService')({userRepository, passwordEncryptService});
const instructorService = require('../service/InstructorService')({instructorRepository, userService});
const instructorController = require('../controller/InstructorController')({instructorService});

router.get(
    '/',
    instructorController.getAll
);

router.get(
    '/search',
    instructorController.searchByKeyword
);

router.get(
    '/:id',
    instructorController.findOneById
);

router.post(
    '/',
    instructorController.create
);

router.put(
    '/:id',
    instructorController.update
);

router.delete(
    '/:id',
    instructorController.delete
);

module.exports = router;
