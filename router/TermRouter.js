const express = require('express');
const router = express.Router();

const termRepository = require('../repository/TermRepository')();
const termService = require('../service/TermService')({termRepository});
const termController = require('../controller/TermController')({termService});

router.get(
    '/',
    termController.getAll
);

router.get(
    '/search',
    termController.searchByKeyword
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