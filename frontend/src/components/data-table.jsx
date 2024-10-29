import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useApi } from '@/hooks/use-api'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState, useEffect } from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import ky from 'ky'

export function DataTable({ title, endpoint }) {
    const [isOpen, setIsOpen] = useState(false)
    const [selectedItem, setSelectedItem] = useState(null)
    const [isUpdateMode, setIsUpdateMode] = useState(false)
    const [referencedData, setReferencedData] = useState({})

    // Get schema and data
    const { data: schemaData } = useApi(`${endpoint}/schema`)
    const { data, create, update, remove, fetch } = useApi(endpoint)

    // Fetch referenced data
    useEffect(() => {
        const fetchReferencedData = async () => {
            if (!schemaData?.schema) return;

            const refs = Object.entries(schemaData.schema)
                .filter(([_, value]) => value.ref)
                .map(([field, value]) => ({
                    field,
                    endpoint: value.ref.toLowerCase()
                }));

            const newRefData = {};
            for (const ref of refs) {
                try {
                    const response = await ky.get(`https://cananvalley.systems/api/${ref.endpoint}`, {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    }).json();
                    newRefData[ref.field] = response;
                    console.log(`Fetched ${ref.field} data:`, response);
                } catch (error) {
                    console.error(`Error fetching ${ref.endpoint} data:`, error);
                    newRefData[ref.field] = [];
                }
            }
            setReferencedData(newRefData);
        };

        fetchReferencedData();
    }, [schemaData]);

    const handleSubmit = async (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        const data = Object.fromEntries(formData)

        try {
            if (isUpdateMode && selectedItem) {
                await update(selectedItem._id, data)
            } else {
                await create(data)
            }
            await fetch()
            setIsOpen(false)
            setSelectedItem(null)
            setIsUpdateMode(false)
        } catch (error) {
            console.error('Operation error:', error)
        }
    }

    const handleDelete = async (item) => {
        try {
            await remove(item._id)
            await fetch()
        } catch (error) {
            console.error('Delete error:', error)
        }
    }

    const renderField = (field, schema) => {
        // Skip system fields
        if (['_id', '__v', 'createdAt', 'updatedAt'].includes(field)) return null

        // Skip password on update
        if (field === 'password' && isUpdateMode) return null

        // Reference field
        if (schema.ref) {
            const options = referencedData[field] || []
            console.log(`Rendering ${field} with options:`, options);
            return (
                <div key={field} className="space-y-2">
                    <Label htmlFor={field}>{field}</Label>
                    <Select
                        name={field}
                        defaultValue={selectedItem?.[field]?._id || selectedItem?.[field]}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder={`Select ${field}`} />
                        </SelectTrigger>
                        <SelectContent>
                            {options.map(option => (
                                <SelectItem
                                    key={option._id}
                                    value={option._id}
                                >
                                    {option.name || option.username || option._id}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            )
        }

        // Regular field
        return (
            <div key={field} className="space-y-2">
                <Label htmlFor={field}>{field}</Label>
                <Input
                    id={field}
                    name={field}
                    type={field === 'password' ? 'password' : 'text'}
                    defaultValue={selectedItem?.[field] || ''}
                />
            </div>
        )
    }

    if (!schemaData || !data) return <div>Loading...</div>

    return (
        <div className="h-full w-full overflow-hidden p-4 gap-3 flex flex-col">
            <div className="flex justify-between items-center">
                <Input placeholder="Search" className="w-96" />
                <Sheet
                    open={isOpen}
                    onOpenChange={(open) => {
                        setIsOpen(open)
                        if (!open) {
                            setSelectedItem(null)
                            setIsUpdateMode(false)
                        }
                    }}
                >
                    <SheetTrigger asChild>
                        <Button size="sm">Add {title}</Button>
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle>
                                {isUpdateMode ? `Update ${title}` : `Add ${title}`}
                            </SheetTitle>
                        </SheetHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 py-4">
                            {Object.entries(schemaData.schema).map(([field, schema]) =>
                                renderField(field, schema)
                            )}
                            <SheetFooter>
                                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit">
                                    {isUpdateMode ? 'Update' : 'Save'}
                                </Button>
                            </SheetFooter>
                        </form>
                    </SheetContent>
                </Sheet>
            </div>
            <Card className="flex-1 overflow-auto">
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {data.map((item) => (
                        <Card key={item._id} className="cursor-pointer hover:bg-gray-50">
                            <DropdownMenu>
                                <DropdownMenuTrigger className="w-full text-left p-4">
                                    <pre>{JSON.stringify(item, null, 2)}</pre>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem onClick={() => {
                                        setSelectedItem(item)
                                        setIsUpdateMode(true)
                                        setIsOpen(true)
                                    }}>
                                        Update
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        className="text-red-600"
                                        onClick={() => handleDelete(item)}
                                    >
                                        Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </Card>
                    ))}
                </CardContent>
            </Card>
        </div>
    )
}
