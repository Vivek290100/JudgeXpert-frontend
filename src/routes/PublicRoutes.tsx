import NotFound from '@/pages/common/NotFound';
import { RootState } from '@/redux/Store';
import { lazy } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router-dom';

const Home = lazy(() => import('@/pages/user/HomePage'));
const Login = lazy(() => import('@/pages/auth/Login'));
const SignUp = lazy(() => import('@/pages/auth/SignUp'));
const VerifyOTP = lazy(() => import('@/pages/auth/VerifyOtp'));

const PublicRoutes = () => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  // Redirect to appropriate dashboard if authenticated
  if (isAuthenticated) {
    return <Navigate to={user?.role === 'admin' ? "/admin" : "/user/dashboard"} replace />;
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="login" element={isAuthenticated ? <Navigate to={user?.role === 'admin' ? "/admin" : "/user/dashboard"} replace /> : <Login />} />
      <Route path="signup" element={isAuthenticated ? <Navigate to={user?.role === 'admin' ? "/admin" : "/user/dashboard"} replace /> : <SignUp />} />
      <Route path="verifyotp" element={isAuthenticated ? <Navigate to={user?.role === 'admin' ? "/admin" : "/user/dashboard"} replace /> : <VerifyOTP />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default PublicRoutes;