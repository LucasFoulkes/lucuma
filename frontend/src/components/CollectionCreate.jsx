import { useState } from 'react';
import { CollectionForm } from '@/components/CollectionForm';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
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

export function CollectionCreate({ endpoint, mutate }) {
    const [open, setOpen] = useState(false);
    const [error, setError] = useState(null);

    const handleCreate = async (formData) => {
        try {
            setError(null);
            await apiClient.post(endpoint, formData);
            mutate();
            setOpen(false);
        } catch (error) {
            console.error('Error creating item:', error);

            // Extract error details from the API response
            let errorMessage = "Failed to create item. Please try again.";

            // Access the error details from the api-client's error logging
            const errorDetails = error.response?._data;
            if (errorDetails) {
                if (errorDetails.errors) {
                    // Format validation errors
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
            if (!newOpen) setError(null); // Clear error when dialog closes
        }}>
            <DialogTrigger asChild>
                <Button variant="default" size="icon" className="rounded-full bg-black hover:bg-black/90">
                    <Plus className="h-5 w-5" />
                </Button>
            </DialogTrigger>
            <DialogContent
                className="overflow-y-auto p-6 max-h-[80vh] mx-auto max-w-lg"
            >
                <DialogTitle>Create New Item</DialogTitle>
                <DialogDescription>
                    Fill in the details to create a new item.
                </DialogDescription>

                {error && (
                    <Alert variant="destructive" className="mt-4">
                        <AlertDescription className="whitespace-pre-line">
                            {error}
                        </AlertDescription>
                    </Alert>
                )}

                <CollectionForm onSubmit={handleCreate} endpoint={endpoint} />

                <DialogFooter className="mt-4">
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
