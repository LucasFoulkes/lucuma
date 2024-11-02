import { createFileRoute } from '@tanstack/react-router'
import { CollectionManager } from '@/components/CollectionManager'

export const Route = createFileRoute('/dashboard/farms')({
  component: Farms
})

function Farms() {
  return <CollectionManager endpoint="farm" />;
}
