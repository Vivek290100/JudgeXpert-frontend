// C:\Users\vivek_laxvnt1\Desktop\JudgeXpert\Frontend\src\routes\UserRoutes.tsx
import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from './protectedRoutes';
import NotFound from '@/pages/common/NotFound';

const Dashboard = lazy(() => import('@/pages/user/UserDashboard'));
const Profile = lazy(() => import('@/pages/user/UserProfile'));

// in UserRoutes.tsx
const UserRoutes = () => {
  return (
    <Routes>
      <Route element={<ProtectedRoute allowedRoles={['user']} />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="*" element={<NotFound />} /> // Add this
      </Route>
    </Routes>
  );
};

export default UserRoutes;