import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useApi } from '@/hooks/use-api'
import { useState } from 'react'
import { Button } from '@/components/ui/button';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { DynamicForm } from '@/components/dynamic-form';
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from '@/components/ui/table';

export function DataTable({ endpoint }) {
    const { data: schemaData, isLoading: isSchemaLoading } = useApi(`${endpoint}/schema`)
    const { data, isLoading, error, create, update, remove, refetch } = useApi(endpoint)
    const [isSheetOpen, setIsSheetOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [editingItem, setEditingItem] = useState(null)

    if (isLoading || isSchemaLoading) {
        return <div className="flex items-center justify-center h-full">Loading...</div>
    }

    if (error) {
        return <div className="text-red-500">Error: {error.message}</div>
    }

    const filteredData = data?.filter(item =>
        Object.values(item).some(value =>
            String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
    )

    const handleEdit = (item) => {
        setEditingItem(item)
        setIsSheetOpen(true)
    }

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            await remove(id)
        }
    }

    const formatCellValue = (value) => {
        if (value === null || value === undefined) {
            return '';
        }

        // Handle arrays
        if (Array.isArray(value)) {
            return value.join(', ');
        }

        // Handle objects (including GeoJSON)
        if (typeof value === 'object') {
            // If it's a reference object with a name property, show the name
            if (value.name) {
                return value.name;
            }
            // For other objects, show a simplified representation
            return JSON.stringify(value);
        }

        // Return primitive values as strings
        return String(value);
    }

    return (
        <div className="h-full w-full overflow-hidden p-4 gap-3 flex flex-col">
            <div className="flex items-center justify-between space-x-4">
                <div className="relative w-96">
                    <Input
                        type="text"
                        placeholder="Search"
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                </div>
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <SheetTrigger asChild>
                        <Button size="sm" className="flex items-center space-x-2">
                            <Plus />
                            <span>Add</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle>
                                {editingItem ? `Edit ${schemaData?.modelName}` : `Add New ${schemaData?.modelName}`}
                            </SheetTitle>
                            <SheetDescription>
                                {editingItem
                                    ? `Edit this ${endpoint} entry.`
                                    : `Add a new entry to your ${endpoint} collection.`}
                            </SheetDescription>
                        </SheetHeader>
                        {schemaData && (
                            <DynamicForm
                                schema={schemaData}
                                initialData={editingItem}
                                onSubmit={async (formData) => {
                                    if (editingItem) {
                                        await update(editingItem._id, formData)
                                    } else {
                                        await create(formData)
                                    }
                                    setEditingItem(null)
                                    setIsSheetOpen(false)
                                    await refetch()
                                }}
                            />
                        )}
                    </SheetContent>
                </Sheet>
            </div>
            <Card className="flex-1 overflow-auto scrollbar-hide">
                <CardHeader>
                    <CardTitle>{endpoint}</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                {Object.keys(schemaData?.schema).map((key) => (
                                    <TableHead key={key}>{key}</TableHead>
                                ))}
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredData?.map((item) => (
                                <TableRow key={item._id}>
                                    {Object.keys(schemaData?.schema).map((key) => (
                                        <TableCell key={key}>
                                            {formatCellValue(item[key])}
                                        </TableCell>
                                    ))}
                                    <TableCell className="space-x-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleEdit(item)}
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDelete(item._id)}
                                        >
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
