import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./protectedRoutes";
import NotFound from "@/pages/common/NotFound";
import { DashboardSkeleton, TableSkeleton } from "@/utils/SkeletonLoader";

const Dashboard = lazy(() => import("@/pages/user/UserDashboard"));
const ProblemsList = lazy(() => import("@/components/user/UserProblemsList"));

const UserRoutes = () => {
  return (
    <Routes>
      <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
        <Route
          path="dashboard"
          element={
            <Suspense fallback={<DashboardSkeleton />}>
              <Dashboard />
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

export default UserRoutes;