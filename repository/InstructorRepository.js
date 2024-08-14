const {getConnection} = require('../tool/MySqlPool');

const instructorRepository = () => {
    return {
        getAll: async () => {
            const connection = await getConnection();

            return new Promise((resolve, reject) => {
                const sql = 'SELECT * FROM `instructor`';
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

        },

        findOneByEmail: async (email) => {

        },

        create: async (instructor) => {

        },

        update: async (instructor) => {

        },

        deleteById: async (id) => {

        },
    }
}

module.exports = instructorRepository;