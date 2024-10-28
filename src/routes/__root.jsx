import { RootRoute } from '@tanstack/react-router'

export const rootRoute = new RootRoute({
    component: () => (
        <div>
            <Outlet /> {/* This is where child routes render */}
        </div>
    ),
})
