
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

        getUniqueFields: async (user) => {
            try {
                const fields = await userRepository.getUniqueFields(user);
                return fields;
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
                const updatedUser = await userRepository.updateById(intId, user);
                return updatedUser;
            } catch (error) {
                throw error;
            }
        },

        updatePasswordById: async (id, oldPassword, newPassword) => {
            try {
                const intId = parseInt(id);
                const hashOldPassword = passwordEncryptService.encrypt(oldPassword);

                const user = await userRepository.findOneById(id);
                if (!passwordEncryptService.match(oldPassword, user.password)) {
                    const passwordError = new Error();
                    passwordError.fieldName = 'old_password';
                    passwordError.message = 'Incorrect old password';
                    throw passwordError;
                }

                if (oldPassword == newPassword) {
                    const passwordError = new Error();
                    passwordError.fieldName = 'new_password';
                    passwordError.message = 'New password cannot be the same as old password.';
                    throw passwordError;
                }

                const hashNewPassword = passwordEncryptService.encrypt(newPassword);
                const updatedUser = await userRepository.updatePasswordById(intId, hashNewPassword);
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