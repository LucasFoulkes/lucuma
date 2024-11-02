import { createFileRoute } from '@tanstack/react-router'
import { CollectionManager } from '@/components/CollectionManager'

export const Route = createFileRoute('/dashboard/beds')({
  component: Beds
})

function Beds() {
  return <CollectionManager endpoint="bed" />;
}
