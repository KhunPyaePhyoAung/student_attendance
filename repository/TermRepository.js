const {getConnection} = require('../tool/MySqlPool');

const termRepository = () => {
    return {
        getAll: async () => {
            const connection = await getConnection();

            return new Promise((resolve, reject) => {
                const sql = 'SELECT * FROM term';
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
                const insertSql = 'INSERT INTO `term` (`name`, `start_date`, `end_date`) VALUES (?, ?, ?)';
                const insertParams = [term.name, term.start_date, term.end_date];
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

        updateById: async (id, student) => {
            const connection = await getConnection();

            const affectedRows = await new Promise((resolve, reject) => {
                const updateQuery = 'UPDATE `term` SET `name` = ?, `start_date` = ?, `end_date` = ? WHERE `id` = ?';
                const updateParams = [student.name, student.start_date, student.end_date, id];
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
                        resolve(result.affectedRows);
                    }
                });
            });
        
            // connection.release();
        
            student.id = id;

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

            return student;
        },

        deleteById: async (id) => {
            const connection = await getConnection();

            const affectedRows = await new Promise((resolve, reject) => {
                const deleteSql = 'DELETE FROM `term` WHERE `id` = ?';
                const deleteParams = [id];
                connection.query(deleteSql, deleteParams, (error, result) => {
                    if (error) {
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