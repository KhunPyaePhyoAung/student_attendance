const { getConnection } = require('../tool/MySqlPool');

const instructorRepository = () => {
    return {
        getAll: async () => {
            const connection = await getConnection();

            return new Promise((resolve, reject) => {
                const sql = 'SELECT i.*, u.email as `email`, u.role as `role`, u.status as `status`, u.created_at as `created_at` FROM `instructor` i JOIN `user` u ON i.`id` = u.`id` GROUP BY i.id';
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
                const sql = 'SELECT i.*, u.email as `email`, u.role as `role`, u.status as `status`, u.created_at as `created_at` FROM `instructor` i JOIN `user` u ON i.`id` = u.`id` WHERE `i`.`id` = ? GROUP BY i.id';
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
                const sql = 'SELECT i.*, u.email as `email`, u.role as `role`, u.status as `status`, u.created_at as `created_at` FROM `instructor` i JOIN `user` u ON i.`id` = u.`id` WHERE `email` = ? GROUP BY i.id';
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
                const sql = "SELECT i.*, u.email as `email`, u.role as `role`, u.status as `status`, u.created_at as `created_at` FROM `instructor` i JOIN `user` u ON i.`id` = u.`id` WHERE u.`email` LIKE ? OR i.`name` LIKE ? OR i.`nrc` LIKE ? OR i.`phone` LIKE ? OR i.`address` LIKE ? GROUP BY i.`id`";
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

        getUniqueFields: async (instructor) => {
            const connection = await getConnection();

            let sqlCheckId = "";
            if (instructor.id) {
                sqlCheckId = " and `id` <> ?";
            }

            return new Promise((resolve, reject) => {
                const sql = 'SELECT i.*, u.email as `email`, u.role as `role`, u.status as `status`, u.created_at as `created_at` FROM `instructor` i JOIN `user` u ON i.`id` = u.`id` WHERE `nrc` = ?' + sqlCheckId + "  GROUP BY i.id";
                const params = [instructor.nrc, instructor.id];
                connection.query(sql, params, (error, results, fields) => {
                    if (error) {
                        resolve([]);
                    } else {
                        const fields = [];
                        results.forEach(element => {
                            if (element.nrc == instructor.nrc) {
                                fields.push("nrc");
                            }
                        });
                        resolve(fields);
                    }
                });
                connection.release();
            });
        },

        create: async (instructor) => {
            const connection = await getConnection();

            const insertedId = await new Promise((resolve, reject) => {
                const insertSql = 'INSERT INTO `instructor` (`id`, `name`, `nrc`, `phone`, `gender`, `date_of_birth`, `address`) VALUES (?, ?, ?, ?, ?, ?, ?)';
                const insertParams = [instructor.id, instructor.name, instructor.nrc, instructor.phone, instructor.gender, instructor.date_of_birth, instructor.address];
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
                const sql = 'SELECT i.*, u.email as `email`, u.role as `role`, u.status as `status`, u.created_at as `created_at` FROM `instructor` i JOIN `user` u ON i.`id` = u.`id` WHERE i.`id` = ? GROUP BY i.id';
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

        updateById: async (id, instructor) => {
            const connection = await getConnection();

            const affectedRows = await new Promise((resolve, reject) => {
                const updateQuery = 'UPDATE `instructor` SET `name` = ?, `nrc` = ?, `phone` = ?, `gender` = ?, `date_of_birth` = ?, `address` = ? WHERE `id` = ?';
                const updateParams = [instructor.name, instructor.nrc, instructor.phone, instructor.gender, instructor.date_of_birth, instructor.address, id];
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
        
            instructor.id = id;

            if (affectedRows) {
                return new Promise((resolve, reject) => {
                    const sql = 'SELECT i.*, u.email as `email`, u.role as `role`, u.status as `status`, u.created_at as `created_at` FROM `instructor` i JOIN `user` u ON i.`id` = u.`id` WHERE i.`id` = ? GROUP BY i.id';
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

            return instructor;
        },

        deleteById: async (id) => {
            const connection = await getConnection();

            const affectedRows = await new Promise((resolve, reject) => {
                const deleteSql = 'DELETE FROM `instructor` WHERE `id` = ?';
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

module.exports = instructorRepository;
