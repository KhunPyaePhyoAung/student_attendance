const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/AuthMiddleware');
const attendanceController = require('../controller/AttendanceController')({});

router.post(
    ['/attendance_scan'],
    [authMiddleware.verifyUserToken],
    attendanceController.recordAttendanceQR
);

module.exports = router;