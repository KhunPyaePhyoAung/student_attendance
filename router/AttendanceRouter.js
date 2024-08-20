const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/AuthMiddleware');
const attendanceRepository = require('../repository/AttendanceRepository')();
const attendanceService = require('../service/AttendanceService')({attendanceRepository});
const attendanceController = require('../controller/AttendanceController')({attendanceService});

router.post(
    ['/attendance_scan'],
    [authMiddleware.verifyUserToken],
    attendanceController.recordAttendanceQR
);

router.post(
    ['/roll_call'],
    [authMiddleware.verifyUserToken],
    attendanceController.createRollCall
);

router.get(
    ['/:id(\\d+)'],
    [authMiddleware.verifyUserToken],
    attendanceController.findOneById
);

router.get(
    ['/detail'],
    [authMiddleware.verifyUserToken],
    attendanceController.findOneDetailById
);

router.get(
    ['/instructor'],
    [authMiddleware.verifyUserToken],
    attendanceController.getAllAttendancesByInstructorId
);

module.exports = router;