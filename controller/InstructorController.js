const instructorController = ({instructorService}) => {
    return {
        getAll: async (req, res) => {
            try {
                const instructors = await instructorService.getAll();
                return res.status(200).json(
                    {
                        meta: {
                            total: instructors.length
                        },
                        data: instructors
                    }
                );
            } catch (error) {
                return res.status(500).json(
                    {
                        message: error.message
                    }
                );
            }
        }
    }
}

module.exports = instructorController;