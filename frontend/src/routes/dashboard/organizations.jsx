import { createFileRoute } from '@tanstack/react-router'
import { CollectionManager } from '@/components/CollectionManager'

export const Route = createFileRoute('/dashboard/organizations')({
  component: Organizations
})

function Organizations() {
  return <CollectionManager endpoint="organization" />;
}
