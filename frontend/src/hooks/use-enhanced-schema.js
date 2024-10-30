import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';

export function useEnhancedSchema(originalSchemaData) {
    const [enhancedSchema, setEnhancedSchema] = useState(null);

    useEffect(() => {
        const fetchReferences = async () => {
            if (!originalSchemaData?.schema) return;

            const schema = originalSchemaData.schema;
            const updatedSchema = { ...schema };

            const refKeys = Object.keys(schema).filter(key => schema[key].ref);

            await Promise.all(
                refKeys.map(async key => {
                    try {
                        const refResponse = await apiClient.get(schema[key].ref);
                        const referenceData = refResponse.data || refResponse;

                        if (Array.isArray(referenceData)) {
                            updatedSchema[key] = {
                                ...updatedSchema[key],
                                [schema[key].ref]: referenceData
                            };
                        }
                    } catch (error) {
                        console.error(`Error fetching schema for ${schema[key].ref}:`, error);
                    }
                })
            );

            setEnhancedSchema({
                schema: updatedSchema,
                modelName: originalSchemaData.modelName
            });
        };

        fetchReferences();
    }, [originalSchemaData]);

    return enhancedSchema;
} 