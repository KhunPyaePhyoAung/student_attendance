const {getConnection} = require('../tool/MySqlPool');

const studentRepository = () => {
    return {
        getAll: async () => {
            const connection = await getConnection();

            return new Promise((resolve, reject) => {
                const sql = 'SELECT s.*, u.email as `email`, u.role as `role`, u.status as `status`, u.created_at as `created_at` FROM `student` s JOIN `user` u ON s.`id` = u.`id` GROUP BY s.id';
                connection.query(sql, (error, results, fields) => {
                    if (error) {
                        reject(new Error(error.sqlMessage));
                    } else {
                        resolve(results);
                    }
                });
                connection.release();
            });
        },

        findAllByTermId: async (termId) => {
            const connection = await getConnection();

            return new Promise((resolve, reject) => {
                const sql = 'SELECT s.* FROM student s JOIN term_has_student t ON s.id = t.student_id WHERE t.term_id = ?';
                const params = [termId];
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

        findAllForAttendance: async (attendanceId) => {
            const connection = await getConnection();

            return new Promise((resolve, reject) => {
                const sql = 'SELECT stu.*, IF(att.student_id IS NOT NULL, "PRESENT", "ABSENT") AS status FROM student stu JOIN term_has_student ths ON ths.student_id = stu.id JOIN term t ON t.id = ths.term_id JOIN roll_call rc ON rc.term_id = t.id LEFT JOIN attendance att ON att.roll_call_id = rc.id AND att.student_id = stu.id WHERE rc.id = ? GROUP BY stu.id;';
                const params = [attendanceId];
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
                const sql = 'SELECT s.*, u.email as `email`, u.role as `role`, u.status as `status`, u.created_at as `created_at` FROM `student` s JOIN `user` u ON s.`id` = u.`id` WHERE `s`.`id` = ? GROUP BY s.id';
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

        findOneByEmail: async (email) => {
            const connection = await getConnection();

            return new Promise((resolve, reject) => {
                const sql = 'SELECT s.*, u.email as `email`, u.role as `role`, u.status as `status`, u.created_at as `created_at` FROM `student` s JOIN `user` u ON s.`id` = u.`id` WHERE `email` = ? GROUP BY s.id';
                const params = [email];
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

        searchByKeyword: async (keyword) => {
            const connection = await getConnection();

            return new Promise((resolve, reject) => {
                const sql = "SELECT s.*, u.email as `email`, u.role as `role`, u.status as `status`, u.created_at as `created_at` FROM `student` s JOIN `user` u ON s.`id` = u.`id` WHERE u.`email` LIKE ? OR s.`name` LIKE ? OR s.`nrc` LIKE ? OR s.`phone` LIKE ? OR s.`address` LIKE ? GROUP BY s.`id`";
                // const sql = "SELECT s.*, u.email as `email`, u.role as `role` FROM `student` s JOIN `user` u ON s.`id` = u.`id` WHERE s.`name` LIKE ? GROUP BY s.`id`";
                const params = [];
                params.push(`%${keyword}%`);
                params.push(`%${keyword}%`);
                params.push(`%${keyword}%`);
                params.push(`%${keyword}%`);
                params.push(`%${keyword}%`);

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

        getUniqueFields: async (student) => {
            const connection = await getConnection();

            let sqlCheckId = "";
            if (student.id) {
                sqlCheckId = " and `id` <> ?";
            }

            return new Promise((resolve, reject) => {
                const sql = 'SELECT s.*, u.email as `email`, u.role as `role`, u.status as `status`, u.created_at as `created_at` FROM `student` s JOIN `user` u ON s.`id` = u.`id` WHERE `nrc` = ?' + sqlCheckId + "  GROUP BY s.id";
                const params = [student.nrc, student.id];
                connection.query(sql, params, (error, results, fields) => {
                    if (error) {
                        resolve([]);
                    } else {
                        const fields = [];
                        results.forEach(element => {
                            if (element.nrc == student.nrc) {
                                fields.push("nrc");
                            }
                        });
                        resolve(fields);
                    }
                });
                connection.release();
            });
        },

        create: async (student) => {
            const connection = await getConnection();

            const insertedId = await new Promise((resolve, reject) => {
                const insertSql = 'INSERT INTO `student` (`id`, `name`, `role_no`, `year`, `nrc`, `phone`, `family_phone`, `gender`, `date_of_birth`, `address`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
                const insertParams = [student.id, student.name, student.role_no, student.year, student.nrc, student.phone, student.family_phone, student.gender, student.date_of_birth, student.address];
                connection.query(insertSql, insertParams, (error, result) => {
                    if (error) {
                        if (error.code === 'ER_DUP_ENTRY') {
                            const duplicateError = new Error();
                            duplicateError.field = "nrc";
                            duplicateError.message = "This NRC NO already used."
                            reject(duplicateError);
                        }  else {
                            reject(error);
                        }
                    } else {
                        resolve(result.insertId);
                    }
                });
            });

            return new Promise((resolve, reject) => {
                const sql = 'SELECT s.*, u.email as `email`, u.role as `role`, u.status as `status`, u.created_at as `created_at` FROM `student` s JOIN `user` u ON s.`id` = u.`id` WHERE s.`id` = ? GROUP BY s.id';
                const params = [insertedId];
                connection.query(sql, params, (error, results, fields) => {
                    if (error) {
                        reject(new Error(error.sqlMessage));
                    } else {
                        resolve(results[0]);
                    }
                });
            });;
        },

        updateById: async (id, student) => {
            const connection = await getConnection();

            const affectedRows = await new Promise((resolve, reject) => {
                const updateQuery = 'UPDATE `student` SET `name` = ?, `role_no` = ?, `year` = ?, `nrc` = ?, `phone` = ?, `family_phone` = ?, `gender` = ?, `date_of_birth` = ?, `address` = ? WHERE `id` = ?';
                const updateParams = [student.name, student.role_no, student.year, student.nrc, student.phone, student.family_phone, student.gender, student.date_of_birth, student.address, id];
                connection.query(updateQuery, updateParams, (error, result) => {
                    if (error) {
                        if (error.code === 'ER_DUP_ENTRY') {
                            const duplicateError = new Error();
                            duplicateError.field = "nrc";
                            duplicateError.message = "This NRC NO already used."
                            reject(duplicateError);
                        } else {
                            reject(error);
                        }
                    } else {
                        resolve(result.affectedRows);
                    }
                });
            });
        
            // connection.release();
        
            student.id = id;

            if (affectedRows) {
                return new Promise((resolve, reject) => {
                    const sql = 'SELECT s.*, u.email as `email`, u.role as `role`, u.status as `status`, u.created_at as `created_at` FROM `student` s JOIN `user` u ON s.`id` = u.`id` WHERE s.`id` = ? GROUP BY s.id';
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

            return student;
        },

        deleteById: async (id) => {
            const connection = await getConnection();

            const affectedRows = await new Promise((resolve, reject) => {
                const deleteSql = 'DELETE FROM `student` WHERE `id` = ?';
                const deleteParams = [id];
                connection.query(deleteSql, deleteParams, (error, result) => {
                    if (error) {
                        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
                            const deleteError = new Error();
                            deleteError.message = 'This student is in use.';
                            reject(deleteError);
                            return;
                        }
                        reject(error);
                    } else {
                        resolve(result.affectedRows);
                    }
                });
            });

            connection.release();

            return affectedRows === 1;
        },
    }
}

module.exports = studentRepository;