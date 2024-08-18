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
    [authMiddleware.verifyUserToken],
    viewController.student_registration
);

router.get(
    ['/student_edit'],
    [authMiddleware.verifyUserToken],
    viewController.student_edit
);

router.get(
    ['/students'],
    [authMiddleware.verifyUserToken],
    viewController.students
);

router.get(
    ['/instructors'],
    [authMiddleware.verifyUserToken],
    viewController.instructors
);

router.get(
    ['/instructor_registration'],
    [authMiddleware.verifyUserToken],
    viewController.instructor_registration
);

router.get(
    ['/instructor_edit'],
    [authMiddleware.verifyUserToken],
    viewController.instructor_edit
);

router.get(
    ['/subjects'],
    [authMiddleware.verifyUserToken],
    viewController.subjects
);

router.get(
    ['/subject_registration'],
    [authMiddleware.verifyUserToken],
    viewController.subject_registration
);

router.get(
    ['/subject_edit'],
    [authMiddleware.verifyUserToken],
    viewController.subject_edit
);

router.get(
    ['/terms'],
    [authMiddleware.verifyUserToken],
    viewController.terms
);

router.get(
    ['/term_registration'],
    [authMiddleware.verifyUserToken],
    viewController.term_registration
);

router.get(
    ['/term_edit'],
    [authMiddleware.verifyUserToken],
    viewController.term_edit
);

module.exports = router;