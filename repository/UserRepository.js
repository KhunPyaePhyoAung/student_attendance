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

        findOnById: async (id) => {
            const connection = await getConnection();

            return new Promise((resolve, reject) => {
                const sql = 'SELECT * FROM `user` WHERE `id` = ?';
                const params = [id];
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

        },

        update: async (instructor) => {

        },

        deleteById: async (id) => {

        },
    }
}

module.exports = userRepository;