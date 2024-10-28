import { createFileRoute } from '@tanstack/react-router'
import { DataTable } from '@/components/data-table'

export const Route = createFileRoute('/dashboard/measurements')({
  component: Measurements
})

function Measurements() {
  return (
    <DataTable
      title="Measurements"
      endpoint="measurement"
    />
  )
}
