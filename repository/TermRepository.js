const {getConnection} = require('../tool/MySqlPool');

const termRepository = () => {
    return {
        getAll: async () => {
            const connection = await getConnection();

            return new Promise((resolve, reject) => {
                const sql = 'SELECT t.*, COUNT(DISTINCT tsb.subject_id) AS subject_count, COUNT(DISTINCT tst.student_id) AS student_count FROM term t LEFT JOIN term_has_subject tsb ON t.id = tsb.term_id LEFT JOIN term_has_student tst ON t.id = tst.term_id GROUP BY t.id ORDER BY t.`start_date` DESC, t.`end_date` DESC, t.`created_at` DESC';
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

        getAllForStudent: async (studentId) => {
            const connection = await getConnection();

            return new Promise((resolve, reject) => {
                const sql = `
                    SELECT 
                        t.*, 
                        COUNT(DISTINCT tsb.subject_id) AS subject_count, 
                        COUNT(DISTINCT CASE WHEN tst.student_id IS NOT NULL THEN tst.student_id END) AS student_count
                    FROM 
                        term t
                    LEFT JOIN 
                        term_has_subject tsb ON t.id = tsb.term_id
                    LEFT JOIN 
                        term_has_student tst ON t.id = tst.term_id
                    GROUP BY 
                        t.id
                    HAVING 
                        COUNT(CASE WHEN tst.student_id = ? THEN 1 END) > 0
                    ORDER BY 
                        t.start_date DESC, 
                        t.end_date DESC, 
                        t.created_at DESC;
                `;
                const params = [studentId];
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

        getAllForInstructor: async (instructorId) => {
            const connection = await getConnection();

            return new Promise((resolve, reject) => {
                const sql = `
                    SELECT t.* FROM term t JOIN term_has_subject tsub ON t.id = tsub.term_id JOIN subject s ON tsub.subject_id = s.id JOIN instructor i ON s.instructor_id = i.id WHERE i.id = ? GROUP BY t.id ORDER BY t.start_date DESC, t.end_date DESC, t.created_at DESC;
                `;
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

        getActiveTermsForInstructor: async (instructorId) => {
            const connection = await getConnection();

            return new Promise((resolve, reject) => {
                const sql = 'SELECT t.*, s.id as sub_id, i.id as instructor_id FROM term t JOIN term_has_subject tsub ON t.id = tsub.term_id JOIN subject s ON tsub.subject_id = s.id JOIN instructor i ON s.instructor_id = i.id WHERE start_date <= NOW() AND end_date >= NOW() AND i.id = ? GROUP BY t.id ORDER BY t.start_date DESC, t.end_date DESC, t.created_at DESC';
                const params = [instructorId];
                connection.query(sql, instructorId, (error, results, fields) => {
                    if (error) {
                        reject(new Error(error.sqlMessage));
                    } else {
                        resolve([...results]);
                    }
                });
                connection.release();
            });
        },

        findOneById: async (id) => {
            const connection = await getConnection();

            return new Promise((resolve, reject) => {
                const sql = 'SELECT * FROM term WHERE `id` = ?';
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

        searchByKeyword: async (keyword) => {
            const connection = await getConnection();

            return new Promise((resolve, reject) => {
                const sql = "SELECT * FROM term WHERE name LIKE ?";
                // const sql = "SELECT s.*, u.email as `email`, u.role as `role` FROM `student` s JOIN `user` u ON s.`id` = u.`id` WHERE s.`name` LIKE ? GROUP BY s.`id`";
                const params = [];
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

        getUniqueFields: async (term) => {
            const connection = await getConnection();

            let sqlCheckId = "";
            if (term.id) {
                sqlCheckId = " and `id` <> ?";
            }

            return new Promise((resolve, reject) => {
                const sql = 'SELECT * FROM term WHERE `name` = ?' + sqlCheckId;
                const params = [term.name, term.id];
                connection.query(sql, params, (error, results, fields) => {
                    if (error) {
                        resolve([]);
                    } else {
                        const fields = [];
                        results.forEach(element => {
                            if (element.name == term.name) {
                                fields.push("name");
                            }
                        });
                        resolve(fields);
                    }
                });
                connection.release();
            });
        },

        create: async (term) => {
            const connection = await getConnection();

            const insertedId = await new Promise((resolve, reject) => {
                const insertSql = 'INSERT INTO `term` (`name`, `start_year`, `end_year`, `year`, `term`, `start_date`, `end_date`) VALUES (?, ?, ?, ?, ?, ?, ?)';
                const insertParams = [term.name, term.start_year, term.end_year, term.year, term.term, term.start_date, term.end_date];
                connection.query(insertSql, insertParams, (error, result) => {
                    if (error) {
                        if (error.code === 'ER_DUP_ENTRY') {
                            const duplicateError = new Error();
                            duplicateError.field = "name";
                            duplicateError.message = "This name already used."
                            reject(duplicateError);
                        }  else {
                            reject(error);
                        }
                    } else {
                        const insertStudentSql = 'INSERT INTO term_has_student (`term_id`, `student_id`) VALUES ?';
                        const insertStudentParams = [];
                        term.students.forEach(studentId => {
                            insertStudentParams.push([result.insertId, studentId]);
                        });
                        connection.query(insertStudentSql, [insertStudentParams]);

                        const insertSubjectSql = 'INSERT INTO term_has_subject (`term_id`, `subject_id`) VALUES ?';
                        const insertSubjectParams = [];
                        term.subjects.forEach(subjectsId => {
                            insertSubjectParams.push([result.insertId, subjectsId]);
                        });
                        connection.query(insertSubjectSql, [insertSubjectParams]);

                        resolve(result.insertId);
                    }
                });

                
            });

            return new Promise((resolve, reject) => {
                const sql = 'SELECT * FROM term WHERE `id` = ?';
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

        updateById: async (id, term) => {
            const connection = await getConnection();

            const affectedRows = await new Promise((resolve, reject) => {
                const updateQuery = 'UPDATE `term` SET `name` = ?, `start_year` = ?, `end_year` = ?, `year` = ?, `term` = ?, `start_date` = ?, `end_date` = ? WHERE `id` = ?';
                const updateParams = [term.name, term.start_year, term.end_year, term.year, term.term, term.start_date, term.end_date, id];
                connection.query(updateQuery, updateParams, (error, result) => {
                    if (error) {
                        if (error.code === 'ER_DUP_ENTRY') {
                            const duplicateError = new Error();
                            duplicateError.field = "name";
                            duplicateError.message = "This name already used."
                            reject(duplicateError);
                        } else {
                            reject(error);
                        }
                    } else {
                        const deleteStudentQuery = 'DELETE FROM term_has_student WHERE term_id = ?';
                        const deleteStudentParams = [id];
                        connection.query(deleteStudentQuery, deleteStudentParams, (error, result) => {
                            if (!error) {
                                const insertQuery = 'INSERT INTO term_has_student (`term_id`, `student_id`) VALUES ?';
                                const insertParams = [];
                                term.students.forEach(studentId => {
                                    insertParams.push([id, studentId]);
                                });
                                
                                connection.query(insertQuery, [insertParams]);
                                resolve(result.affectedRows);
                            }
                        });

                        const deleteSubjectQuery = 'DELETE FROM term_has_subject WHERE term_id = ?';
                        const deleteSubjectParams = [id];
                        connection.query(deleteSubjectQuery, deleteSubjectParams, (error, result) => {
                            if (!error) {
                                const insertQuery = 'INSERT INTO term_has_subject (`term_id`, `subject_id`) VALUES ?';
                                const insertParams = [];
                                term.subjects.forEach(subjectId => {
                                    insertParams.push([id, subjectId]);
                                });
                                
                                connection.query(insertQuery, [insertParams]);
                                resolve(result.affectedRows);
                            }
                        });
                        resolve(result.affectedRows);
                    }
                });
            });
        
            // connection.release();
        
            term.id = id;

            if (affectedRows) {
                return new Promise((resolve, reject) => {
                    const sql = 'SELECT * FROM term WHERE `id` = ?';
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

            return term;
        },

        deleteById: async (id) => {
            const connection = await getConnection();

            const affectedRows = await new Promise((resolve, reject) => {
                const deleteSql = 'DELETE FROM `term` WHERE `id` = ?';
                const deleteParams = [id];
                connection.query(deleteSql, deleteParams, (error, result) => {
                    if (error) {
                        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
                            const deleteError = new Error();
                            deleteError.message = 'This term is in use.'
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

module.exports = termRepository;