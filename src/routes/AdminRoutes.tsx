

// src/routes/AdminRoutes.tsx
import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./protectedRoutes";
import NotFound from "@/components/layout/NotFound";
import { DashboardSkeleton, TableSkeleton } from "@/utils/SkeletonLoader";

const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard"));
const UsersList = lazy(() => import("@/pages/admin/UsersList"));
const ProblemsList = lazy(() => import("@/components/admin/ProblemsList")); 
const ProblemDetailsPage = lazy(() => import("@/components/admin/ProblemDetailsPage")); 


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
          path="problems"
          element={
            <Suspense fallback={<TableSkeleton />}>
              <ProblemsList />
            </Suspense>
          }
        />
        <Route
          path="problems/:id"
          element={
            <Suspense fallback={<TableSkeleton />}>
              <ProblemDetailsPage />
            </Suspense>
          }
        />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AdminRoutes;