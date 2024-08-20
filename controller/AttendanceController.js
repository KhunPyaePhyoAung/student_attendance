const attendanceController = ({attendanceService}) => {

    return {
        recordAttendanceQR: async (req, res) => {
            const studentId = req.user.id;
            const {roll_call_id, attendance_code} = req.body;

            try {
                await attendanceService.recordAttendanceQR(studentId, roll_call_id, attendance_code);
                return res.status(200).json(
                    {
                        status: 200,
                        message: "Attendance Recorded"
                    }
                );
            } catch (error) {
                return res.status(200).json(
                    {
                        status: 400,
                        message: error.message
                    }
                );
            }
            
        }
    };
}

module.exports = attendanceController;