import { useState } from "react";
import axios from "axios";

const ServerDownPage = () => {
  const [error, setError] = useState("");

  const handleRefresh = async () => {
    try {
      await axios.get("/api/health-check");
  
      const redirect = localStorage.getItem("server_down_redirect") || "/";
      localStorage.removeItem("server_down_redirect");
  
      window.location.replace(redirect);
    } catch {
      setError("Server is still unavailable. Please try again shortly.");
    }
  };
  

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-background text-center px-4">
      <h1 className="text-3xl font-bold text-red-600">🚧 Server Unavailable</h1>
      <p className="mt-4 text-gray-600 dark:text-gray-300">
        Our servers are temporarily down. Please try again in a moment.
      </p>
      <button
        onClick={handleRefresh}
        className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition"
      >
        🔄 Refresh
      </button>
      {error && <p className="text-sm text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default ServerDownPage;
