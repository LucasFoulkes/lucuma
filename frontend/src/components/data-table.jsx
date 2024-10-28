import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useFetch } from '@/hooks/use-fetch'

// Helper function to safely render values
const formatValue = (value) => {
    if (value === null || value === undefined) {
        return '';
    }
    if (typeof value === 'object') {
        // Handle Date objects
        if (value instanceof Date) {
            return value.toLocaleString();
        }
        // Handle Arrays
        if (Array.isArray(value)) {
            return value.map(formatValue).join(', ');
        }
        // For other objects, return JSON string
        return JSON.stringify(value);
    }
    return String(value);
}

// Helper function to format keys
const formatKey = (key) => {
    // Skip _id since we show it separately
    if (key === '_id') return null;
    // Convert camelCase to Title Case
    return key
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (str) => str.toUpperCase());
}

export function DataTable({
    title,
    endpoint,
}) {
    const { data, error, isLoading } = useFetch(endpoint)

    if (error) {
        return (
            <div className="h-full w-full overflow-hidden p-4">
                <Card className="h-full w-full">
                    <CardHeader>
                        <CardTitle>{title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-red-500">Error: {error.message || error}</div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="h-full w-full overflow-hidden p-4">
            <Card className="h-full w-full">
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="space-y-4">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="flex flex-col gap-2">
                                    <Skeleton className="h-6 w-1/3" />
                                    <Skeleton className="h-4 w-1/2" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {data?.map((item) => {
                                if (!item) return null;

                                return (
                                    <div key={item._id} className="border rounded-lg p-4">
                                        <p className="text-xs text-muted-foreground mb-2">
                                            ID: {item._id}
                                        </p>
                                        <div className="space-y-2">
                                            {Object.entries(item).map(([key, value]) => {
                                                const formattedKey = formatKey(key);
                                                if (!formattedKey) return null;

                                                return (
                                                    <div key={key}>
                                                        <span className="font-semibold">{formattedKey}: </span>
                                                        <span className="text-muted-foreground">
                                                            {formatValue(value)}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
