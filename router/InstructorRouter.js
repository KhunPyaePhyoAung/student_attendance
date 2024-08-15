const express = require('express');
const router = express.Router();


const instructorRepository = require('../repository/InstructorRepository')();
const instructorService = require('../service/InstructorService')({instructorRepository});
const instructorController = require('../controller/InstructorController')({instructorService});

router.get(
    '/',
    instructorController.getAll
);

router.get(
    '/all',
    (req, res) => {
        return res.writeHead(301, {
            Location: `http://localhost:3500/api/instructors`
          }).end();
    }
)

module.exports = router;