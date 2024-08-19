const {getConnection} = require('../tool/MySqlPool');

const attendanceRepository = () => {
    return {
        getRollCallByQRData: async (studentId, termId, subjectId, attendanceCode) => {
            const connection = await getConnection();

            return new Promise((resolve, reject) => {
                const sql = 'SELECT r.* FROM roll_call r JOIN term t ON r.term_id = t.id JOIN term_has_subject tsub ON t.id = tsub.term_id JOIN term_has_student tstu ON t.id = tstu.term_id WHERE tstu.student_id = 2 AND tsub.subject_id = 1 AND t.id = 1 AND r.attendance_code = "test"';
                connection.query(sql, (error, results, fields) => {
                    if (error) {
                        reject(new Error(error.sqlMessage));
                    } else {
                        resolve(results);
                    }
                });
                connection.release();
            });
        }

    };
}

module.exports = attendanceRepository;