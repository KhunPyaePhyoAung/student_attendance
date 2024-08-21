
const authService = ({ userRepository, passwordEncryptService} ) => {
    return {
        loginWithEmailAndPassword: async (email, password) => {
            try {
                const user = await userRepository.findOneByEmail(email);
                const error = new Error();

                if (!user) {
                    error.field = 'email';
                    error.message = 'User does not exist';
                    throw error;
                }

                if (user.status === 'INACTIVE') {
                    error.field = 'account';
                    error.message = 'Your account is inactive.';
                    throw error;
                }

                if (!passwordEncryptService.match(password, user.password)) {
                    error.field = 'password';
                    error.message = 'Incorrect password';
                    throw error;
                }
                
                return user;
            } catch (error) {
                throw error;
            }
        },

        logout: async (email) => {
            return true;
        }
    };
};

module.exports = authService;
