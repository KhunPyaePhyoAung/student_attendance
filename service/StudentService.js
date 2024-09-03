
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

        findAllForAttendance: async (attendanceId) => {
            try {
                const students = await studentRepository.findAllForAttendance(attendanceId);
                return students;
            } catch (error) {
                throw error;
            }
        },

        findAllByTermId: async (termId) => {
            try {
                const students = await studentRepository.findAllByTermId(termId);
                return students;
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
                const student = await studentRepository.findOneByEmail(email);
                return student;
            } catch (error) {
                throw error;
            }
        },

        searchByKeyword: async (keyword) => {
            try {
                const student = await studentRepository.searchByKeyword(keyword);
                return student;
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
                role_no: data.role_no,
                year: data.year,
                nrc: data.nrc,
                phone: data.phone,
                family_phone: data.family_phone,
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
                            message: `This ${element} already exists`
                        })
                    });
                    throw error;
                }
                const createdUser = await userService.create(user);
                student.id = createdUser.id;
                const createdStudent = await studentRepository.create(student);
                
                return {...createdStudent, ...createdUser};
            } catch (error) {
                throw error;
            }
        },

        updateById: async (id, data) => {
            const user = {
                id: id,
                email: data.email,
                status: data.status,
                role: data.role
            };

            const student = {
                id: id,
                name: data.name,
                role_no: data.role_no,
                year: data.year,
                nrc: data.nrc,
                phone: data.phone,
                family_phone: data.family_phone,
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
                            message: `This ${element} already exists`
                        })
                    });
                    throw error;
                }
                const intId = parseInt(id);
                const updatedUser = await userService.updateById(intId, user);
                const updatedStudent = await studentRepository.updateById(intId, student);
                return {...updatedUser, ...updatedStudent};
            } catch (error) {
                throw error;
            }
        },

        deleteById: async (id) => {
            try {
                const intId = parseInt(id);
                const deleted = await studentRepository.deleteById(intId);
                if (deleted) {
                    await userService.deleteById(intId);
                }
                return deleted;
            } catch (error) {
                throw error;
            }
        }
    }
}

module.exports = studentService;