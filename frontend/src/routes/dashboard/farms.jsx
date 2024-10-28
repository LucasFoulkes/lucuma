import { createFileRoute } from '@tanstack/react-router'
import { DataTable } from '@/components/data-table'

export const Route = createFileRoute('/dashboard/farms')({
  component: Farms
})

function Farms() {
  return (
    <DataTable
      title="Farms"
      endpoint="farm"
    />
  )
}
