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
                            duplicateError.message = 'Your attendance already recorded.';
                            reject(duplicateError);
                            return;
                        }
                        reject(new Error(error.sqlMessage));
                    } else {
                        const sql = 'UPDATE roll_call SET attendance_code = ? WHERE id = ?';
                            const params = [uuidv4(), rollCallId];
                            connection.query(sql, params, (error, results, fields) => {
                                if (error) {
                                    reject(new Error(error.sqlMessage));
                                } else {
                                    resolve(results.insertId);
                                }
                            });
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
                const sql = 'SELECT r.id as id, t.name as term_name, s.name as subject_name, r.date, r.start_time, r.end_time, r.status FROM roll_call r JOIN term t ON r.term_id = t.id JOIN subject s ON r.subject_id = s.id WHERE r.instructor_id = ? ORDER BY r.date DESC, r.start_time DESC, r.end_time DESC, r.created_at DESC';
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
                const sql = `
                            SELECT 
                                a.id, 
                                a.date,
                                a.start_time, 
                                a.end_time, 
                                a.created_at, 
                                a.instructor_id, 
                                a.attendance_code, 
                                a.status, 
                                CASE 
                                    WHEN NOW() BETWEEN CONCAT(a.date, ' ', a.start_time) AND CONCAT(a.date, ' ', a.end_time) 
                                    THEN 'OPENING' 
                                    ELSE 'CLOSED' 
                                END as conditional_status, 
                                t.name as term_name, 
                                s.code as subject_code, 
                                s.name as subject_name, 
                                i.name as instructor_name 
                            FROM 
                                roll_call a 
                            JOIN 
                                term t ON a.term_id = t.id 
                            JOIN 
                                subject s ON a.subject_id = s.id 
                            JOIN 
                                instructor i ON a.instructor_id = i.id 
                            WHERE 
                                a.id = ?;
                            `;
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

        filterAttendances: async (termId, fromDate, toDate) => {
            const connection = await getConnection();

            termId = parseInt(termId);

            return new Promise((resolve, reject) => {
                const sql = `SELECT 
                                stu.id AS student_id,
                                stu.name AS student_name,
                                stu.nrc AS student_nrc,
                                stu.role_no AS student_role_no,
                                stu.phone AS student_phone,
                                stu.family_phone AS student_family_phone,
                                stu.gender AS student_gender,
                                stu.date_of_birth AS student_date_of_birth,
                                stu.address AS student_address,
                                sub.id AS subject_id,
                                sub.name AS subject_name,
                                COALESCE(COUNT(att.student_id), 0) AS attendance_times,
                                COALESCE(sub_total.total_times, 0) AS total_times
                            FROM 
                                student stu
                            JOIN 
                                roll_call rc ON rc.subject_id IN (
                                    SELECT subject_id
                                    FROM roll_call
                                    WHERE term_id = ?
                                    AND date >= ?
                                    AND date <= ?
                                )
                            JOIN 
                                subject sub ON rc.subject_id = sub.id
                            LEFT JOIN 
                                attendance att ON stu.id = att.student_id
                                                AND att.roll_call_id = rc.id
                            LEFT JOIN 
                                (
                                    SELECT 
                                        rc.subject_id, 
                                        COUNT(*) AS total_times
                                    FROM 
                                        roll_call rc
                                    WHERE 
                                        rc.term_id = ?
                                        AND rc.date >= ?
                                        AND rc.date <= ?
                                    GROUP BY 
                                        rc.subject_id
                                ) AS sub_total
                                ON rc.subject_id = sub_total.subject_id
                            WHERE 
                                rc.term_id = ?
                                AND rc.date >= ?
                                AND rc.date <= ?
                            GROUP BY 
                                stu.id, 
                                sub.id;

                            `;
                const params = [termId, fromDate, toDate, termId, fromDate, toDate, termId, fromDate, toDate];
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

    };
}

module.exports = attendanceRepository;