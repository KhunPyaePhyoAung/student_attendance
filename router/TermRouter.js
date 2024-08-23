const express = require('express');
const router = express.Router();

const subjectRepository = require('../repository/SubjectRepository')();
const subjectService = require('../service/SubjectService')({ subjectRepository });
const termRepository = require('../repository/TermRepository')();
const termService = require('../service/TermService')({termRepository, subjectService});
const termController = require('../controller/TermController')({termService});
const authMiddleware = require('../middleware/AuthMiddleware');

router.get(
    '/',
    termController.getAll
);

router.get(
    '/search',
    termController.searchByKeyword
);

router.get(
    '/instructor',
    [authMiddleware.verifyUserToken],
    termController.getActiveTermsForInstructor
);

router.get(
    '/student',
    [authMiddleware.verifyUserToken],
    termController.getAllForStudent
);

router.get(
    '/:id(\\d+)',
    termController.findOneById
);



router.post(
    '/',
    termController.create
);

router.put(
    '/:id(\\d+)',
    termController.update
);

router.delete(
    '/:id(\\d+)',
    termController.delete
);

module.exports = router;