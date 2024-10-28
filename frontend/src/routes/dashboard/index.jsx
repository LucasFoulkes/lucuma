import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
export const Route = createFileRoute('/dashboard/')({
  component: Dashboard
})

function Dashboard() {
  const [storageItems, setStorageItems] = useState({})

  useEffect(() => {
    const items = {}
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      items[key] = localStorage.getItem(key)
    }
    setStorageItems(items)
  }, [])

  return (
    <div className="h-full w-full overflow-hidden p-4">
      <Card className="h-full w-full">
        <CardHeader>
          <CardTitle>LocalStorage Contents</CardTitle>
        </CardHeader>
        <CardContent>
          {Object.entries(storageItems).map(([key, value]) => (
            <div key={key} className="break-words">
              <strong>{key}:</strong> <p>{value}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
