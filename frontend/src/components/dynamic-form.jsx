import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { apiClient } from '@/lib/api-client';

export function DynamicForm({ schema, onSubmit }) {
    const [enhancedSchema, setEnhancedSchema] = useState(null);
    const form = useForm({
        defaultValues: {},
    });

    useEffect(() => {
        const enhanceSchema = async () => {
            if (!schema?.schema) return;

            const updatedSchema = { ...schema.schema };
            const refKeys = Object.keys(schema.schema).filter(key => schema.schema[key].ref);

            await Promise.all(
                refKeys.map(async key => {
                    try {
                        const refResponse = await apiClient.get(schema.schema[key].ref);
                        const referenceData = refResponse.data || refResponse;

                        if (Array.isArray(referenceData)) {
                            updatedSchema[key] = {
                                ...updatedSchema[key],
                                [schema.schema[key].ref]: referenceData
                            };
                        }
                    } catch (error) {
                        console.error(`Error fetching schema for ${schema.schema[key].ref}:`, error);
                    }
                })
            );

            setEnhancedSchema({
                schema: updatedSchema,
                modelName: schema.modelName
            });
        };

        enhanceSchema();
    }, [schema]);

    const handleFormSubmit = async (data) => {
        await onSubmit(data);
        form.reset();
    };

    if (!enhancedSchema) return null;

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
                {Object.entries(enhancedSchema.schema).map(([fieldName, fieldProps]) => {
                    // Skip system fields like _id, __v, createdAt, updatedAt
                    if (["_id", "__v", "createdAt", "updatedAt"].includes(fieldName)) {
                        return null;
                    }

                    // Handle reference fields
                    if (fieldProps.ref && fieldProps[fieldProps.ref]) {
                        return (
                            <FormField
                                key={fieldName}
                                control={form.control}
                                name={fieldName}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {fieldName}
                                            {fieldProps.required && <span className="text-red-500">*</span>}
                                        </FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder={`Select ${fieldProps.ref}`} />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {fieldProps[fieldProps.ref].map((refItem) => (
                                                    <SelectItem
                                                        key={refItem._id}
                                                        value={refItem._id}
                                                    >
                                                        {refItem.name || refItem._id}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />
                        );
                    }

                    // Handle regular input fields
                    return (
                        <FormField
                            key={fieldName}
                            control={form.control}
                            name={fieldName}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        {fieldName}
                                        {fieldProps.required && <span className="text-red-500">*</span>}
                                    </FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    );
                })}
                <Button type="submit">Submit</Button>
            </form>
        </Form>
    );
} 