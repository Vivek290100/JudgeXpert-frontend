// import { Suspense } from "react";
// import { Route, Routes } from "react-router-dom";
// import PublicRoutes from "./routes/PublicRoutes";
// import UserRoutes from "./routes/UserRoutes";
// import AdminRoutes from "./routes/AdminRoutes";
// import UserLayout from "./layout/UserLayout";
// import AdminLayout from "./layout/AdminLayout";
// import SkeletonLoader from "./utils/SkeletonLoader";
// import CommonLayout from "./layout/CommonLayout";
// import NotFound from "@/pages/common/NotFound";
// import { Toaster } from "react-hot-toast";

// const App = () => {
//   return (
//     <Suspense fallback={<SkeletonLoader />}>
//       <Routes>
//         {/* Public Routes */}
//         <Route element={<CommonLayout />}>
//           <Route path="/*" element={<PublicRoutes />} />
//         </Route>

//         {/* User Routes (Inside User Layout) */}
//         <Route path="/user/*" element={<UserLayout />}>
//           <Route path="*" element={<UserRoutes />} />
//         </Route>

//         {/* Admin Routes (Inside Admin Layout) */}
//         <Route path="/admin/*" element={<AdminLayout />}>
//           <Route path="*" element={<AdminRoutes />} />
//         </Route>

//         {/* Catch-all Route */}
//         <Route path="*" element={<NotFound />} />
//       </Routes>
//       <Toaster />
//     </Suspense>
//   );
// };

// export default App;


// App.tsx
import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import PublicRoutes from "./routes/PublicRoutes";
import UserRoutes from "./routes/UserRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import UserLayout from "./layout/UserLayout";
import AdminLayout from "./layout/AdminLayout";
import SkeletonLoader, { AuthSkeleton, DashboardSkeleton } from "./utils/SkeletonLoader";
import CommonLayout from "./layout/CommonLayout";
import NotFound from "@/pages/common/NotFound";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route element={<CommonLayout />}>
          <Route
            path="/*"
            element={
              <Suspense fallback={<AuthSkeleton />}>
                <PublicRoutes />
              </Suspense>
            }
          />
        </Route>

        {/* User Routes */}
        <Route
          path="/user/*"
          element={
            <Suspense fallback={<SkeletonLoader />}>
              <UserLayout />
            </Suspense>
          }
        >
          <Route
            path="*"
            element={
              <Suspense fallback={<DashboardSkeleton />}>
                <UserRoutes />
              </Suspense>
            }
          />
        </Route>

        {/* Admin Routes */}
        <Route
          path="/admin/*"
          element={
            <Suspense fallback={<SkeletonLoader />}>
              <AdminLayout />
            </Suspense>
          }
        >
          <Route
            path="*"
            element={
              <Suspense fallback={<DashboardSkeleton />}>
                <AdminRoutes />
              </Suspense>
            }
          />
        </Route>

        {/* Catch-all Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </>
  );
};

export default App;
