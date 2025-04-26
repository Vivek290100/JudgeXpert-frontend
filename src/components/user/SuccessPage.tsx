import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const SuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const sessionId = new URLSearchParams(location.search).get("session_id");
    console.log(`Session ID: ${sessionId}`);

    if (!sessionId) {
      setError("Invalid session ID");
      return;
    }

    // Display success message
    toast.success("Subscription successful! Your plan is now active.");
  }, [location]);

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