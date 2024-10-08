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

        updateRollCallById: async (req, res) => {
            const rollCall = req.body;
            rollCall.instructor_id = req.user.id;

            try {
                const createdRollCall = await attendanceService.updateRollCallById(rollCall.id, rollCall);
                return res.status(200).json(
                    {
                        status: 200,
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
        },

        findOneById: async (req, res) => {
            const attendanceId = req.params.id;
            try {
                const attendance = await attendanceService.findOneById(attendanceId);
                return res.status(200).json(
                    {
                        status: 200,
                        data: attendance
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

        findOneDetailById: async (req, res) => {
            const attendanceId = req.query.id;
            try {
                const attendance = await attendanceService.findOneDetailById(attendanceId);
                return res.status(200).json(
                    {
                        status: 200,
                        data: attendance
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

        filter: async (req, res) => {
            const termId = req.query.term_id;
            const fromDate = req.query.from_date;
            const toDate = req.query.to_date;

            try {
                const attendances = await attendanceService.filterAttendances(termId, fromDate, toDate);
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
        },

        deleteSessionById: async (req, res) => {
            const sessionId = req.params.id;
            try {
                const deleted = await attendanceService.deleteSessionById(sessionId);
                if (deleted) {
                    return res.status(200).json({
                        status: 204,
                    });
                }
                
                return res.status(200).json({
                    status: 404,
                    message: 'No session found.'
                });
            } catch (error) {
                return res.status(200).json(
                    {
                        status: 400,
                        errors: [
                            {
                                message: error.message
                            }
                        ]
                    }
                );
            }
        },
    };

    
}

module.exports = attendanceController;