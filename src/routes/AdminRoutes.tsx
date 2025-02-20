// C:\Users\vivek_laxvnt1\Desktop\JudgeXpert\Frontend\src\routes\AdminRoutes.tsx
import { lazy } from "react";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./protectedRoutes";
import NotFound from "@/pages/common/NotFound";

const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard"));
const UsersList = lazy(() => import("@/pages/admin/UsersList"));

const AdminRoutes = () => {
  return (
    <Routes>
      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<UsersList />} />
      </Route>

      {/* Catch-all for invalid admin URLs */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AdminRoutes;
