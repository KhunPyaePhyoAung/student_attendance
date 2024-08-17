const instructorService = ({ instructorRepository, userService }) => {
    return {
        getAll: async () => {
            try {
                const instructors = await instructorRepository.getAll();
                return instructors;
            } catch (error) {
                throw error;
            }
        },

        findOneById: async (id) => {
            try {
                const instructor = await instructorRepository.findOneById(id);
                return instructor;
            } catch (error) {
                throw error;
            }
        },

        findOneByEmail: async (email) => {
            try {
                const instructor = await instructorRepository.findOneByEmail(email);
                return instructor;
            } catch (error) {
                throw error;
            }
        },

        searchByKeyword: async (keyword) => {
            try {
                const instructor = await instructorRepository.searchByKeyword(keyword);
                return instructor;
            } catch (error) {
                throw error;
            }
        },

        getUniqueFields: async (instructor) => {
            try {
                const fields = await instructorRepository.getUniqueFields(instructor);
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

            const instructor = {
                name: data.name,
                nrc: data.nrc,
                phone: data.phone,
                gender: data.gender,
                date_of_birth: data.date_of_birth,
                address: data.address
            };

            try {
                const userUniqueFields = await userService.getUniqueFields(user);
                const instructorUniqueFields = await instructorRepository.getUniqueFields(instructor);
                let uniqueFields = [...userUniqueFields, ...instructorUniqueFields];
                if (uniqueFields.length > 0) {
                    const error = new Error();
                    error.fields = [];
                    uniqueFields.forEach(element => {
                        error.fields.push({
                            field: element,
                            message: "Unique field"
                        });
                    });
                    throw error;
                }
                const createdUser = await userService.create(user);
                instructor.id = createdUser.id;
                const createdInstructor = await instructorRepository.create(instructor);
                
                return { ...createdInstructor, ...createdUser };
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

            const instructor = {
                id: id,
                name: data.name,
                nrc: data.nrc,
                phone: data.phone,
                gender: data.gender,
                date_of_birth: data.date_of_birth,
                address: data.address
            };

            try {
                const userUniqueFields = await userService.getUniqueFields(user);
                const instructorUniqueFields = await instructorRepository.getUniqueFields(instructor);
                let uniqueFields = [...userUniqueFields, ...instructorUniqueFields];
                if (uniqueFields.length > 0) {
                    const error = new Error();
                    error.fields = [];
                    uniqueFields.forEach(element => {
                        error.fields.push({
                            field: element,
                            message: "Unique field"
                        });
                    });
                    throw error;
                }
                const intId = parseInt(id);
                const updatedUser = await userService.updateById(intId, user);
                const updatedInstructor = await instructorRepository.updateById(intId, instructor);
                return { ...updatedUser, ...updatedInstructor };
            } catch (error) {
                throw error;
            }
        },

        deleteById: async (id) => {
            try {
                const intId = parseInt(id);
                const deleted = await instructorRepository.deleteById(intId);
                if (deleted) {
                    await userService.deleteById(intId);
                }
                return deleted;
            } catch (error) {
                throw error;
            }
        }
    };
};

module.exports = instructorService;
