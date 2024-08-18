
const subjectService = ({subjectRepository}) => {
    return {
        getAll: async () => {
            try {
                return await subjectRepository.getAll();
            } catch (error) {
                throw error;
            }
        },

        findOneById: async (id) => {
            try {
                id = parseInt(id); // Keeping your original logic intact
                return await subjectRepository.findOneById(id);
            } catch (error) {
                throw error;
            }
        },

        create: async (subject) => {
            try {
                return await subjectRepository.create(subject);
            } catch (error) {
                throw error;
            }
        },

        updateById: async (id, subject) => {
            try {
                id = parseInt(id); // Keeping your original logic intact
                return await subjectRepository.updateById(id, subject);
            } catch (error) {
                throw error;
            }
        },

        deleteById: async (id) => {
            try {
                id = parseInt(id); // Keeping your original logic intact
                return await subjectRepository.deleteById(id);
            } catch (error) {
                throw error;
            }
        }
    };
}

module.exports = subjectService;
