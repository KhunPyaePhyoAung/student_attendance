const express = require('express');
const router = express.Router();
const jwtTokenService = require('../service/JwtTokenService');
const viewController = require('../controller/ViewController')({jwtTokenService});
const authMiddleware = require('../middleware/AuthMiddleware');

router.get(
    ['/', '/home'],
    [authMiddleware.verifyUserToken],
    viewController.home
);

router.get(
    ['/login'],
    viewController.login
);

router.get(
    ['/student_registration'],
    viewController.student_registration
);

router.get(
    ['/students'],
    viewController.students
);

router.get(
    ['/instructor_registration'],
    viewController.instructor_registration
);

module.exports = router;