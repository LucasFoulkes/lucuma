import { createFileRoute } from '@tanstack/react-router'
import { DataTable } from '@/components/data-table'

export const Route = createFileRoute('/dashboard/phytopathogens')({
  component: Phytopathogens
})

function Phytopathogens() {
  return (
    <DataTable
      title="Phytopathogens"
      endpoint="phytopathogen"
    />
  )
}
