import { useApi } from '@/hooks/use-api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PlusIcon, SearchIcon } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from '@/components/ui/sheet';

export function CollectionManager({ endpoint }) {
    const { data, error, isLoading } = useApi(endpoint);
    const { data: schemaData, error: schemaError, isLoading: schemaLoading } = useApi(`${endpoint}/schema`);

    return (
        <div className="h-full w-full p-4 overflow-hidden gap-2 flex flex-col">
            <Card className="h-full w-full">
                <CardHeader>
                    <CardTitle className="capitalize">{endpoint}s</CardTitle>
                </CardHeader>
                <CardContent className="overflow-auto">
                    <div className="w-full h-full overflow-auto">
                        <pre>{JSON.stringify(data, null, 2)}</pre>
                    </div>
                </CardContent>
            </Card>
        </div >
    );
}
