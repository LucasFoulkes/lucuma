import { createFileRoute } from '@tanstack/react-router'
import { DataTable } from '@/components/data-table'

export const Route = createFileRoute('/dashboard/organizations')({
  component: Organizations
})

function Organizations() {
  return (
    <DataTable
      title="Organizations"
      endpoint="organization"
    />
  )
}
