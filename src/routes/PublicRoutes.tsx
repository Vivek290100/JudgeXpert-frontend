// C:\Users\vivek_laxvnt1\Desktop\JudgeXpert\Frontend\src\routes\PublicRoutes.tsx
import { RootState } from "@/redux/Store";
import { lazy } from "react";
import { useSelector } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";

const Home = lazy(() => import("@/pages/user/HomePage"));
const Login = lazy(() => import("@/pages/auth/Login"));
const SignUp = lazy(() => import("@/pages/auth/SignUp"));
const VerifyOTP = lazy(() => import("@/pages/auth/VerifyOtp"));
const ForgotPassword = lazy(() => import("@/pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("@/pages/auth/ResetPassword"))
const VerifyForgotPasswordOtp = lazy(() => import('@/pages/auth/VerifyForgotPasswordOtp'))
const NotFound = lazy(() => import("@/pages/common/NotFound"));

const PublicRoutes = () => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  console.log("aaaaaaaaisAuthenticatedaaaaaaauseraaaaaaaaaa",isAuthenticated,user);
  
  const redirectPath = user?.role === "admin" ? "/admin" : "/user/dashboard";

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="login" element={isAuthenticated ? <Navigate to={redirectPath} replace /> : <Login />} />
      <Route path="signup" element={isAuthenticated ? <Navigate to={redirectPath} replace /> : <SignUp />} />
      <Route path="verifyOtp" element={isAuthenticated ? <Navigate to={redirectPath} replace /> : <VerifyOTP />} />
      <Route path="forgotPassword" element={isAuthenticated ? <Navigate to={redirectPath} replace /> : <ForgotPassword />} />
      <Route path="reset-password" element={isAuthenticated ? <Navigate to={redirectPath} replace /> : <ResetPassword />} /> {/* Add this */}
      <Route path="verifyForgotPasswordOtp" element={isAuthenticated ? <Navigate to={redirectPath} replace /> : <VerifyForgotPasswordOtp />} /> {/* Add this */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default PublicRoutes;
