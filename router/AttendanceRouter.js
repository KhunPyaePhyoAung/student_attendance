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

module.exports = router;