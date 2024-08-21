const express = require('express');
const router = express.Router();

const studentRepository = require('../repository/StudentRepository')();
const userRepository = require('../repository/UserRepository')();
const passwordEncryptService = require('../service/Md5PasswordEncryptService');
const userService = require('../service/UserService')({userRepository, passwordEncryptService});
const studentService = require('../service/StudentService')({studentRepository, userService});
const studentController = require('../controller/StudentController')({studentService});

router.get(
    '/',
    studentController.getAll
);

router.get(
    '/search',
    studentController.searchByKeyword
);

router.get(
    '/:id',
    studentController.findOneById
);

router.get(
    '/email/:email',
    studentController.findOneByEmail
);

router.get(
    '/term/:termId',
    studentController.findAllByTermId
);

router.get(
    '/of_attendance/:attendanceId',
    studentController.findAllForAttendance
);

router.post(
    '/',
    studentController.create
);

router.put(
    '/:id',
    studentController.update
);

router.delete(
    '/:id',
    studentController.delete
);



module.exports = router;