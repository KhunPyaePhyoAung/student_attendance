const subjectController = ({ subjectService }) => {
    return {
        getAll: async (req, res) => {
            try {
                const subjects = await subjectService.getAll();
                return res.status(200).json(
                    {
                        status: 200,
                        meta: {
                            total: subjects.length
                        },
                        data: subjects
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
                const subject = await subjectService.findOneById(id);

                if (!subject) {
                    return res.status(200).json(
                        {
                            status: 404,
                            message: `Subject with id of ${id} not found.`
                        }
                    );
                }

                return res.status(200).json(
                    {
                        status: 200,
                        data: subject
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

        findOneByCode: async (req, res) => {
            const code = req.params.code;
            try {
                const subject = await subjectService.findOneByCode(code);

                if (!subject) {
                    return res.status(404).json(
                        {
                            message: `Subject with code of ${code} not found.`
                        }
                    );
                }

                return res.status(200).json(
                    {
                        status: 200,
                        data: subject
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
            const newSubject = req.body;

            try {
                const createdSubject = await subjectService.create(newSubject);
                const createdSubjectUrl = `/api/subjects/${createdSubject.id}`;
                res.location(createdSubjectUrl);
                return res.status(200).json({
                    status: 201,
                    data: createdSubject,
                    links: {
                        subject: createdSubjectUrl
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
            const subject = req.body;

            try {
                const updatedSubject = await subjectService.updateById(id, subject);
                if (updatedSubject) {
                    const updatedSubjectUrl = `/api/subjects/${updatedSubject.id}`;
                    res.location(updatedSubjectUrl);
                    return res.status(200).json({
                        status: 200,
                        data: updatedSubject,
                        links: {
                            subject: updatedSubjectUrl
                        }
                    });
                }

                return res.status(200).json({
                    status: 404,
                    message: 'No subject found.'
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
                const deleted = await subjectService.deleteById(id);
                if (deleted) {
                    return res.status(200).json({
                        status: 204,
                    });
                }
                
                return res.status(200).json({
                    status: 404,
                    message: 'No Subject found.'
                });
            } catch (error) {
                return res.status(200).json(
                    {
                        status: 500
                    }
                );
            }
        },
    }
}

module.exports = subjectController;
