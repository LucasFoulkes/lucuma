const getEnhancedSchema = async (Model, referenceMap = {}) => {
    try {
        const schemaDefinition = Model.schema.obj;
        const enhancedSchema = {
            _id: { type: 'ObjectId', auto: true },
            ...schemaDefinition
        };

        // Only fetch references if they exist
        for (const [field, config] of Object.entries(referenceMap)) {
            if (schemaDefinition[field]) {
                const refData = await config.model.find()
                    .select('-__v')
                    .lean();

                enhancedSchema[field] = {
                    ...schemaDefinition[field],
                    data: refData
                };
            }
        }

        return {
            schema: enhancedSchema,
            modelName: Model.modelName
        };
    } catch (error) {
        console.error('Error enhancing schema:', error);
        throw error;
    }
};

const handleSchemaRequest = (Model, referenceMap = {}) => {
    return async (req, res) => {
        try {
            const enhancedSchema = await getEnhancedSchema(Model, referenceMap);
            res.json(enhancedSchema);
        } catch (error) {
            console.error('Schema request error:', error);
            res.status(500).json({
                error: 'Failed to fetch schema data'
            });
        }
    };
};

module.exports = {
    getEnhancedSchema,
    handleSchemaRequest
}; 