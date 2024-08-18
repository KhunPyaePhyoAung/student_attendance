const { getConnection } = require('../tool/MySqlPool');

const subjectRepository = () => {
    return {
        getAll: async () => {
            const connection = await getConnection();

            return new Promise((resolve, reject) => {
                const sql = 'SELECT * FROM `subject`';
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
                const sql = 'SELECT * FROM `subject` WHERE `id` = ?';
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


        getUniqueFields: async (subject) => {
            const connection = await getConnection();

            let sqlCheckId = "";
            if (subject.id) {
                sqlCheckId = " and `id` <> ?";
            }

            return new Promise((resolve, reject) => {
                const sql = 'SELECT * FROM `subject` WHERE `code` = ?' + sqlCheckId;
                const params = [subject.code, subject.id];
                connection.query(sql, params, (error, results, fields) => {
                    if (error) {
                        resolve([]);
                    } else {
                        const fields = [];
                        results.forEach(element => {
                            if (element.code == subject.code) {
                                fields.push("code");
                            }
                        });
                        resolve(fields);
                    }
                });
                connection.release();
            });
        },

        create: async (subject) => {
            const connection = await getConnection();

            const insertedId = await new Promise((resolve, reject) => {
                const insertSql = 'INSERT INTO `subject` (`code`, `name`) VALUES (?, ?)';
                const insertParams = [subject.code, subject.name];
                connection.query(insertSql, insertParams, (error, result) => {
                    if (error) {
                        if (error.code === 'ER_DUP_ENTRY') {
                            const duplicateError = new Error();
                            duplicateError.field = "code";
                            duplicateError.message = "This code is already used."
                            reject(duplicateError);
                        } else {
                            reject(error);
                        }
                    } else {
                        resolve(result.insertId);
                    }
                });
            });

            return new Promise((resolve, reject) => {
                const sql = 'SELECT * FROM `subject` WHERE `id` = ?';
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

        updateById: async (id, subject) => {
            const connection = await getConnection();

            const affectedRows = await new Promise((resolve, reject) => {
                const updateQuery = 'UPDATE `subject` SET `code` = ?, `name` = ? WHERE `id` = ?';
                const updateParams = [subject.code, subject.name, id];
                connection.query(updateQuery, updateParams, (error, result) => {
                    if (error) {
                        if (error.code === 'ER_DUP_ENTRY') {
                            const duplicateError = new Error();
                            duplicateError.field = "code";
                            duplicateError.message = "This code is already used."
                            reject(duplicateError);
                        } else {
                            reject(error);
                        }
                    } else {
                        resolve(result.affectedRows);
                    }
                });
            });

            subject.id = id;

            if (affectedRows) {
                return new Promise((resolve, reject) => {
                    const sql = 'SELECT * FROM `subject` WHERE `id` = ?';
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

            return subject;
        },

        deleteById: async (id) => {
            const connection = await getConnection();

            const affectedRows = await new Promise((resolve, reject) => {
                const deleteSql = 'DELETE FROM `subject` WHERE `id` = ?';
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

module.exports = subjectRepository;
