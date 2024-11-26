import { useState } from 'react';
import { CollectionForm } from '@/components/CollectionForm';
import { Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { apiClient } from '@/lib/api-client';

export function CollectionEdit({ row, endpoint, mutate }) {
    const [open, setOpen] = useState(false);
    const [error, setError] = useState(null);

    const handleEdit = async (formData) => {
        try {
            setError(null);
            await apiClient.put(`${endpoint}/${row._id}`, formData);
            mutate();
            setOpen(false);
        } catch (error) {
            console.error('Error updating item:', error);

            let errorMessage = "Failed to update item. Please try again.";
            const errorDetails = error.response?._data;
            if (errorDetails) {
                if (errorDetails.errors) {
                    errorMessage = Object.entries(errorDetails.errors)
                        .map(([field, err]) => `${field}: ${err.message || err}`)
                        .join('\n');
                } else if (errorDetails.message) {
                    errorMessage = errorDetails.message;
                }
            }
            setError(errorMessage);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(newOpen) => {
            setOpen(newOpen);
            if (!newOpen) setError(null);
        }}>
            <DialogTrigger asChild>
                <Edit className="h-4 w-4 hover:text-gray-600 cursor-pointer" />
            </DialogTrigger>
            <DialogContent
                className="overflow-y-auto p-6 max-h-[80vh] mx-auto max-w-lg"
            >
                <DialogTitle>Edit Item</DialogTitle>
                <DialogDescription>
                    Modify the details of the item.
                </DialogDescription>

                {error && (
                    <Alert variant="destructive" className="mt-4">
                        <AlertDescription className="whitespace-pre-line">
                            {error}
                        </AlertDescription>
                    </Alert>
                )}

                <CollectionForm
                    onSubmit={handleEdit}
                    endpoint={endpoint}
                    initialData={row}
                />

                <DialogFooter className="mt-4">
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
