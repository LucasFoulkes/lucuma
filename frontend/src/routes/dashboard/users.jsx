import { createFileRoute } from '@tanstack/react-router';
import { CollectionManager } from '@/components/CollectionManager';

export const Route = createFileRoute('/dashboard/users')({
  component: Users
});

function Users() {
  return <CollectionManager endpoint="user" />;
}
