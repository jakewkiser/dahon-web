import { createBrowserRouter, Navigate } from "react-router-dom"
import App from "../App"
import SignIn from "../pages/SignIn"
import Dashboard from "../pages/Dashboard"
import AISearch from "../pages/AISearch"
import AddPlant from "../pages/AddPlant"
import PlantDetails from "../pages/PlantDetails"
import PlantEdit from "../pages/PlantEdit"
import Settings from "../pages/Settings"
import { useAuth } from "../lib/auth"

/* -------------------------------------------------------------
   Route Guard: ensures user is authenticated before navigation
------------------------------------------------------------- */
function Guard({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth()

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-gray-500 dark:text-gray-400">
        Loading...
      </div>
    )

  if (!user) return <Navigate to="/signin" replace />
  return children
}

/* -------------------------------------------------------------
   Static Asset Bypass Component
   Prevents React Router from intercepting /public paths
------------------------------------------------------------- */
function StaticBypass() {
  const path = window.location.pathname
  const isStatic =
    path.startsWith("/plants_local_examples") ||
    path.startsWith("/mascot_") ||
    path.startsWith("/Vector.svg")

  if (isStatic) {
    // Let browser fetch directly from public/
    window.location.href = path
    return null
  }

  return <Navigate to="/dashboard" replace />
}

/* -------------------------------------------------------------
   App Router
------------------------------------------------------------- */
const router = createBrowserRouter([
  // --- Public route ----------------------------------------------------------
  { path: "/signin", element: <SignIn /> },

  // --- Authenticated routes --------------------------------------------------
  {
    path: "/",
    element: <App />,
    children: [
      // Default redirect to dashboard
      { index: true, element: <Navigate to="/dashboard" replace /> },

      // Main dashboard
      { path: "dashboard", element: <Guard><Dashboard /></Guard> },

      // AI Search and plant actions
      { path: "ai", element: <Guard><AISearch /></Guard> },
      { path: "add-plant", element: <Guard><AddPlant /></Guard> },
      { path: "plant/:id", element: <Guard><PlantDetails /></Guard> },
      { path: "plant/:id/edit", element: <Guard><PlantEdit /></Guard> },

      // App settings
      { path: "settings", element: <Guard><Settings /></Guard> },

      // 🧩 Static bypass or catch-all redirect
      { path: "*", element: <StaticBypass /> },
    ],
  },
])

export default router
