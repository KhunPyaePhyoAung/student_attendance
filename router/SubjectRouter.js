const express = require('express');
const router = express.Router();

const subjectRepository = require('../repository/SubjectRepository')();
const subjectService = require('../service/SubjectService')({ subjectRepository });
const subjectController = require('../controller/SubjectController')({ subjectService });

router.get(
    '/',
    subjectController.getAll
);

router.get(
    '/:id',
    subjectController.findOneById
);

router.get(
    '/term/:termId',
    subjectController.findAllByTermId
);

router.post(
    '/',
    subjectController.create
);

router.put(
    '/:id',
    subjectController.update
);

router.delete(
    '/:id',
    subjectController.delete
);

module.exports = router;
