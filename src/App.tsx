import { Suspense, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import PublicRoutes from "./routes/PublicRoutes";
import UserRoutes from "./routes/UserRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import UserLayout from "./layout/UserLayout";
import AdminLayout from "./layout/AdminLayout";
import SkeletonLoader, { AuthSkeleton, DashboardSkeleton } from "./utils/SkeletonLoader";
import CommonLayout from "./layout/CommonLayout";
import NotFound from "@/components/layout/NotFound";
import { Toaster } from "react-hot-toast";
import { useAppSelector } from "@/redux/Store";
import { initializeSocket, disconnectSocket } from "@/utils/socket";

const App = () => {
  // useEffect(() => {
  //   document.addEventListener("contextmenu", (event) => event.preventDefault());
  //   const keydownHandler = (event: { key: string; ctrlKey: any; shiftKey: any; preventDefault: () => void; }) => {
  //     if (event.key === "F12" || (event.ctrlKey && event.shiftKey && event.key === "I")) {
  //       event.preventDefault();
  //     }
  //   };
  //   window.addEventListener("keydown", keydownHandler);
  //   return () => {
  //     document.removeEventListener("contextmenu", (event) => event.preventDefault());
  //     window.removeEventListener("keydown", keydownHandler);
  //   };
  // }, []);
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      initializeSocket(user.id);
    } else {
      disconnectSocket();
    }

    return () => {
      disconnectSocket();
    };
  }, [isAuthenticated, user]);
  return (
    <>
      <Routes>
        {/* Public */}
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

        {/* User */}
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

        {/* Admin */}
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
      <Toaster position="bottom-right" />
    </>
  );
};

export default App;
