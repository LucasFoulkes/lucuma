import { createFileRoute } from '@tanstack/react-router'
import { CollectionManager } from '@/components/CollectionManager'

export const Route = createFileRoute('/dashboard/phytopathogens')({
  component: Phytopathogens
})

function Phytopathogens() {
  return <CollectionManager endpoint="phytopathogen" />;
}
