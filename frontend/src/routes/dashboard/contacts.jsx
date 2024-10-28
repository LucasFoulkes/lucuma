import { createFileRoute } from '@tanstack/react-router'
import { DataTable } from '@/components/data-table'

export const Route = createFileRoute('/dashboard/contacts')({
  component: Contacts
})

function Contacts() {
  return (
    <DataTable
      title="Contacts"
      endpoint="contact"
    />
  )
}
