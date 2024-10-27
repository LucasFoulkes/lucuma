import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [organizations, setOrganizations] = useState([])

  useEffect(() => {
    fetch('https://www.cananvalley.systems/api/organization')
      .then(response => response.json())
      .then(data => setOrganizations(data))
  }, [])

  return (
    <>
      <h1>Lucuma</h1>
      <h2>Organizations</h2>
      {organizations.map(organization => (
        <div key={organization._id}>
          <h3>{organization.name}</h3>
          <p>{organization.description}</p>
        </div>
      ))}
    </>
  )
}

export default App
