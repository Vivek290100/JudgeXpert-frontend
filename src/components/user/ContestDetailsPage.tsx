// Frontend\src\components\user\ContestDetailsPage.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiRequest } from "@/utils/axios/ApiRequest";
import { ApiResponse } from "@/types/ProblemTypes";
import { Calendar, Clock, Code2, AlertCircle, ListChecks } from "lucide-react";
import toast from "react-hot-toast";
import { ContestDetailsSkeleton } from "@/utils/SkeletonLoader";

interface Problem {
  _id: string;
  title: string;
  difficulty: string;
  slug: string;
}

interface Contest {
  _id: string;
  title: string;
  slug: string;
  description: string;
  startTime: string;
  endTime: string;
  problems: Problem[];
  participants: { _id: string; userName: string }[];
  isActive: boolean;
  isBlocked: boolean;
}

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
          console.log("Loaded contest:", response.data.contest);
        } else {
          setError(response.message || "Failed to load contest details");
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch contest. Please try again.");
        console.error("Fetch contest error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchContest();
  }, [contestId]);

  useEffect(() => {
    if (!contest) return;

    const updateTimer = () => {
      const now = new Date();
      const start = new Date(contest.startTime);
      const end = new Date(contest.endTime);

      let targetTime: Date;
      let prefix: string;

      if (now < start) {
        targetTime = start;
        prefix = "Starts in: ";
      } else if (now <= end) {
        targetTime = end;
        prefix = "Ends in: ";
      } else {
        setTimeLeft("Contest has ended");
        return;
      }

      const diff = targetTime.getTime() - now.getTime();
      if (diff <= 0) {
        setTimeLeft("Contest has ended");
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(
        `${prefix}${days}d ${hours}h ${minutes}m ${seconds}s`
      );
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, [contest]);

  const handleProblemClick = (problem: Problem) => {
    if (!problem.slug || problem.slug === "undefined") {
      console.error("Invalid problem slug:", problem.slug, "for problem:", problem);
      toast.error("Cannot navigate to problem: Invalid problem identifier");
      return;
    }
    navigate(`/user/problems/${problem.slug}`, { state: { contestId: contest?._id } });
  };

  if (loading) {
    return <ContestDetailsSkeleton />;
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
      <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-6">{contest.title}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Rules and Countdown */}
        <div className="lg:col-span-1 space-y-6">
          {/* Countdown Timer */}
          <div className="bg-card rounded-lg shadow-md p-4 border border-border">
            <h2 className="text-lg font-semibold text-primary mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Contest Timer
            </h2>
            <p className="text-xl font-mono text-foreground">{timeLeft}</p>
            <div className="mt-4 text-sm text-gray-400">
              <p>
                <span className="font-medium">Start:</span>{" "}
                {new Date(contest.startTime).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </p>
              <p>
                <span className="font-medium">End:</span>{" "}
                {new Date(contest.endTime).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </p>
            </div>
          </div>

          {/* Rules */}
          <div className="bg-card rounded-lg shadow-md p-4 border border-border">
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
        </div>

        {/* Right Column: Problems and Details */}
        <div className="lg:col-span-2">
          {/* Contest Description */}
          <div className="bg-card rounded-lg shadow-md p-4 border border-border mb-6">
            <h2 className="text-lg font-semibold text-primary mb-2">Description</h2>
            <p className="text-sm text-gray-400">{contest.description}</p>
          </div>

          {/* Problems List */}
          <div className="bg-card rounded-lg shadow-md p-4 border border-border">
            <h2 className="text-lg font-semibold text-primary mb-4 flex items-center">
              <Code2 className="w-5 h-5 mr-2" />
              Problems
            </h2>
            {contest.problems.length === 0 ? (
              <p className="text-sm text-gray-400 italic">No problems available for this contest.</p>
            ) : (
              <div className="space-y-3">
                {contest.problems.map((problem) => (
                  <div
                    key={problem._id}
                    className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 cursor-pointer transition-colors"
                    onClick={() => handleProblemClick(problem)}
                  >
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-foreground">{problem.title}</h3>
                      <p className="text-xs text-gray-400 capitalize">
                        Difficulty: {problem.difficulty}
                      </p>
                    </div>
                    <button className="text-xs text-blue-400 hover:text-blue-300">
                      Solve Now
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