const express = require('express');
const router = express.Router();
const {studentController} = require('../Dependencies');

router.get(
    '/',
    studentController.getAll
);

router.get(
    '/search',
    studentController.searchByKeyword
);

router.get(
    '/:id(\\d+)',
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
    '/:id(\\d+)',
    studentController.update
);

router.delete(
    '/:id(\\d+)',
    studentController.delete
);



module.exports = router;