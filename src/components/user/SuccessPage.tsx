import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { apiRequest } from "@/utils/axios/ApiRequest";
import { useAppDispatch, useAppSelector } from "@/redux/Store";
import { updateUserProfile } from "@/redux/thunks/UserThunks";

interface UserSubscription {
  planId: string;
  price: number;
  status: string;
  currentPeriodEnd: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

const SuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const authUser = useAppSelector((state) => state.auth.user);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sessionId = new URLSearchParams(location.search).get("session_id");

    if (!sessionId) {
      setError("Invalid session ID");
      setLoading(false);
      return;
    }

    const verifySubscription = async () => {
      try {
        const response = await apiRequest<ApiResponse<UserSubscription>>("get", "/subscriptions/current");

        if (response.success && response.data && response.data.status === "active") {
          toast.success("Subscription successful! Your plan is now active.");

          if (authUser) {
            await dispatch(updateUserProfile({
              fullName: authUser.fullName,
              github: authUser.github || "",
              linkedin: authUser.linkedin || "",
              profileImage: authUser.profileImage || "",
            }));
          }
        } else {
          setError("No active subscription found. Please try again or contact support.");
        }
      } catch (err) {
        console.error("Failed to verify subscription:", err);
        setError("Failed to verify subscription. Please try again or contact support.");
      } finally {
        setLoading(false);
      }
    };

    verifySubscription();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 min-h-screen flex flex-col justify-center items-center">
        <svg className="animate-spin h-8 w-8 text-primary" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z" />
        </svg>
        <p className="mt-4 text-lg">Verifying your subscription...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 min-h-screen flex flex-col justify-center items-center">
        <h1 className="text-2xl font-bold text-red-500">Error</h1>
        <p className="mt-4 text-lg">{error}</p>
        <button
          onClick={() => navigate("/user/subscription")}
          className="mt-6 bg-primary text-primary-foreground py-2 px-4 rounded-lg hover:bg-primary/90"
        >
          Back to Subscription
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 min-h-screen flex flex-col justify-center items-center">
      <h1 className="text-3xl font-bold text-green-500">Subscription Successful!</h1>
      <p className="mt-4 text-lg text-center">
        Your subscription has been activated. You now have access to premium features!
      </p>
      <div className="mt-6 flex gap-4">
        <button
          onClick={() => navigate("/user/subscription")}
          className="bg-primary text-primary-foreground py-2 px-4 rounded-lg hover:bg-primary/90"
        >
          View Subscription
        </button>
        <button
          onClick={() => navigate("/user/dashboard")}
          className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default SuccessPage;
