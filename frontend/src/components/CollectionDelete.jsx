import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api-client';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog"
import { Trash2 } from "lucide-react";

export function CollectionDelete({ row, endpoint, mutate }) {
    const handleDelete = async () => {
        try {
            console.log('Deleting row:', row);
            const itemId = row._id;
            if (!itemId) {
                throw new Error('Item ID is undefined');
            }
            await apiClient.delete(`${endpoint}/${itemId}`);
            await mutate();
        } catch (error) {
            console.error('Delete error:', error);
        }
    };

    return (
        <Dialog>
            <DialogTrigger>
                <Trash2 className="h-4 w-4 hover:text-gray-600 cursor-pointer" />
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will permanently delete your account
                        and remove your data from our servers.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="destructive" onClick={handleDelete}>
                        Delete
                    </Button>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Close
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

