
const userService = ({userRepository}) => {
    return {
        getAll: async () => {
            try {
                const users = await userRepository.getAll();
                return users;
            } catch (error) {
                throw error;
            }
        },

        findOneById: async (id) => {
            try {
                const user = await userRepository.findOneById(id);
                return user;
            } catch (error) {
                throw error;
            }
        },

        findOneByEmail: async (email) => {
            try {
                const user = await userRepository.findOneByEmail(email);
                return user;
            } catch (error) {
                throw error;
            }
        }
    }
}

module.exports = userService;