
const userService = ({userRepository, passwordEncryptService}) => {
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
        },

        create: async (user) => {
            try {
                user.password = passwordEncryptService.encrypt(user.password);
                const createdUser = await userRepository.create(user);
                return createdUser;
            } catch (error) {
                throw error;
            }
        },

        updateById: async (id, user) => {
            try {
                const intId = parseInt(id);
                user.password = passwordEncryptService.encrypt(user.password);
                const updatedUser = await userRepository.updateById(intId, user);
                return updatedUser;
            } catch (error) {
                throw error;
            }
        },

        deleteById: async (id) => {
            try {
                const intId = parseInt(id);
                const deleted = await userRepository.deleteById(intId);
                return deleted;
            } catch (error) {
                throw error;
            }
        }
    }
}

module.exports = userService;