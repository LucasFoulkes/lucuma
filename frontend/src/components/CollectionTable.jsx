import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { CollectionDelete } from "@/components/CollectionDelete";
import { CollectionEdit } from '@/components/CollectionEdit';

const formatDateTime = (dateString) => {
    if (!dateString) return dateString;
    try {
        return new Date(dateString).toLocaleString('en-GB', {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    } catch {
        return dateString;
    }
};

export function CollectionTable({ data = [], endpoint, mutate }) {
    const formatCellValue = (key, value) => {
        if (key.toLowerCase() === 'password') {
            return '••••••••';
        }
        if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}T/)) {
            return formatDateTime(value);
        }
        if (typeof value === 'object' && value !== null && value._id) {
            return value.name || value.username || value.email || value._id;
        }
        return value;
    };

    if (data.length === 0) {
        return <p>No data available.</p>;
    }

    return (
        <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        {Object.keys(data[0]).map((key) => (
                            <TableHead key={key} className="whitespace-nowrap">{key}</TableHead>
                        ))}
                        <TableHead className="sticky right-0 text-right bg-gradient-to-r from-transparent from-0% to-white to-20% whitespace-nowrap">
                            Actions
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((row, rowIndex) => (
                        <TableRow key={rowIndex}>
                            {Object.keys(row).map((key) => {
                                const value = formatCellValue(key, row[key]);
                                return <TableCell key={key} className="whitespace-nowrap">{value}</TableCell>;
                            })}
                            <TableCell className="sticky right-0 text-right bg-gradient-to-r from-transparent from-0% to-white to-20%">
                                <div className="flex justify-end gap-2">
                                    <CollectionEdit
                                        row={row}
                                        endpoint={endpoint}
                                        mutate={mutate}
                                    />
                                    <CollectionDelete
                                        row={row}
                                        endpoint={endpoint}
                                        mutate={mutate}
                                    />
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
