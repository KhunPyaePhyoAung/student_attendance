const express = require('express');
const router = express.Router();
const {instructorController} = require('../Dependencies');

router.get(
    '/',
    instructorController.getAll
);

router.get(
    '/search',
    instructorController.searchByKeyword
);

router.get(
    '/:id(\\d+)',
    instructorController.findOneById
);

router.post(
    '/',
    instructorController.create
);

router.put(
    '/:id(\\d+)',
    instructorController.update
);

router.delete(
    '/:id(\\d+)',
    instructorController.delete
);

module.exports = router;
