// Frontend\src\routes\ProtectedRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/Store";

const ProtectedRoute = ({ allowedRoles }: { allowedRoles: string[] }) => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  // console.log("ProtectedRoute - isAuthenticated:", isAuthenticated, "User role:", user?.role);

  if (!isAuthenticated) {
    console.log("Not authenticated, redirecting to /login");
    return <Navigate to="/login" replace />;
  }

  if (!user?.role || !allowedRoles.includes(user.role)) {
    console.log("Role mismatch, redirecting to:", user?.role === "admin" ? "/admin/dashboard" : "/user/dashboard");
    return <Navigate to={user?.role === "admin" ? "/admin/dashboard" : "/user/dashboard"} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;