const studentController = ({studentService}) => {
    return {
        getAll: async (req, res) => {
            try {
                const students = await studentService.getAll();
                return res.status(200).json(
                    {
                        meta: {
                            total: students.length
                        },
                        data: students
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
                const student = await studentService.findOneById(id);

                if (!student) {
                    return res.status(404).json(
                        {
                            message: `Student with id of ${id} not found.`
                        }
                    );
                }

                return res.status(200).json(
                    {
                        data: student
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
                const student = await studentService.findOneByEmail(email);

                if (!student) {
                    return res.status(404).json(
                        {
                            message: `Student with email of ${email} not found.`
                        }
                    );
                }

                return res.status(200).json(
                    {
                        data: student
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
            const newStudent = req.body;

            try {
                const createdStudent = await studentService.create(newStudent);
                delete createdStudent.password;
                const createdStudentUrl = `/api/users/${createdStudent.id}`;
                res.location(createdStudentUrl);
                return res.status(200).json({
                    status: 201,
                    data: createdStudent,
                    links: {
                        student: createdStudentUrl
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
            const student = req.body;

            try {
                const updatedStudent = await studentService.updateById(id, student);
                if (updatedStudent) {
                    const updatedStudentUrl = `/api/users/${updatedStudent.id}`;
                    res.location(updatedStudentUrl);
                    return res.status(200).json({
                        status: 200,
                        data: updatedStudent,
                        links: {
                            student: updatedStudentUrl
                        }
                    });
                }

                return res.status(200).json({
                    status: 404,
                    message: 'No student found.'
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
                const deleted = await studentService.deleteById(id);
                if (deleted) {
                    return res.status(200).json({
                        status: 204,
                    });
                }
                
                return res.status(200).json({
                    status: 404,
                    message: 'No student found.'
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

module.exports = studentController;