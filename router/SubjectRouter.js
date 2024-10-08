const express = require('express');
const router = express.Router();
const {subjectController} = require('../Dependencies');

router.get(
    '/',
    subjectController.getAll
);

router.get(
    '/:id(\\d+)',
    subjectController.findOneById
);

router.get(
    '/term/:termId(\\d+)',
    subjectController.findAllByTermId
);

router.post(
    '/',
    subjectController.create
);

router.put(
    '/:id(\\d+)',
    subjectController.update
);

router.delete(
    '/:id(\\d+)',
    subjectController.delete
);

module.exports = router;
