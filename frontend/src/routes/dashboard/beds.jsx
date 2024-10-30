import { createFileRoute } from '@tanstack/react-router'
import { DataTable } from '@/components/data-table'

export const Route = createFileRoute('/dashboard/beds')({
  component: Beds
})

function Beds() {
  return (
    <DataTable endpoint="bed" />
  )
}
