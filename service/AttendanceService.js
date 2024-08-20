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
                    invalidRollCallError.message = 'You are not related to this attendance.';
                    throw invalidRollCallError;
                }

                const attendance = await attendanceRepository.createAttendance(studentId, rollCallId);
                return attendance;
            } catch (error) {
                throw error;
            }
        }
    };
}


module.exports = attendanceService;