const userController = ({userService}) => {
    return {
        getAll: async (req, res) => {
            try {
                const users = await userService.getAll();
                return res.status(200).json(
                    {
                        meta: {
                            total: users.length
                        },
                        data: users
                    }
                );
            } catch (error) {
                return res.status(500).json(
                    {
                        message: error.message
                    }
                );
            }
        },

        findOneById: async (req, res) => {
            const id = req.params.id;
            try {
                const user = await userService.findOneById(id);

                if (!user) {
                    return res.status(404).json(
                        {
                            message: `User with id of ${id} not found.`
                        }
                    );
                }

                return res.status(200).json(
                    {
                        data: user
                    }
                );
            } catch (error) {
                return res.status(500).json(
                    {
                        message: error.message
                    }
                );
            }
        },

        findOneByEmail: async (req, res) => {
            const email = req.params.email;
            try {
                const user = await userService.findOneByEmail(email);

                if (!user) {
                    return res.status(404).json(
                        {
                            message: `User with email of ${email} not found.`
                        }
                    );
                }

                return res.status(200).json(
                    {
                        data: user
                    }
                );
            } catch (error) {
                return res.status(500).json(
                    {
                        message: error.message
                    }
                );
            }
        },
    }
}

module.exports = userController;