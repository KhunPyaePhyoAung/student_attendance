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
    '/:id',
    termController.findOneById
);



router.post(
    '/',
    termController.create
);

router.put(
    '/:id',
    termController.update
);

router.delete(
    '/:id',
    termController.delete
);

module.exports = router;