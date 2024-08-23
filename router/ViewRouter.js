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
    [
        authMiddleware.verifyUserToken,
        authMiddleware.verifyUserRole('ADMIN')
    ],
    viewController.student_registration
);

router.get(
    ['/student_edit'],
    [
        authMiddleware.verifyUserToken,
        authMiddleware.verifyUserRole('ADMIN')
    ],
    viewController.student_edit
);

router.get(
    ['/students'],
    [
        authMiddleware.verifyUserToken,
        authMiddleware.verifyUserRole('ADMIN', 'INSTRUCTOR')
    ],
    viewController.students
);

router.get(
    ['/student_detail'],
    [
        authMiddleware.verifyUserToken,
        authMiddleware.verifyUserRole('ADMIN', 'INSTRUCTOR')
    ],
    viewController.student_detail
);

router.get(
    ['/instructors'],
    [
        authMiddleware.verifyUserToken,
        authMiddleware.verifyUserRole('ADMIN', 'INSTRUCTOR', 'STUDENT')
    ],
    viewController.instructors
);

router.get(
    ['/instructor_registration'],
    [
        authMiddleware.verifyUserToken,
        authMiddleware.verifyUserRole('ADMIN')
    ],
    viewController.instructor_registration
);

router.get(
    ['/instructor_edit'],
    [
        authMiddleware.verifyUserToken,
        authMiddleware.verifyUserRole('ADMIN')
    ],
    viewController.instructor_edit
);

router.get(
    ['/instructor_detail'],
    [
        authMiddleware.verifyUserToken,
        authMiddleware.verifyUserRole('ADMIN', 'INSTRUCTOR', 'STUDENT')
    ],
    viewController.instructor_detail
);

router.get(
    ['/subjects'],
    [authMiddleware.verifyUserToken],
    viewController.subjects
);

router.get(
    ['/subject_registration'],
    [
        authMiddleware.verifyUserToken,
        authMiddleware.verifyUserRole('ADMIN')
    ],
    viewController.subject_registration
);

router.get(
    ['/subject_edit'],
    [
        authMiddleware.verifyUserToken,
        authMiddleware.verifyUserRole('ADMIN')
    ],
    viewController.subject_edit
);

router.get(
    ['/subject_detail'],
    [authMiddleware.verifyUserToken],
    viewController.subject_detail
);

router.get(
    ['/terms'],
    [
        authMiddleware.verifyUserToken,
        authMiddleware.verifyUserRole('ADMIN', 'INSTRUCTOR', 'STUDENT')
    ],
    viewController.terms
);

router.get(
    ['/term_registration'],
    [
        authMiddleware.verifyUserToken,
        authMiddleware.verifyUserRole('ADMIN')
    ],
    viewController.term_registration
);

router.get(
    ['/term_edit'],
    [
        authMiddleware.verifyUserToken,
        authMiddleware.verifyUserRole('ADMIN')
    ],
    viewController.term_edit
);

router.get(
    ['/term_detail'],
    [
        authMiddleware.verifyUserToken,
        authMiddleware.verifyUserRole('ADMIN', 'INSTRUCTOR', 'STUDENT')
    ],
    viewController.term_detail
);

router.get(
    ['/attendance_scan'],
    [
        authMiddleware.verifyUserToken,
        authMiddleware.verifyUserRole('STUDENT')
    ],
    viewController.attendance_scan
);

router.get(
    ['/sessions'],
    [
        authMiddleware.verifyUserToken,
        authMiddleware.verifyUserRole('INSTRUCTOR')
    ],
    viewController.sessions
);

router.get(
    ['/session_registration'],
    [
        authMiddleware.verifyUserToken,
        authMiddleware.verifyUserRole('INSTRUCTOR')
    ],
    viewController.session_registration
);

router.get(
    ['/session_edit'],
    [
        authMiddleware.verifyUserToken,
        authMiddleware.verifyUserRole('INSTRUCTOR')
    ],
    viewController.session_edit
);

router.get(
    ['/session_detail'],
    [
        authMiddleware.verifyUserToken,
        authMiddleware.verifyUserRole('INSTRUCTOR')
    ],
    viewController.session_detail
);

router.get(
    ['/attendances'],
    [
        authMiddleware.verifyUserToken,
        authMiddleware.verifyUserRole('ADMIN', 'INSTRUCTOR', 'STUDENT')
    ],
    viewController.attendances
);

router.get(
    ['/profile'],
    [authMiddleware.verifyUserToken],
    viewController.profile
);

router.get(
    ['/change-password'],
    [authMiddleware.verifyUserToken],
    viewController.change_password
);

module.exports = router;