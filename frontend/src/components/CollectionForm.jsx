import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api-client';

export function CollectionForm({ onSubmit, endpoint, initialData = {}, submitButtonText = "Create" }) {
    const [formData, setFormData] = useState({});
    const [schema, setSchema] = useState(null);
    const memoizedInitialData = useMemo(() => initialData, [/* dependencies that affect initialData */]);

    useEffect(() => {
        async function fetchSchema() {
            try {
                const schemaData = await apiClient.get(`${endpoint}/schema`);
                setSchema(schemaData);
                setFormData(
                    Object.keys(schemaData).reduce((acc, key) => {
                        acc[key] = memoizedInitialData[key] || '';
                        return acc;
                    }, {})
                );
            } catch (error) {
                console.error('Error fetching schema:', error);
            }
        }
        fetchSchema();
    }, [endpoint, memoizedInitialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    if (!schema) {
        return <div>Loading...</div>;
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {Object.entries(schema).map(([key, value]) => {
                if (value.type === 'SchemaObjectId' && value.ref) {
                    // Reference field, render select input using the data provided in the schema
                    const options = value.data || [];
                    return (
                        <div key={key}>
                            <label htmlFor={key} className="block text-sm font-medium text-gray-700">
                                {key.charAt(0).toUpperCase() + key.slice(1)}
                            </label>
                            <select
                                name={key}
                                value={formData[key]}
                                onChange={handleChange}
                                className="border rounded p-2 w-full"
                                required={value.required}
                            >
                                <option value="">Select {value.ref}</option>
                                {options.map((option) => (
                                    <option key={option._id} value={option._id}>
                                        {option.name || option.username || option.email || option._id}
                                    </option>
                                ))}
                            </select>
                        </div>
                    );
                } else if (value.type === 'String' || value.type === 'Mixed') {
                    // String or Mixed field, render text input
                    return (
                        <div key={key}>
                            <label htmlFor={key} className="block text-sm font-medium text-gray-700">
                                {key.charAt(0).toUpperCase() + key.slice(1)}
                            </label>
                            <input
                                name={key}
                                value={formData[key]}
                                onChange={handleChange}
                                placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                                required={value.required}
                                className="border rounded p-2 w-full"
                            />
                        </div>
                    );
                } else {
                    return null; // Skip fields with unsupported types
                }
            })}
            <Button type="submit">{submitButtonText}</Button>
        </form>
    );
}
