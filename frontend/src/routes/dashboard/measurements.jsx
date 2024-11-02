import { createFileRoute } from '@tanstack/react-router'
import { CollectionManager } from '@/components/CollectionManager'

export const Route = createFileRoute('/dashboard/measurements')({
  component: Measurements
})

function Measurements() {
  return <CollectionManager endpoint="measurement" />;
}
