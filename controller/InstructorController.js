const instructorController = ({instructorService}) => {
    return {
        getAll: async (req, res) => {
            try {
                const instructors = await instructorService.getAll();
                return res.status(200).json(
                    {
                        status: 200,
                        meta: {
                            total: instructors.length
                        },
                        data: instructors
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
                const instructor = await instructorService.findOneById(id);

                if (!instructor) {
                    return res.status(200).json(
                        {
                            status: 404,
                            message: `Instructor with id of ${id} not found.`
                        }
                    );
                }

                return res.status(200).json(
                    {
                        status: 200,
                        data: instructor
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

        findOneByEmail: async (req, res) => {
            const email = req.params.email;
            try {
                const instructor = await instructorService.findOneByEmail(email);

                if (!instructor) {
                    return res.status(200).json(
                        {
                            status: 404,
                            message: `Instructor with email of ${email} not found.`
                        }
                    );
                }

                return res.status(200).json(
                    {
                        status: 200,
                        data: instructor
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
                const instructors = await instructorService.searchByKeyword(keyword);

                if (!instructors) {
                    return res.status(200).json(
                        {
                            status: 404,
                            message: `No instructor found`
                        }
                    );
                }

                return res.status(200).json(
                    {
                        status: 200,
                        meta: {
                            total: instructors.length
                        },
                        data: instructors
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
            const newInstructor = req.body;
            newInstructor.role = 'INSTRUCTOR';

            try {
                const createdInstructor = await instructorService.create(newInstructor);
                delete createdInstructor.password;
                const createdInstructorUrl = `/api/users/${createdInstructor.id}`;
                res.location(createdInstructorUrl);
                return res.status(200).json({
                    status: 201,
                    data: createdInstructor,
                    links: {
                        instructor: createdInstructorUrl
                    }
                    
                });
            } catch (error) {
                if (error.fields && error.fields.length > 0) {
                    return res.status(200).json({
                        status: 400,
                        errors: error.fields
                    });
                }
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

        update: async (req, res) => {
            const id = req.params.id;
            const instructor = req.body;
            instructor.role = 'INSTRUCTOR';

            try {
                const updatedInstructor = await instructorService.updateById(id, instructor);
                if (updatedInstructor) {
                    const updatedInstructorUrl = `/api/users/${updatedInstructor.id}`;
                    res.location(updatedInstructorUrl);
                    return res.status(200).json({
                        status: 200,
                        data: updatedInstructor,
                        links: {
                            instructor: updatedInstructorUrl
                        }
                    });
                }

                return res.status(200).json({
                    status: 404,
                    message: 'No instructor found.'
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

        delete: async (req, res) => {
            const id = req.params.id;
            try {
                const deleted = await instructorService.deleteById(id);
                if (deleted) {
                    return res.status(200).json({
                        status: 204,
                    });
                }
                
                return res.status(200).json({
                    status: 404,
                    message: 'No instructor found.'
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

module.exports = instructorController;
