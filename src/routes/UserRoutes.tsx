import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./protectedRoutes";
import NotFound from "@/components/layout/NotFound";
import { DashboardSkeleton, TableSkeleton } from "@/utils/SkeletonLoader";
import ProblemEditor from "@/pages/user/ProblemEditor";

const Dashboard = lazy(() => import("@/pages/user/UserDashboard"));
const ProblemsList = lazy(() => import("@/pages/user/UserProblemsList"));

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
        <Route
          path="problems/:slug"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <ProblemEditor />
            </Suspense>
          }
          />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default UserRoutes;