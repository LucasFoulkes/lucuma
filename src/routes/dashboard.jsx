import { Route } from '@tanstack/react-router'
import { rootRoute } from './__root'

export const dashboardRoute = new Route({
    getParentRoute: () => rootRoute,
    path: '/dashboard',
    component: () => (
        <div>Dashboard Content</div>
    ),
})
