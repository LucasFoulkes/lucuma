import { useApi } from '@/hooks/use-api';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { CollectionTable } from '@/components/CollectionTable';
import { CollectionCreate } from '@/components/CollectionCreate';

export function CollectionManager({ endpoint }) {
    const { data = [], mutate } = useApi(endpoint);

    return (
        <div className="flex-1 w-full p-4 overflow-hidden gap-2 flex flex-col min-h-0">
            <div className="flex gap-2 items-center justify-between">
                <Input
                    type="text"
                    placeholder="Search"
                    className="w-96"
                />
                <CollectionCreate endpoint={endpoint} mutate={mutate} />
            </div>
            <Card className="flex-1 flex flex-col min-h-0">
                <CardHeader>
                    <CardTitle className="capitalize">{endpoint}s</CardTitle>
                    <CardDescription>
                        {data.length} {endpoint}s
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 overflow-auto min-h-0">
                    <CollectionTable
                        data={data}
                        endpoint={endpoint}
                        mutate={mutate}
                    />
                </CardContent>
            </Card>
        </div>
    );
} 