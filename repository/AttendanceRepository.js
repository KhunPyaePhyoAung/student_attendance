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

        checkInstructorHasOpeningRollCall: async (rollcallId, instructorId) => {
            const connection = await getConnection();

            let cond = '';
            if (rollcallId) {
                cond += ' AND id <> ?';
            }

            return new Promise((resolve, reject) => {
                const sql = 'SELECT * FROM roll_call WHERE instructor_id = ? AND status = "OPENING"' + cond;
                const params = [instructorId, rollcallId];
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
                            duplicateError.message = 'Unique field';
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

        updateRollCallById: async (
            id,
            {
            term_id,
            subject_id,
            instructor_id,
            date,
            start_time,
            end_time,
            status
        }) => {
            const connection = await getConnection();

            const insertedId = await new Promise((resolve, reject) => {
                const sql = 'UPDATE roll_call SET date = ?, start_time = ?, end_time = ?, term_id = ?, subject_id = ?, instructor_id = ?, status = ? WHERE id = ?';
                const params = [date, start_time, end_time, term_id, subject_id, instructor_id, status, id];
                connection.query(sql, params, (error, results, fields) => {
                    if (error) {
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
                const sql = 'SELECT r.id as id, t.name as term_name, s.name as subject_name, r.date, r.start_time, r.end_time, r.status FROM roll_call r JOIN term t ON r.term_id = t.id JOIN subject s ON r.subject_id = s.id WHERE r.instructor_id = ? ORDER BY r.created_at DESC';
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
        },

        findOneById: async (id) => {
            const connection = await getConnection();

            return new Promise((resolve, reject) => {
                // const sql = 'SELECT a.*, t.id as term_id, s.id as subject_id FROM roll_call a JOIN term t ON a.term_id = t.id JOIN subject s ON a.subject_id = s.id WHERE a.id = ?';
                const sql = 'SELECT a.id, a.date,a.start_time, a.end_time, a.created_at, a.instructor_id, a.attendance_code, t.id as term_id, s.id as subject_id, a.status, CASE WHEN CONCAT(a.date, " ", a.end_time) < NOW() THEN "CLOSED" ELSE a.status END as conditional_status FROM roll_call a JOIN term t ON a.term_id = t.id JOIN subject s ON a.subject_id = s.id WHERE a.id = ?;';
                const params = [id];
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

        findOneDetailById: async (id) => {
            const connection = await getConnection();

            return new Promise((resolve, reject) => {
                const sql = 'SELECT a.id, a.date,a.start_time, a.end_time, a.created_at, a.instructor_id, a.attendance_code, a.status, CASE WHEN CONCAT(a.date, " ", a.end_time) < NOW() THEN "CLOSED" ELSE a.status END as conditional_status, t.name as term_name, s.code as subject_code, s.name as subject_name, i.name as instructor_name FROM roll_call a JOIN term t ON a.term_id = t.id JOIN subject s ON a.subject_id = s.id JOIN instructor i ON a.instructor_id = i.id WHERE a.id = ?';
                const params = [id];
                connection.query(sql, params, (error, results, fields) => {
                    if (error) {
                        reject(new Error(error.sqlMessage));
                    } else {
                        resolve(results[0]);
                    }
                });
                connection.release();
            });
        }

    };
}

module.exports = attendanceRepository;