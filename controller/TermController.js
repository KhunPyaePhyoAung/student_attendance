const termController = ({termService}) => {
    return {
        getAll: async (req, res) => {
            try {
                const terms = await termService.getAll();
                return res.status(200).json(
                    {
                        status: 200,
                        meta: {
                            total: terms.length
                        },
                        data: terms
                    }
                );
            } catch (error) {
                return res.status(200).json(
                    {
                        status: 500,
                        message: error.message
                    }
                );
            }
        },

        getAllForStudent: async (req, res) => {
            const studentId = req.user.id;
            try {
                const terms = await termService.getAllForStudent(studentId);
                return res.status(200).json(
                    {
                        status: 200,
                        meta: {
                            total: terms.length
                        },
                        data: terms
                    }
                );
            } catch (error) {
                return res.status(200).json(
                    {
                        status: 500,
                        message: error.message
                    }
                );
            }
        },

        getActiveTermsForInstructor: async (req, res) => {
            const instructorId = req.user.id;
            try {
                const terms = await termService.getActiveTermsForInstructor(instructorId);
                return res.status(200).json(
                    {
                        status: 200,
                        meta: {
                            total: terms.length
                        },
                        data: terms
                    }
                );
            } catch (error) {
                return res.status(200).json(
                    {
                        status: 500,
                        message: error.message
                    }
                );
            }
        },

        findOneById: async (req, res) => {
            const id = req.params.id;
            try {
                const term = await termService.findOneById(id);

                if (!term) {
                    return res.status(200).json(
                        {
                            status: 404,
                            message: `Term with id of ${id} not found.`
                        }
                    );
                }

                return res.status(200).json(
                    {
                        status: 200,
                        data: term
                    }
                );
            } catch (error) {
                return res.status(200).json(
                    {
                        status: 500,
                        message: error.message
                    }
                );
            }
        },

        searchByKeyword: async (req, res) => {
            const keyword = req.query.keyword;
            try {
                const terms = await termService.searchByKeyword(keyword);

                if (!terms) {
                    return res.status(200).json(
                        {
                            status: 404,
                            message: `No term found`
                        }
                    );
                }

                return res.status(200).json(
                    {
                        status: 200,
                        meta: {
                            total: terms.length
                        },
                        data: terms
                    }
                );
            } catch (error) {
                return res.status(200).json(
                    {
                        status: 500,
                        message: error.message
                    }
                );
            }
        },

        create: async (req, res) => {
            const newTerm = req.body;

            try {
                const createdTerm = await termService.create(newTerm);
                const createdTermUrl = `/api/terms/${createdTerm.id}`;
                res.location(createdTermUrl);
                return res.status(200).json({
                    status: 201,
                    data: createdTerm,
                    links: {
                        term: createdTermUrl
                    }
                    
                });
            } catch (error) {
                if (error.fields && error.fields.length > 0) {
                    return res.status(200).json({
                        status: 400,
                        errors: error.fields
                    });
                }
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
            const term = req.body;

            try {
                const updatedTerm = await termService.updateById(id, term);
                if (updatedTerm) {
                    const updatedTermUrl = `/api/terms/${updatedTerm.id}`;
                    res.location(updatedTermUrl);
                    return res.status(200).json({
                        status: 200,
                        data: updatedTerm,
                        links: {
                            student: updatedTermUrl
                        }
                    });
                }

                return res.status(200).json({
                    status: 404,
                    message: 'No term found.'
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
                const deleted = await termService.deleteById(id);
                if (deleted) {
                    return res.status(200).json({
                        status: 204,
                    });
                }
                
                return res.status(200).json({
                    status: 404,
                    message: 'No term found.'
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

module.exports = termController;