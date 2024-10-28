import { Outlet, createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import {
  Home,
  Building2,
  Users,
  Phone,
  Leaf,
  Warehouse,
  Sprout,
  Thermometer,
  Bug,
  Settings,
} from 'lucide-react'

const navigationItems = [
  { to: '/dashboard', icon: Home, label: null }, // null label will use username
  { to: '/dashboard/organizations', icon: Building2, label: 'Organizations' },
  { to: '/dashboard/users', icon: Users, label: 'Users' },
  { to: '/dashboard/contacts', icon: Phone, label: 'Contacts' },
  { to: '/dashboard/farms', icon: Leaf, label: 'Farms' },
  { to: '/dashboard/greenhouses', icon: Warehouse, label: 'Greenhouses' },
  { to: '/dashboard/beds', icon: Sprout, label: 'Beds' },
  { to: '/dashboard/phytopathogens', icon: Bug, label: 'Phytopathogens' },
  { to: '/dashboard/measurements', icon: Thermometer, label: 'Measurements' },
]

const settingsItem = { to: '/dashboard/settings', icon: Settings, label: 'Settings' }

function NavItem({ to, icon: Icon, children }) {
  return (
    <Link to={to}>
      <Button variant="ghost" className="w-full justify-start">
        <Icon className="mr-2 h-4 w-4" />
        {children}
      </Button>
    </Link>
  )
}

function DashboardPage() {
  const user = JSON.parse(localStorage.getItem('user'))

  return (
    <div className="flex h-screen bg-zinc-100">
      <aside className="border-r bg-white flex flex-col">
        <nav className="flex flex-col flex-1">
          {navigationItems.map((item) => (
            <NavItem key={item.to} to={item.to} icon={item.icon}>
              {item.label === null ? (
                <h2 className="text-lg font-semibold capitalize">
                  {user ? user.username : 'Guest'}
                </h2>
              ) : (
                item.label
              )}
            </NavItem>
          ))}
        </nav>
        <NavItem to={settingsItem.to} icon={settingsItem.icon}>
          {settingsItem.label}
        </NavItem>
      </aside>
      <Outlet />
    </div>
  )
}

export const Route = createFileRoute('/dashboard')({
  component: DashboardPage,
})
