
const studentService = ({studentRepository, userService}) => {
    return {
        getAll: async () => {
            try {
                const users = await studentRepository.getAll();
                return users;
            } catch (error) {
                throw error;
            }
        },

        findOneById: async (id) => {
            try {
                const user = await studentRepository.findOneById(id);
                return user;
            } catch (error) {
                throw error;
            }
        },

        findOneByEmail: async (email) => {
            try {
                const user = await studentRepository.findOneByEmail(email);
                return user;
            } catch (error) {
                throw error;
            }
        },

        getUniqueFields: async (student) => {
            try {
                const fields = await studentRepository.getUniqueFields(student);
                return fields;
            } catch (error) {
                throw error;
            }
        },

        create: async (data) => {
            const user = {
                email: data.email,
                password: data.password,
                role: data.role
            };

            const student = {
                name: data.name,
                nrc: data.nrc,
                phone: data.phone,
                gender: data.gender,
                date_of_birth: data.date_of_birth,
                address: data.address
            };
            try {
                const userUniqueFields = await userService.getUniqueFields(user);
                const studentUniqueFields = await studentRepository.getUniqueFields(student);
                let uniqueFields = [...userUniqueFields, ...studentUniqueFields];
                if (uniqueFields.length > 0) {
                    const error = new Error();
                    error.fields = [];
                    uniqueFields.forEach(element => {
                        error.fields.push({
                            field: element,
                            message: "Unique field"
                        })
                    });
                    throw error;
                }
                const createdStudent = await studentRepository.create(student);
                user.id = createdStudent.id;
                const createdUser = await userService.create(user);
                return {...createdStudent, ...createdUser};
            } catch (error) {
                throw error;
            }
        },

        updateById: async (id, student) => {
            try {
                const intId = parseInt(id);
                const updatedStudent = await studentRepository.updateById(intId, student);
                return updatedStudent;
            } catch (error) {
                throw error;
            }
        },

        deleteById: async (id) => {
            try {
                const intId = parseInt(id);
                const deleted = await studentRepository.deleteById(intId);
                return deleted;
            } catch (error) {
                throw error;
            }
        }
    }
}

module.exports = studentService;