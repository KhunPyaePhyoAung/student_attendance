const express = require('express');
const router = express.Router();
const viewController = require('../controller/ViewController')();

router.get(
    ['/', '/home'],
    viewController.home
);

module.exports = router;