const {getConnection} = require('../tool/MySqlPool');

const userRepository = () => {
    return {
        getAll: async () => {
            const connection = await getConnection();

            return new Promise((resolve, reject) => {
                const sql = 'SELECT * FROM `user`';
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
                const sql = 'SELECT * FROM `user` WHERE `id` = ?';
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
                const sql = 'SELECT * FROM `user` WHERE `email` = ?';
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

        create: async (user) => {
            const connection = await getConnection();

            const insertedId = await new Promise((resolve, reject) => {
                const insertSql = 'INSERT INTO `user` (`email`, `password`, `role`) VALUES (?, ?, ?)';
                const insertParams = [user.email, user.password, user.role];
                connection.query(insertSql, insertParams, (error, result) => {
                    if (error) {
                        if (error.code === 'ER_DUP_ENTRY') {
                            const duplicateError = new Error();
                            duplicateError.field = "email";
                            duplicateError.message = "This email already used."
                            reject(duplicateError);
                        }  else {
                            reject(error);
                        }
                    } else {
                        resolve(result.insertId);
                    }
                });
            });

            
            // const createdUser = await this.findOneById(insertedId);

            return new Promise((resolve, reject) => {
                const sql = 'SELECT * FROM `user` WHERE `id` = ?';
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

        updateById: async (id, user) => {
            const connection = await getConnection();

            const affectedRows = await new Promise((resolve, reject) => {
                const updateQuery = 'UPDATE `user` SET `email` = ?, `password` = ?, `role` = ? WHERE `id` = ?';
                const updateParams = [user.email, user.password, user.role, id];
                connection.query(updateQuery, updateParams, (error, result) => {
                    if (error) {
                        if (error.code === 'ER_DUP_ENTRY') {
                            const duplicateError = new Error();
                            duplicateError.field = "email";
                            duplicateError.message = "This email already used."
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
        
            user.id = id;

            if (affectedRows) {
                return new Promise((resolve, reject) => {
                    const sql = 'SELECT * FROM `user` WHERE `id` = ?';
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

            return user;
        },

        deleteById: async (id) => {
            const connection = await getConnection();

            const affectedRows = await new Promise((resolve, reject) => {
                const deleteSql = 'DELETE FROM `user` WHERE `id` = ?';
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

module.exports = userRepository;