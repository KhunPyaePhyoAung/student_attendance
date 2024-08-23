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
                        status: 200,
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

        create: async (req, res) => {
            const newUser = req.body;

            try {
                const createdUser = await userService.create(newUser);
                delete createdUser.password;
                const createdUserUrl = `/api/users/${createdUser.id}`;
                res.location(createdUserUrl);
                return res.status(200).json({
                    status: 201,
                    data: createdUser,
                    links: {
                        user: createdUserUrl
                    }
                    
                });
            } catch (error) {
                // if (error instanceof ValidationError) {
                    return res.status(200).json({
                        status: 400,
                        errors: [
                            {
                                field: error.fieldName,
                                message: error.message
                            }
                        ]
                    });
                // }

                // return res.status(200).json(
                //     {
                //         status: 500
                //     }
                // );
            }
        },

        update: async (req, res) => {
            const id = req.params.id;
            const user = req.body;

            try {
                const updatedUser = await userService.updateById(id, user);
                if (updatedUser) {
                    const updatedUserUrl = `/api/users/${updatedUser.id}`;
                    res.location(updatedUserUrl);
                    return res.status(200).json({
                        status: 200,
                        data: updatedUser,
                        links: {
                            user: updatedUserUrl
                        }
                    });
                }

                return res.status(200).json({
                    status: 404,
                    message: 'No user found.'
                });
                
            } catch (error) {
                // if (error instanceof ValidationError) {
                    return res.status(200).json({
                        status: 400,
                        errors: [
                            {
                                field: error.fieldName,
                                message: error.message
                            }
                        ]
                    });
                // }

                // return res.status(200).json(
                //     {
                //         status: 500
                //     }
                // );
            }
        },

        changePassword: async (req, res) => {
            const id = req.user.id;
            const oldPassword = req.body.old_password;
            const newPassword = req.body.new_password;

            try {
                const updatedUser = await userService.updatePasswordById(id, oldPassword, newPassword);
                if (updatedUser) {
                    const updatedUserUrl = `/api/users/${updatedUser.id}`;
                    res.location(updatedUserUrl);
                    return res.status(200).json({
                        status: 200,
                        data: updatedUser,
                        links: {
                            user: updatedUserUrl
                        }
                    });
                }

                return res.status(200).json({
                    status: 404,
                    message: 'No user found.'
                });
                
            } catch (error) {
                // if (error instanceof ValidationError) {
                    return res.status(200).json({
                        status: 400,
                        errors: [
                            {
                                field: error.fieldName,
                                message: error.message
                            }
                        ]
                    });
                // }

                // return res.status(200).json(
                //     {
                //         status: 500
                //     }
                // );
            }
        },

        delete: async (req, res) => {
            const id = req.params.id;
            try {
                const deleted = await userService.deleteById(id);
                if (deleted) {
                    return res.status(200).json({
                        status: 204,
                    });
                }
                
                return res.status(200).json({
                    status: 404,
                    message: 'No User found.'
                });
            } catch (error) {
                return res.status(200).json({
                    status: 400,
                    errors: [
                        {
                            field: error.fieldName,
                            message: error.message
                        }
                    ]
                });
            }
        },
    }
}

module.exports = userController;