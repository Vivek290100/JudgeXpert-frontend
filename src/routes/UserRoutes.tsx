import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./protectedRoutes";
import NotFound from "@/components/layout/NotFound";
import { DashboardSkeleton, ProblemEditorSkeleton, TableSkeleton } from "@/utils/SkeletonLoader";
import ProblemEditor from "@/pages/user/ProblemEditor";
import SubmissionsPage from "@/components/user/SubmissionsPage";

const Dashboard = lazy(() => import("@/pages/user/UserDashboard"));
const ProblemsList = lazy(() => import("@/pages/user/UserProblemsList"));

const UserRoutes = () => {
  return (
    <Routes>
      <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
        <Route path="dashboard" element={ <Suspense fallback={<DashboardSkeleton />}><Dashboard /> </Suspense> }/>
        <Route path="problems" element={<Suspense fallback={<TableSkeleton />}><ProblemsList /> </Suspense>}/>
        <Route path="problems/:slug"  element={ <Suspense fallback={<ProblemEditorSkeleton/>}> <ProblemEditor /> </Suspense> }/>
        <Route path="submissions" element={<SubmissionsPage/>}></Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default UserRoutes;