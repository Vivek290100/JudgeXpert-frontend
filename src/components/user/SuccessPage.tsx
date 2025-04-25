import { useEffect, useState } from "react";
   import { useLocation, useNavigate } from "react-router-dom";
   import axios from "axios";

   const SuccessPage = () => {
     const location = useLocation();
     const navigate = useNavigate();
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState<string | null>(null);

     useEffect(() => {
       const sessionId = new URLSearchParams(location.search).get("session_id");

       if (!sessionId) {
         setError("Invalid session ID");
         setLoading(false);
         return;
       }

       // Optional: Verify session with backend
       const verifySession = async () => {
         try {
           const response = await axios.get(`/subscriptions/current`, {
             headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
           });
           setLoading(false);
         } catch (err) {
           setError("Failed to verify subscription");
           setLoading(false);
         }
       };

       verifySession();
     }, [location]);

     if (loading) return <div>Loading...</div>;
     if (error) return <div>Error: {error}</div>;

     return (
       <div>
         <h1>Subscription Successful!</h1>
         <p>Your subscription has been activated.</p>
         <button onClick={() => navigate("/subscription")}>View Subscription</button>
       </div>
     );
   };

   export default SuccessPage;