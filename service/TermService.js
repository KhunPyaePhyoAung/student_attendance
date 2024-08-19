
const termService = ({termRepository}) => {
    return {
        getAll: async () => {
            try {
                const terms = await termRepository.getAll();
                return terms;
            } catch (error) {
                throw error;
            }
        },

        findOneById: async (id) => {
            try {
                const term = await termRepository.findOneById(id);
                return term;
            } catch (error) {
                throw error;
            }
        },

        searchByKeyword: async (keyword) => {
            try {
                const term = await termRepository.searchByKeyword(keyword);
                return term;
            } catch (error) {
                throw error;
            }
        },

        getUniqueFields: async (term) => {
            try {
                const fields = await termRepository.getUniqueFields(term);
                return fields;
            } catch (error) {
                throw error;
            }
        },

        create: async (data) => {
            const term = {
                name: data.name,
                start_date: data.start_date,
                end_date: data.end_date,
                students: data.students,
                subjects: data.subjects
            };

            try {
                const termUniqueFields = await termRepository.getUniqueFields(term);
                let uniqueFields = [...termUniqueFields];
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
                const createdTerm = await termRepository.create(term);
                
                return {...createdTerm};
            } catch (error) {
                throw error;
            }
        },

        updateById: async (id, data) => {

            const term = {
                id: id,
                name: data.name,
                start_date: data.start_date,
                end_date: data.end_date,
                students: data.students,
                subjects: data.subjects
            };

            try {
                const termUniqueFields = await termRepository.getUniqueFields(term);
                let uniqueFields = [...termUniqueFields];
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
                const intId = parseInt(id);
                const updatedTerm = await termRepository.updateById(intId, term);
                return {...updatedTerm};
            } catch (error) {
                throw error;
            }
        },

        deleteById: async (id) => {
            try {
                const intId = parseInt(id);
                const deleted = await termRepository.deleteById(intId);
                return deleted;
            } catch (error) {
                throw error;
            }
        }
    }
}

module.exports = termService;