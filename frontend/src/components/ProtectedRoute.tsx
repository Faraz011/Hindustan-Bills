import { Navigate } from "react-router-dom"

interface Props {
  children: JSX.Element
  role?: string   // optional: for role-based access later
}

const ProtectedRoute = ({ children }: Props) => {
  const token = localStorage.getItem("hb_token")

  // If no token → force login
  if (!token || token.length < 10) {
    return <Navigate to="/login" replace />
  }

  // Token exists → allow access
  return children
}

export default ProtectedRoute
