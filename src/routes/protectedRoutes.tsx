// C:\Users\vivek_laxvnt1\Desktop\JudgeXpert\Frontend\src\routes\protectedRoutes.tsx

import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/Store";

interface ProtectedRouteProps {
  allowedRoles: string[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!user?.role || !allowedRoles.includes(user.role)) return <Navigate to="/unauthorized" replace />;

  return <Outlet />;
};

export default ProtectedRoute;
