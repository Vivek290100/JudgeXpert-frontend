import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../redux/Store";
import { FaGithub, FaLinkedin, FaStar, FaChevronRight } from "react-icons/fa";
import { apiRequest } from "@/utils/axios/ApiRequest";
import EditProfile from "./EditProfile";
import { ApiResponse, ProblemsResponse, IProblem, IUserProblemStatus } from "@/types/ProblemTypes";
import { Difficulty } from "@/types/Enums";
import { LeaderboardApiResponse, LeaderboardEntry } from "@/types/LeaderboardTypes";

const UserDashboard = () => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [userProblemStatus, setUserProblemStatus] = useState<IUserProblemStatus[]>([]);
  const [problems, setProblems] = useState<IProblem[]>([]);
  const [totalProblemsInDb, setTotalProblemsInDb] = useState(0);
  const [userRank, setUserRank] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchUserStats = async () => {
    setLoading(true);
    try {
      // Fetch problem stats
      const problemsResponse = await apiRequest<ApiResponse<ProblemsResponse>>(
        "get",
        "/problems?page=1&limit=1000"
      );
      if (problemsResponse.success && problemsResponse.data) {
        setProblems(problemsResponse.data.problems || []);
        setUserProblemStatus(problemsResponse.data.userProblemStatus || []);
        setTotalProblemsInDb(problemsResponse.data.totalProblemsInDb || 0);
      }

      // Fetch leaderboard data to get the user's rank
      const leaderboardResponse = await apiRequest<ApiResponse<LeaderboardApiResponse>>(
        "get",
        "/leaderboard?page=1&limit=10"
      );
      if (leaderboardResponse.success && leaderboardResponse.data) {
        const userEntry = leaderboardResponse.data.leaderboard.find(
          (entry: LeaderboardEntry) => entry._id === user?.id
        );
        if (userEntry) {
          setUserRank(userEntry.rank);
        }
      }
    } catch (err) {
      console.error("Failed to fetch user stats or rank:", err);
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
      <div className="bg-black text-white min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <button
            className="px-8 py-3 bg-yellow-500 text-black text-lg font-medium rounded-lg hover:bg-yellow-600 transition-colors shadow-lg"
            onClick={() => navigate("/login")}
          >
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

  problems.forEach((problem) => {
    if (userProblemStatus.find((status) => status.problemId === problem._id && status.solved)) {
      solvedByDifficulty[problem.difficulty]++;
    }
  });

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
    <div className="bg-background text-white min-h-screen p-4 md:p-6 lg:p-8">
      <div className="container mx-auto max-w-7xl">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
          {/* Left Column - Profile (Full width on mobile, 1/3 on desktop) */}
          <div className="md:col-span-1 lg:col-span-3 flex flex-col gap-6">
            {/* Profile Card */}
            <div className="bg-card rounded-xl overflow-hidden relative w-full shadow-lg">
              <div className="p-6 md:p-8 flex flex-col items-center rounded-xl border-2 border-blue-500 relative">
                <div className="w-28 h-28 md:w-32 md:h-32 bg-gray-800 border-3 border-gray-700 rounded-lg flex items-center justify-center mb-4 overflow-hidden shadow-md">
                  {user.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user.fullName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-5xl font-bold text-gray-400">
                      {user.fullName?.charAt(0).toUpperCase() || "U"}
                    </span>
                  )}
                </div>
                <h2 className="text-xl font-semibold text-white text-center">Profile</h2>
              </div>
            </div>

            {/* Profile Actions */}
            <div className="bg-card rounded-xl overflow-hidden w-full shadow-lg">
              <button
                className="w-full p-4 md:p-5 text-left text-gray-300 hover:bg-gray-800 flex items-center justify-between border-gray-800 text-base"
                onClick={() => setIsEditProfileOpen(true)}
              >
                Edit Profile
                <FaChevronRight className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Middle Column - User Info & Contests */}
          <div className="md:col-span-1 lg:col-span-5 flex flex-col gap-6">
            {/* User Info */}
            <div className="bg-card rounded-xl p-6 md:p-8 shadow-lg">
              <h2 className="text-xl font-semibold mb-2">{user.fullName || "Vivek"}</h2>
              <h2 className="text-gray-400 text-base mb-4 overflow-hidden">{user.email || "name@gmail.com"}</h2>
              <div className="flex gap-6">
                <a
                  href={user.github || "#"}
                  className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaGithub className="w-5 h-5" />
                  <span className="text-base">{user.github ? "Github" : "www.github"}</span>
                </a>
                <a
                  href={user.linkedin || "#"}
                  className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaLinkedin className="w-5 h-5" />
                  <span className="text-base">{user.linkedin ? "Linkedin" : "www.linkedin"}</span>
                </a>
              </div>
            </div>

            {/* Contests */}
            <div className="bg-card rounded-xl p-6 md:p-8 shadow-lg">
              <div className="flex items-center mb-5">
                <FaStar className="w-6 h-6 text-yellow-500 mr-3" />
                <h3 className="text-xl font-semibold">Contests</h3>
              </div>
              <p className="text-base text-gray-300">
                <span className="font-medium">Code. Compete. Win! 🏆</span>
              </p>
              <p className="text-base text-gray-400 mt-2 mb-6">Participate in exciting coding battles!</p>
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <button
                  className="px-6 py-3 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors text-base shadow-md flex-1"
                  onClick={() => navigate("/contest-winners")}
                >
                  Contest Winners
                </button>
                <button
                  className="px-6 py-3 bg-gray-100 text-gray-900 text-base rounded-lg hover:bg-gray-200 transition-colors shadow-md flex-1"
                  onClick={() => navigate("/user/contests")}
                >
                  Participate
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Rankings & Problem Stats */}
          <div className="md:col-span-2 lg:col-span-4 flex flex-col gap-6">
            {/* My Rank */}
            <div className="bg-card rounded-xl p-6 md:p-8 shadow-lg">
              <h3 className="text-xl font-semibold mb-4">My Rank</h3>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-base text-gray-300">Level Up!</p>
                  <p className="text-base text-gray-400 mt-2">Solve more challenges to boost your rank!</p>
                </div>
                <div className="relative">
                  <div className="flex items-center justify-center bg-yellow-500 w-14 h-14 rounded-full shadow-lg">
                    <span className="text-black font-bold text-xl">
                      #{userRank !== undefined ? userRank : "N/A"}
                    </span>
                  </div>
                </div>
              </div>
              <button
                className="w-full py-3 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors text-base shadow-md"
                onClick={() => navigate("/user/leaderboard")}
              >
                Leader Board
              </button>
            </div>

            {/* Problem Statistics */}
            <div className="bg-card rounded-xl p-6 md:p-8 shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Acceptance</h3>
              {loading ? (
                <p className="text-base text-gray-400">Loading stats...</p>
              ) : (
                <>
                  <div className="text-center mb-6">
                    <span className="text-3xl font-bold">
                      {solvedProblems}/{totalProblemsInDb}
                    </span>
                  </div>
                  <div className="relative w-full bg-gray-700 rounded-full h-7 mb-6 overflow-hidden shadow-inner">
                    <div
                      className="absolute top-0 left-0 h-full bg-yellow-500 text-black text-sm font-semibold flex items-center justify-center transition-all duration-500"
                      style={{ width: `${progressPercentage}%` }}
                    >
                      {progressPercentage}%
                    </div>
                  </div>
                  <div className="space-y-3 mb-6">
                    {Object.entries(solvedByDifficulty).map(([difficulty, count]) => (
                      <div
                        key={difficulty}
                        className="flex items-center justify-between bg-gray-800 px-4 py-2 rounded-lg shadow"
                      >
                        <span className={`text-base ${getDifficultyPillColor(difficulty)}`}>
                          {difficulty.charAt(0).toUpperCase() + difficulty.slice(1).toLowerCase()}
                        </span>
                        <span className="text-base">{count}</span>
                      </div>
                    ))}
                  </div>
                  <button
                    className="w-full py-3 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors text-base shadow-md"
                    onClick={() => navigate("/problems")}
                  >
                    Solve Problems
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfile isOpen={isEditProfileOpen} onClose={() => setIsEditProfileOpen(false)} />
    </div>
  );
};

export default UserDashboard;