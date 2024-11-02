import { createFileRoute } from '@tanstack/react-router';
import { CollectionManager } from '@/components/CollectionManager';

export const Route = createFileRoute('/dashboard/contacts')({
  component: Contacts
});

function Contacts() {
  return <CollectionManager endpoint="contact" />;
}
