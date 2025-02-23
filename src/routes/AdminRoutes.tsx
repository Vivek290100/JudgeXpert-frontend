// import { lazy } from "react";
// import { Route, Routes } from "react-router-dom";
// import ProtectedRoute from "./protectedRoutes";
// import NotFound from "@/pages/common/NotFound";

// const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard"));
// const UsersList = lazy(() => import("@/pages/admin/UsersList"));

// const AdminRoutes = () => {
//   return (
//     <Routes>
//       <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
//         <Route path="dashboard" element={<AdminDashboard />} />
//         <Route path="users" element={<UsersList />} />
//       </Route>

//       {/* Catch-all for invalid admin URLs */}
//       <Route path="*" element={<NotFound />} />
//     </Routes>
//   );
// };

// export default AdminRoutes;

// AdminRoutes.tsx
import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./protectedRoutes";
import NotFound from "@/pages/common/NotFound";
import { DashboardSkeleton, TableSkeleton } from "@/utils/SkeletonLoader";

const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard"));
const UsersList = lazy(() => import("@/pages/admin/UsersList"));

const AdminRoutes = () => {
  return (
    <Routes>
      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route
          path="dashboard"
          element={
            <Suspense fallback={<DashboardSkeleton />}>
              <AdminDashboard />
            </Suspense>
          }
        />
        <Route
          path="users"
          element={
            <Suspense fallback={<TableSkeleton />}>
              <UsersList />
            </Suspense>
          }
        />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AdminRoutes;
