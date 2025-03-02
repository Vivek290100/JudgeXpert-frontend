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



// src/routes/AdminRoutes.tsx
import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./protectedRoutes";
import NotFound from "@/pages/common/NotFound";
import { DashboardSkeleton, TableSkeleton } from "@/utils/SkeletonLoader";

const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard"));
const UsersList = lazy(() => import("@/pages/admin/UsersList"));
const ProcessNewProblem = lazy(() => import("@/components/admin/ProcessNewProblem"));
const ProblemsList = lazy(() => import("@/components/admin/ProblemsList")); // Import the new component

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
        <Route
          path="process-new-problem"
          element={
            <Suspense fallback={<DashboardSkeleton />}>
              <ProcessNewProblem />
            </Suspense>
          }
        />
        <Route
          path="problems"
          element={
            <Suspense fallback={<TableSkeleton />}>
              <ProblemsList />
            </Suspense>
          }
        />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AdminRoutes;