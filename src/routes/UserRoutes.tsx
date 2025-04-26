import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./protectedRoutes";
import NotFound from "@/components/layout/NotFound";
import { DashboardSkeleton, ProblemEditorSkeleton, TableSkeleton } from "@/utils/SkeletonLoader";
import ProblemEditor from "@/pages/user/ProblemEditor";
import SubmissionsPage from "@/components/user/SubmissionsPage";
import LeaderboardPage from "@/components/user/LeaderBoard";
import ContestsPage from "@/components/user/ContestsPage";
import ServerDown from "@/components/layout/ServerDown";
import ContestDetailsPage from "@/components/user/ContestDetailsPage";
import ContestResultsPage from "@/components/user/ContestResultsPage";
import ContestWinners from "@/components/user/ContestWinners";
import SubscriptionPage from "@/components/user/SubscriptionPage";
import SuccessPage from "@/components/user/SuccessPage";


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
        <Route path="leaderboard" element={<LeaderboardPage/>}></Route>
        <Route path="contests" element={<ContestsPage />} />
        <Route path="contests/:contestId" element={<ContestDetailsPage />} />
        <Route path="contests/:contestId/results" element={<ContestResultsPage />} />
        <Route path="contests/winners" element={<ContestWinners />} />
        <Route path="server-down" element={<ServerDown />} />
        <Route path="subscription" element={<SubscriptionPage />} />
        <Route path="subscription/success" element={<SuccessPage />} />

      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default UserRoutes;