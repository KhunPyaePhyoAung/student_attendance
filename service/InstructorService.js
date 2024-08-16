
const instructorService = ({instructorRepository}) => {
    return {
        getAll: async () => {
            try {
                const instructors = await instructorRepository.getAll();
                return instructors;
            } catch (error) {
                throw error;
            }
        }
    }
}

module.exports = instructorService;