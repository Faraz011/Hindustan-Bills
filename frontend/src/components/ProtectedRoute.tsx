import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

interface Props {
  children: JSX.Element;
  role?: string; // optional: for role-based access
}

interface JWTPayload {
  role?: string;
}

const ProtectedRoute = ({ children, role }: Props) => {
  const token = localStorage.getItem("hb_token");

  // If no token → force login
  if (!token || token.length < 10) {
    return <Navigate to="/login" replace />;
  }

  // If role is specified, check if user has the required role
  if (role) {
    try {
      const decoded: JWTPayload = jwtDecode(token);
      if (decoded.role !== role) {
        // Redirect to appropriate dashboard based on user role
        if (decoded.role === "retailer") {
          return <Navigate to="/retailer/dashboard" replace />;
        } else if (decoded.role === "customer") {
          return <Navigate to="/customer/dashboard" replace />;
        } else {
          return <Navigate to="/" replace />;
        }
      }
    } catch (error) {
      console.error("Error decoding token:", error);
      return <Navigate to="/login" replace />;
    }
  }

  // Token exists and role matches (or no role specified) → allow access
  return children;
};

export default ProtectedRoute;
