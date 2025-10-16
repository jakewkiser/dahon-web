import { createBrowserRouter, Navigate } from 'react-router-dom'
import App from '../App'
import SignIn from '../pages/SignIn'
import Dashboard from '../pages/Dashboard'
import AISearch from '../pages/AISearch'
import AddPlant from '../pages/AddPlant'
import PlantDetails from '../pages/PlantDetails'
import PlantEdit from '../pages/PlantEdit'
import Settings from '../pages/Settings'
import { useAuth } from '../lib/auth'

function Guard({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth()

  if (loading) return <div>Loading...</div>
  if (!user) return <Navigate to="/signin" replace />
  return children
}

const router = createBrowserRouter([
  // --- Public route ----------------------------------------------------------
  { path: '/signin', element: <SignIn /> },

  // --- Authenticated routes --------------------------------------------------
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },

      // Main dashboard
      { path: 'dashboard', element: <Guard><Dashboard /></Guard> },

      // AI Search and plant actions
      { path: 'ai', element: <Guard><AISearch /></Guard> },
      { path: 'add-plant', element: <Guard><AddPlant /></Guard> }, // ✅ fixed path
      { path: 'plant/:id', element: <Guard><PlantDetails /></Guard> },
      { path: 'plant/:id/edit', element: <Guard><PlantEdit /></Guard> },

      // App settings
      { path: 'settings', element: <Guard><Settings /></Guard> },

      // Catch-all (redirect to dashboard)
      { path: '*', element: <Navigate to="/dashboard" replace /> },
    ]
  }
])

export default router
