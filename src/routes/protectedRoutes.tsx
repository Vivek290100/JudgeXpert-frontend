import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/Store";

interface User {
  role?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

interface ProtectedRouteProps {
  allowedRoles: string[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useSelector<RootState, AuthState>((state) => state.auth);

  // Check for authentication
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check for user role
  if (!user?.role || !allowedRoles.includes(user.role)) {
    const redirectPath = user?.role === "admin" ? "/admin/dashboard" : "/";
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

// Type guard for checking role
const hasValidRole = (user: User | null, allowedRoles: string[]): boolean => {
  return !!user?.role && allowedRoles.includes(user.role);
};

export { hasValidRole };
export default ProtectedRoute;