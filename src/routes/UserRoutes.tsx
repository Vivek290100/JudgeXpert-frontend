// C:\Users\vivek_laxvnt1\Desktop\JudgeXpert\Frontend\src\routes\UserRoutes.tsx
import { lazy } from "react";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./protectedRoutes";
import NotFound from "@/pages/common/NotFound";

const Dashboard = lazy(() => import("@/pages/user/UserDashboard"));
const Profile = lazy(() => import("@/pages/user/UserProfile"));

const UserRoutes = () => {
  return (
    <Routes>
      {/* Protected User Routes */}
      <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* Catch-all for invalid user URLs */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default UserRoutes;
