import { Suspense } from "react";
import { Route, Routes } from 'react-router-dom';
import PublicRoutes from "./routes/PublicRoutes";
import UserRoutes from "./routes/UserRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import UserLayout from "./layout/UserLayout";
import AdminLayout from "./layout/AdminLayout";
import SkeletonLoader from "./utils/skeletonLoader/SkeletonLoader";
import CommonLayout from "./layout/CommonLayout";
import NotFound from '@/pages/common/NotFound';

const App = () => {
  return (
    <Suspense fallback={<SkeletonLoader />}>
      <Routes>
        <Route element={<CommonLayout />}>
          <Route path="/*" element={<PublicRoutes />} />
          <Route path="/user/*" element={<UserLayout />}>
            <Route path="*" element={<UserRoutes />} />
          </Route>
        </Route>
        <Route path="/admin/*" element={<AdminLayout />}>
          <Route path="*" element={<AdminRoutes />} />
        </Route>
        {/* Catch all routes that do not match any of the above */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default App;