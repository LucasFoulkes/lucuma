import { createFileRoute } from '@tanstack/react-router'

function DashboardPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-4">Welcome to your dashboard!</p>
    </div>
  )
}

export const Route = createFileRoute('/dashboard')({
  component: DashboardPage,
})
