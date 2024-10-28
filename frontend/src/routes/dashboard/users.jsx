import { createFileRoute } from '@tanstack/react-router'
import { DataTable } from '@/components/data-table'

export const Route = createFileRoute('/dashboard/users')({
  component: Users
})

function Users() {
  return (
    <DataTable
      title="Users"
      endpoint="user"
    />
  )
}
