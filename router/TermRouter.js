const express = require('express');
const router = express.Router();
const {termController} = require('../Dependencies');

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
    '/all_for_instructor',
    [authMiddleware.verifyUserToken],
    termController.getAllForInstructor
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