import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../redux/Store";
import { FaGithub, FaLinkedin, FaStar, FaChevronRight } from "react-icons/fa";
import { apiRequest } from "@/utils/axios/ApiRequest";
import EditProfile from "./EditProfile";
import { ApiResponse, ProblemsResponse, IProblem, IUserProblemStatus } from "@/types/ProblemTypes";
import { Difficulty } from "@/types/Enums";

const UserDashboard = () => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [userProblemStatus, setUserProblemStatus] = useState<IUserProblemStatus[]>([]);
  const [problems, setProblems] = useState<IProblem[]>([]);
  const [totalProblemsInDb, setTotalProblemsInDb] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchUserStats = async () => {
    setLoading(true);
    try {
      const response = await apiRequest<ApiResponse<ProblemsResponse>>("get", "/problems?page=1&limit=1000");
      console.log("aaaaaaaaaaaaaaaaaa",response);
      
      if (response.success && response.data) {
        setProblems(response.data.problems || []);
        setUserProblemStatus(response.data.userProblemStatus || []);
        setTotalProblemsInDb(response.data.totalProblemsInDb || 0);
      }
    } catch (err) {
      console.error("Failed to fetch user stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchUserStats();
    }
  }, [isAuthenticated, user]);

  if (!isAuthenticated || !user) {
    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <button
            className="px-6 py-2 bg-yellow-500 text-black font-medium rounded hover:bg-yellow-600 transition-colors"
            onClick={() => navigate("/login")}>
            Log In
          </button>
        </div>
      </div>
    );
  }

  const solvedProblems = userProblemStatus.filter((status) => status.solved).length;
  const progressPercentage = totalProblemsInDb ? ((solvedProblems / totalProblemsInDb) * 100).toFixed(1) : 0;

  const solvedByDifficulty = {
    [Difficulty.EASY]: 0,
    [Difficulty.MEDIUM]: 0,
    [Difficulty.HARD]: 0,
  };



  const getDifficultyPillColor = (difficulty: string) => {
    switch (difficulty) {
      case Difficulty.EASY:
        return "text-green-300";
      case Difficulty.MEDIUM:
        return "text-yellow-300";
      case Difficulty.HARD:
        return "text-red-300";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div className="bg-background text-white min-h-screen p-6">
      <div className="container mx-auto max-w-7xl">
        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left Column - Profile */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            {/* Profile Card */}
            <div className="bg-card rounded-lg overflow-hidden relative w-full">
              <div className="p-6 flex flex-col items-center rounded-lg border border-blue-500 relative">

                <div className="w-24 h-24 bg-gray-800 border-2 border-gray-700 rounded-md flex items-center justify-center mb-3 overflow-hidden">
                  {user.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user.fullName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl font-bold text-gray-400">
                      {user.fullName?.charAt(0).toUpperCase() || "U"}
                    </span>
                  )}
                </div>
                <h2 className="text-lg font-semibold text-white text-center">Profile</h2>
              </div>
            </div>

            {/* Profile Actions */}
            <div className="bg-card rounded-lg overflow-hidden w-full">
              <button
                className="w-full p-3 text-left text-gray-300 hover:bg-gray-800 flex items-center justify-between border-gray-800 text-sm"
                onClick={() => setIsEditProfileOpen(true)}
              >
                Edit Profile
                <FaChevronRight className="w-3 h-3 text-gray-500" />
              </button>
              {/* <button
                className="w-full p-3 text-left text-gray-300 hover:bg-gray-800 flex items-center justify-between border-b border-gray-800 text-sm"
              >
                Change Password
                <FaLock className="w-3 h-3 text-gray-500" />
              </button> */}
            </div>
          </div>

          {/* Middle Column - User Info & Contests */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* User Info */}
            <div className="bg-card rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-1">{user.fullName || "Vivek"}</h2>
              <h2 className="text-gray-400 text-sm mb-3">{user.email || "name@gmail.com"}</h2>
              <div className="flex gap-4">
                <a
                  href={user.github || "#"}
                  className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaGithub className="w-4 h-4" />
                  <span className="text-sm">{user.github?"Github" : "www.github"}</span>
                </a>
                <a
                  href={user.linkedin || "#"}
                  className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaLinkedin className="w-4 h-4" />
                  <span className="text-sm">{user.linkedin?"Linkedin" : "www.linkedin"}</span>
                </a>
              </div>
            </div>

            {/* Contests */}
            <div className="bg-card rounded-lg p-6">
              <div className="flex items-center mb-4">
                <FaStar className="w-5 h-5 text-yellow-500 mr-2" />
                <h3 className="text-lg font-semibold">Contests</h3>
              </div>
              <p className="text-sm text-gray-300">
                <span className="font-medium">Code. Compete. Win! 🏆</span>
              </p>
              <p className="text-sm text-gray-400 mt-1 mb-4">Participate in exciting coding battles!</p>

              <div className="flex justify-between items-center">
                <button
                  className="px-4 py-1 bg-gray-800 text-gray-300 rounded-md hover:bg-gray-700 transition-colors text-sm"
                  onClick={() => navigate("/contest-winners")}
                >
                  Contest Winners
                </button>
                
                <button
                  className="px-4 py-1 bg-gray-100 text-gray-900 text-sm rounded-md hover:bg-gray-200 transition-colors"
                  onClick={() => navigate("/contests")}
                >
                  Participate
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Rankings & Problem Stats */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            {/* My Rank */}
            <div className="bg-card rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-3">My Rank</h3>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-300">Level Up!</p>
                  <p className="text-sm text-gray-400 mt-1">Solve more challenges to boost your rank!</p>
                </div>
                <div className="relative">
                  <div className="flex items-center justify-center bg-yellow-500 w-10 h-10 rounded-full">
                    <span className="text-black font-bold text-lg">#{user.rank || "8"}</span>
                  </div>
                </div>
              </div>
              <button
                className="w-full py-2 bg-gray-800 text-gray-300 rounded-md hover:bg-gray-700 transition-colors text-sm"
                onClick={() => navigate("/user/leaderboard")}
              >
                Leader Board
              </button>
            </div>

            {/* Problem Statistics */}
            <div className="bg-card rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-3">Acceptance</h3>
              {loading ? (
                <p className="text-sm text-gray-400">Loading stats...</p>
              ) : (
                <>
                  <div className="text-center mb-4">
  <span className="text-2xl font-bold">
    {solvedProblems}/{totalProblemsInDb}
  </span>
</div>

<div className="relative w-full bg-gray-700 rounded-full h-5 mb-4 overflow-hidden">
  <div
    className="absolute top-0 left-0 h-full bg-yellow-500 text-black text-xs font-semibold flex items-center justify-center transition-all duration-500"
    style={{ width: `${progressPercentage}%` }}
  >
    {progressPercentage}%
  </div>
</div>


                  
                  <div className="space-y-2 mb-4">
                    {Object.entries(solvedByDifficulty).map(([difficulty, count]) => (
                      <div key={difficulty} className="flex items-center justify-between bg-gray-800 px-3 py-1 rounded">
                        <span className={`text-sm ${getDifficultyPillColor(difficulty)}`}>
                          {difficulty.charAt(0).toUpperCase() + difficulty.slice(1).toLowerCase()}
                        </span>
                        <span className="text-sm">
                          {count}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  <button
                    className="w-full py-2 bg-gray-800 text-gray-300 rounded-md hover:bg-gray-700 transition-colors text-sm"
                    onClick={() => navigate("/problems")}
                  >
                    Solved Problems
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfile
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
      />
    </div>
  );
};

export default UserDashboard;