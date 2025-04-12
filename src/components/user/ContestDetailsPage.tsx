// Frontend\src\components\user\ContestDetailsPage.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiRequest } from "@/utils/axios/ApiRequest";
import { ApiResponse } from "@/types/ProblemTypes";
import { Contest } from "@/types/ContestType";
import { Clock, ListChecks, AlertCircle, Code2 } from "lucide-react";
import toast from "react-hot-toast";
import { ContestsPageSkeleton } from "@/utils/SkeletonLoader";

const ContestDetailsPage: React.FC = () => {
  const { contestId } = useParams<{ contestId: string }>();
  const navigate = useNavigate();
  const [contest, setContest] = useState<Contest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    const fetchContest = async () => {
      if (!contestId) {
        setError("Invalid contest ID");
        setLoading(false);
        return;
      }

      try {
        const response = await apiRequest<ApiResponse<{ contest: Contest }>>(
          "get",
          `/contests/${contestId}`
        );
        console.log("Contest details response:", response);

        if (response.success && response.data.contest) {
          setContest(response.data.contest);
        } else {
          setError(response.message || "Failed to load contest details");
        }
      } catch (err) {
        setError("Failed to fetch contest details. Please try again.");
        console.error("Fetch contest error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchContest();
  }, [contestId]);

  useEffect(() => {
    if (!contest) return;

    const updateCountdown = () => {
      const now = new Date();
      const end = new Date(contest.endTime);
      const start = new Date(contest.startTime);
      let targetTime = now < start ? start : end;
      let prefix = now < start ? "Starts in" : "Ends in";

      const diff = targetTime.getTime() - now.getTime();
      if (diff <= 0) {
        setTimeLeft(now < start ? "Contest starting..." : "Contest ended");
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(
        `${prefix}: ${days > 0 ? `${days}d ` : ""}${hours}h ${minutes}m ${seconds}s`
      );
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [contest]);

  const handleProblemClick = (slug: string | undefined) => {
    if (!slug) {
      toast.error("Problem not available");
      return;
    }
    navigate(`/user/problems/${slug}`);
  };

  if (loading) {
    return <ContestsPageSkeleton />;
  }

  if (error || !contest) {
    return (
      <div className="container mx-auto px-4 flex items-center justify-center h-screen">
        <div className="bg-red-50 text-red-600 p-6 rounded-lg max-w-lg flex items-center shadow-lg">
          <AlertCircle className="w-8 h-8 mr-4" />
          <div>
            <h3 className="text-lg font-semibold mb-1">Error</h3>
            <p>{error || "Contest not found"}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold text-primary mb-6">{contest.title}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Rules and Countdown */}
        <div className="lg:col-span-1 space-y-6">
          {/* Rules */}
          <div className="bg-card rounded-lg shadow-md p-6 border border-border">
            <h2 className="text-lg font-semibold text-primary mb-4 flex items-center">
              <ListChecks className="w-5 h-5 mr-2" />
              Rules and Regulations
            </h2>
            <ul className="list-disc pl-5 text-sm text-gray-400 space-y-2">
              <li>Participants must submit solutions independently.</li>
              <li>Plagiarism or cheating will result in disqualification.</li>
              <li>Submissions must be made before the contest ends.</li>
              <li>Follow the problem constraints and input/output formats.</li>
              <li>Respect the contest schedule and deadlines.</li>
            </ul>
          </div>

          {/* Countdown */}
          <div className="bg-card rounded-lg shadow-md p-6 border border-border">
            <h2 className="text-lg font-semibold text-primary mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Countdown
            </h2>
            <p className="text-xl font-mono text-foreground">{timeLeft}</p>
          </div>
        </div>

        {/* Right Column: Problems */}
        <div className="lg:col-span-2">
          <div className="bg-card rounded-lg shadow-md p-6 border border-border">
            <h2 className="text-lg font-semibold text-primary mb-4 flex items-center">
              <Code2 className="w-5 h-5 mr-2" />
              Problems
            </h2>
            {contest.problems.length === 0 ? (
              <p className="text-sm text-gray-400 italic">No problems available for this contest.</p>
            ) : (
              <div className="space-y-4">
                {contest.problems.map((problem) => (
                  <div
                    key={problem._id}
                    className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors cursor-pointer"
                    onClick={() => handleProblemClick(problem.slug)}
                  >
                    <div>
                      <h3 className="text-sm font-medium text-foreground">{problem.title}</h3>
                      <p className="text-xs text-gray-400">
                        Difficulty:{" "}
                        <span
                          className={`${
                            problem.difficulty.toLowerCase() === "easy"
                              ? "text-green-400"
                              : problem.difficulty.toLowerCase() === "medium"
                              ? "text-yellow-400"
                              : "text-red-400"
                          }`}
                        >
                          {problem.difficulty}
                        </span>
                      </p>
                    </div>
                    <button className="text-sm text-blue-400 hover:text-blue-300">
                      Solve
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContestDetailsPage;