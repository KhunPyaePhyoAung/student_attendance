const attendanceController = ({attendanceService}) => {

    return {
        recordAttendanceQR: async (req, res) => {
            const studentId = req.user.id;
            const {roll_call_id, attendance_code} = req.body;

            try {
                await attendanceService.recordAttendanceQR(studentId, roll_call_id, attendance_code);
                return res.status(200).json(
                    {
                        status: 201,
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
            
        },

        createRollCall: async (req, res) => {
            const rollCall = req.body;
            rollCall.instructor_id = req.user.id;

            try {
                const createdRollCall = await attendanceService.createRollCall(rollCall);
                return res.status(200).json(
                    {
                        status: 201,
                        data: createdRollCall
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
        },

        getAllAttendancesByInstructorId: async (req, res) => {
            const instructorId = req.user.id;
            try {
                const attendances = await attendanceService.getAllAttendancesByInstructorId(instructorId);
                return res.status(200).json(
                    {
                        status: 200,
                        meata: {
                            total: attendances.length
                        },
                        data: attendances
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