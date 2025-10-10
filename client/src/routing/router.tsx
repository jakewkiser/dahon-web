import { createBrowserRouter, Navigate } from 'react-router-dom'
import App from '../App'
import SignIn from '../pages/SignIn'
import Dashboard from '../pages/Dashboard'
import AISearch from '../pages/AISearch'
import AddPlant from '../pages/AddPlant'
import PlantDetails from '../pages/PlantDetails'
import PlantEdit from '../pages/PlantEdit'      // <-- added
import Settings from '../pages/Settings'
import { useAuth } from '../lib/auth'

function Guard({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth()
  if (loading) return <div>Loading...</div>
  if (!user) return <Navigate to="/signin" replace />
  return children
}

const router = createBrowserRouter([
  { path: '/signin', element: <SignIn /> },
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <Guard><Dashboard /></Guard> },
      { path: 'ai', element: <Guard><AISearch /></Guard> },
      { path: 'add', element: <Guard><AddPlant /></Guard> },
      { path: 'plant/:id', element: <Guard><PlantDetails /></Guard> },
      { path: 'plant/:id/edit', element: <Guard><PlantEdit /></Guard> }, // <-- added
      { path: 'settings', element: <Guard><Settings /></Guard> },
    ]
  }
])

export default router
