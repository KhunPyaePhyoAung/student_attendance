const attendanceService = ({attendanceRepository}) => {
    return {
        recordAttendanceQR: async (studentId, rollCallId, attendanceCode) => {
    
            try {
                const rollCall = await attendanceRepository.getRollCallByQRData(rollCallId, attendanceCode);

                if (!rollCall) {
                    const invalidRollCallError = new Error();
                    invalidRollCallError.message = 'Invalid QR Code';
                    throw invalidRollCallError;
                }

                const rollCallValidForStudent = await attendanceRepository.checkRollCallValidForStudent(studentId, rollCall.id);

                if (!rollCallValidForStudent) {
                    const invalidRollCallError = new Error();
                    invalidRollCallError.message = 'You are not enrolled in this session.';
                    throw invalidRollCallError;
                }

                const attendance = await attendanceRepository.createAttendance(studentId, rollCallId);
                return attendance;
            } catch (error) {
                throw error;
            }
        },

        createRollCall: async (rollCall) => {
            try {
                const hasOpenRollCall = await attendanceRepository.checkInstructorHasOpeningRollCall(rollCall.id, rollCall.instructor_id);
                if (hasOpenRollCall) {
                    const error = new Error();
                    error.message = 'You have an opening session.';
                    throw error;
                }
                const createdRollCall = await attendanceRepository.createRollCall(rollCall);
                return createdRollCall;
            } catch (error) {
                throw error;
            }
        },

        updateRollCallById: async (id, rollCall) => {
            try {
                const hasOpenRollCall = await attendanceRepository.checkInstructorHasOpeningRollCall(id, rollCall.instructor_id);
                if (hasOpenRollCall) {
                    const error = new Error();
                    error.message = 'You have an opening session.';
                    throw error;
                }
                const createdRollCall = await attendanceRepository.updateRollCallById(id, rollCall);
                return createdRollCall;
            } catch (error) {
                throw error;
            }
        },

        getAllAttendancesByInstructorId: async (instructorId) => {
            try {
                const attendances = await attendanceRepository.getAllAttendancesByInstructorId(instructorId);
                return attendances;
            } catch (error) {
                throw error;
            }
        },

        findOneById: async (id) => {
            try {
                const attendance = await attendanceRepository.findOneById(id);
                return attendance;
            } catch (error) {
                throw error;
            }
        },

        findOneDetailById: async (id) => {
            try {
                const attendance = await attendanceRepository.findOneDetailById(id);
                return attendance;
            } catch (error) {
                throw error;
            }
        },

        filterAttendances: async (termId, fromDate, toDate) => {
            try {
                const attendances = await attendanceRepository.filterAttendances(termId, fromDate, toDate);
                return attendances;
            } catch (error) {
                throw error;
            }
        },

    };
}


module.exports = attendanceService;