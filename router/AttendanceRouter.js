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

router.put(
    ['/roll_call'],
    [authMiddleware.verifyUserToken],
    attendanceController.updateRollCallById
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

router.get(
    ['/filter'],
    [authMiddleware.verifyUserToken],
    attendanceController.filter
);

router.delete(
    ['/sessions/:id(\\d+)'],
    [authMiddleware.verifyUserToken],
    attendanceController.deleteSessionById
);

module.exports = router;