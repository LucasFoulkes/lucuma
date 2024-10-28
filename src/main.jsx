import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import { router } from './router'

// Wait for the router to be ready
router.load().then(() => {
    ReactDOM.createRoot(document.getElementById('root')).render(
        <React.StrictMode>
            <RouterProvider router={router} />
        </React.StrictMode>
    )
})
