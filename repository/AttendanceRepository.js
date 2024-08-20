const { v4: uuidv4 } = require('uuid');

const {getConnection} = require('../tool/MySqlPool');

const attendanceRepository = () => {
    return {
        getRollCallByQRData: async (rollCallId, attendanceCode) => {
            const connection = await getConnection();

            return new Promise((resolve, reject) => {
                const sql = 'SELECT * FROM roll_call WHERE id = ? AND attendance_code = ? AND status = "OPENING"';
                const params = [rollCallId, attendanceCode];
                connection.query(sql, params, (error, results, fields) => {
                    if (error) {
                        reject(new Error(error.sqlMessage));
                    } else {
                        resolve(results[0]);
                    }
                });
                connection.release();
            });
        },

        createAttendance: async (studentId, rollCallId) => {
            const connection = await getConnection();

            return new Promise((resolve, reject) => {
                const sql = 'INSERT INTO attendance (roll_call_id, student_id) VALUES (?, ?)';
                const params = [rollCallId, studentId];
                connection.query(sql, params, (error, results, fields) => {
                    if (error) {
                        if (error.code === 'ER_DUP_ENTRY') {
                            const duplicateError = new Error();
                            duplicateError.message = 'You have already recorded this attendance';
                            reject(duplicateError);
                            return;
                        }
                        reject(new Error(error.sqlMessage));
                    } else {
                        resolve(results[0]);
                    }
                });
                connection.release();
            });
        },

        checkRollCallValidForStudent: async (studentId, rollCallId) => {
            const connection = await getConnection();

            return new Promise((resolve, reject) => {
                const sql = 'SELECT r.* FROM roll_call r JOIN term t ON r.term_id = t.id JOIN term_has_student tstu ON t.id = tstu.term_id WHERE tstu.student_id = ? AND r.id = ?';
                const params = [studentId, rollCallId];
                connection.query(sql, params, (error, results, fields) => {
                    if (error) {
                        reject(new Error(error.sqlMessage));
                    } else {
                        const rollCall = results[0];
                        return resolve(rollCall ? true : false);
                    }
                });
                connection.release();
            });
        },

        checkInstructorHasOpeningRollCall: async (instructorId) => {
            const connection = await getConnection();

            return new Promise((resolve, reject) => {
                const sql = 'SELECT * FROM roll_call WHERE instructor_id = ? AND status = "OPENING"';
                const params = [instructorId];
                connection.query(sql, params, (error, results, fields) => {
                    if (error) {
                        reject(new Error(error.sqlMessage));
                    } else {
                        const rollCall = results[0];
                        return resolve(rollCall ? true : false);
                    }
                });
                connection.release();
            });
        },

        createRollCall: async ({
            term_id,
            subject_id,
            instructor_id,
            date,
            start_time,
            end_time
        }) => {
            const connection = await getConnection();

            const insertedId = await new Promise((resolve, reject) => {
                const sql = 'INSERT INTO roll_call (date, start_time, end_time, term_id, subject_id, instructor_id, attendance_code) VALUES (?, ?, ?, ?, ?, ?, ?)';
                const params = [date, start_time, end_time, term_id, subject_id, instructor_id, uuidv4()];
                connection.query(sql, params, (error, results, fields) => {
                    if (error) {
                        if (error.code === 'ER_DUP_ENTRY') {
                            const duplicateError = new Error();
                            duplicateError.message = 'You have already recorded this attendance';
                            reject(duplicateError);
                            return;
                        }
                        reject(new Error(error.sqlMessage));
                    } else {
                        resolve(results.insertId);
                    }
                });
                connection.release();
            });

            return new Promise((resolve, reject) => {
                const sql = 'SELECT * FROM roll_call WHERE id = ?';
                const params = [insertedId];
                connection.query(sql, params, (error, results, fields) => {
                    if (error) {
                        reject(new Error(error.sqlMessage));
                    } else {
                        resolve(results[0]);
                    }
                });
            });
        },

        getAllAttendancesByInstructorId: async (instructorId) => {
            const connection = await getConnection();

            return new Promise((resolve, reject) => {
                const sql = 'SELECT t.name as term_name, s.name as subject_name, r.date, r.start_time, r.end_time, r.status FROM roll_call r JOIN term t ON r.term_id = t.id JOIN subject s ON r.subject_id = s.id WHERE r.instructor_id = ? ORDER BY r.created_at DESC';
                const params = [instructorId];
                connection.query(sql, params, (error, results, fields) => {
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