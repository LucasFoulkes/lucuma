const getEnhancedSchema = async (Model, referenceMap = {}) => {
    try {
        const schemaDefinition = Model.schema.obj;

        const enhancedSchema = {};

        for (const [field, config] of Object.entries(schemaDefinition)) {
            if (config.obj) {
                enhancedSchema[field] = simplifyNestedSchema(config.obj);
                continue;
            }

            enhancedSchema[field] = simplifyFieldConfig(config);
        }

        for (const [field, config] of Object.entries(referenceMap)) {
            if (schemaDefinition[field]) {
                const refData = await config.model.find()
                    .select('-__v')
                    .lean();

                enhancedSchema[field] = {
                    ...enhancedSchema[field],
                    data: refData
                };
            }
        }

        return enhancedSchema;
    } catch (error) {
        console.error('Error enhancing schema:', error);
        throw error;
    }
};

const simplifyFieldConfig = (config) => {
    const simplified = {};

    if (config.type) {
        simplified.type = getFieldType(config.type);
    }
    if (config.required) {
        simplified.required = true;
    }
    if (config.enum) {
        simplified.enum = config.enum;
    }
    if (config.ref) {
        simplified.ref = config.ref;
    }

    return simplified;
};

const simplifyNestedSchema = (schema) => {
    const simplified = {};

    for (const [field, config] of Object.entries(schema)) {
        simplified[field] = simplifyFieldConfig(config);
    }

    return {
        type: 'Object',
        required: false,
        fields: simplified
    };
};

const getFieldType = (type) => {
    if (type.name) {
        return type.name;
    }
    if (type === String) return 'String';
    if (type === Number) return 'Number';
    if (type === Boolean) return 'Boolean';
    if (type === Date) return 'Date';
    if (type === Array) return 'Array';
    return 'Mixed';
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