import { createFileRoute } from '@tanstack/react-router'
import { DataTable } from '@/components/data-table'

export const Route = createFileRoute('/dashboard/greenhouses')({
  component: Greenhouses
})

function Greenhouses() {
  return (
    <DataTable
      title="Greenhouses"
      endpoint="greenhouse"
    />
  )
}
