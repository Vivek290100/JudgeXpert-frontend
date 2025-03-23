// Frontend\src\routes\PublicRoutes.tsx
import { lazy, Suspense } from "react";
import { useSelector } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";
import { RootState } from "@/redux/Store";
import { AuthSkeleton } from "@/utils/SkeletonLoader";

const Home = lazy(() => import("@/pages/user/HomePage"));
const Login = lazy(() => import("@/pages/auth/Login"));
const SignUp = lazy(() => import("@/pages/auth/SignUp"));
const VerifyOTP = lazy(() => import("@/pages/auth/VerifyOtp"));
const ForgotPassword = lazy(() => import("@/pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("@/pages/auth/ResetPassword"));
const VerifyForgotPasswordOtp = lazy(() => import("@/pages/auth/VerifyForgotPasswordOtp"));
const NotFound = lazy(() => import("@/components/layout/NotFound"));

const PublicRoutes = () => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  const AuthenticatedGuard = ({ children }: { children: React.ReactNode }) =>
    isAuthenticated ? <Navigate to={user?.role === "admin" ? "/admin/dashboard" : "/"} replace /> : <>{children}</>;

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Suspense fallback={<AuthSkeleton />}>
            {isAuthenticated ? (
              user?.role === "admin" ? <Navigate to="/admin/dashboard" replace /> : <Home />
            ) : (
              <Home />
            )}
          </Suspense>
        }
      />
      <Route
        path="login"
        element={
          <AuthenticatedGuard>
            <Suspense fallback={<AuthSkeleton />}>
              <Login />
            </Suspense>
          </AuthenticatedGuard>
        }
      />
      <Route
        path="signup"
        element={
          <AuthenticatedGuard>
            <Suspense fallback={<AuthSkeleton />}>
              <SignUp />
            </Suspense>
          </AuthenticatedGuard>
        }
      />
      <Route
        path="verifyOtp"
        element={
          <AuthenticatedGuard>
            <Suspense fallback={<AuthSkeleton />}>
              <VerifyOTP />
            </Suspense>
          </AuthenticatedGuard>
        }
      />
      <Route
        path="forgotPassword"
        element={
          <AuthenticatedGuard>
            <Suspense fallback={<AuthSkeleton />}>
              <ForgotPassword />
            </Suspense>
          </AuthenticatedGuard>
        }
      />
      <Route
        path="reset-password"
        element={
          <AuthenticatedGuard>
            <Suspense fallback={<AuthSkeleton />}>
              <ResetPassword />
            </Suspense>
          </AuthenticatedGuard>
        }
      />
      <Route
        path="verifyForgotPasswordOtp"
        element={
          <AuthenticatedGuard>
            <Suspense fallback={<AuthSkeleton />}>
              <VerifyForgotPasswordOtp />
            </Suspense>
          </AuthenticatedGuard>
        }
      />
      <Route path="*" element={<Suspense fallback={<AuthSkeleton />}><NotFound /></Suspense>} />
    </Routes>
  );
};

export default PublicRoutes;