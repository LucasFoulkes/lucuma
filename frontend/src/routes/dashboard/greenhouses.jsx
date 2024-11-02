import { createFileRoute } from '@tanstack/react-router'
import { CollectionManager } from '@/components/CollectionManager'

export const Route = createFileRoute('/dashboard/greenhouses')({
  component: Greenhouses
})

function Greenhouses() {
  return <CollectionManager endpoint="greenhouse" />;
}
