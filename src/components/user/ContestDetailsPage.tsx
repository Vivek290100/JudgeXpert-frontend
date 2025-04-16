import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { apiRequest } from "@/utils/axios/ApiRequest";
import { ApiResponse } from "@/types/ProblemTypes";
import { Clock, Code2, AlertCircle, ListChecks, Trophy } from "lucide-react";
import toast from "react-hot-toast";
import { ContestDetailsSkeleton } from "@/utils/SkeletonLoader";

interface Problem {
  _id: string;
  title: string;
  difficulty: string;
  slug: string;
}

interface TopParticipant {
  userId: string;
  userName: string;
  executionTime: number;
  submittedAt: string;
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
  const [contestEnded, setContestEnded] = useState(false);
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [topParticipants, setTopParticipants] = useState<TopParticipant[]>([]);
  const [topParticipantsError, setTopParticipantsError] = useState<string | null>(null);

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
        console.log("contest detail resp", response);

        if (response.success && response.data.contest) {
          setContest(response.data.contest);
          console.log("Loaded contest:", response.data.contest);

          if (response.data.contest.problems.length > 0) {
            const problem = response.data.contest.problems[0];
            const query = new URLSearchParams();
            query.append("problemId", problem._id);
            query.append("contestId", contestId);
            try {
              const topResponse = await apiRequest<{ success: boolean; data: { topParticipants: TopParticipant[] } }>(
                "get",
                `/problems/top-participants?${query.toString()}`
              );
              console.log("toparticipants response", topResponse);

              
              if (topResponse.success) {
                setTopParticipants(topResponse.data.topParticipants.slice(0, 5));
              } else {
                setTopParticipantsError("Failed to fetch top participants");
              }
            } catch (err: any) {
              setTopParticipantsError(err.response?.data?.message || "Failed to fetch top participants");
              console.error("Top participants fetch error:", err);
            }
          }
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

    const fetchRegistrationStatus = async () => {
      if (!contestId) return;
      try {
        const response = await apiRequest<ApiResponse<{ contestIds: string[] }>>(
          "get",
          "/user/registered-contests"
        );
        console.log("Registered contests response:", response);
        if (response.success && response.data) {
          const registeredContests = new Set(response.data.contestIds);
          setIsRegistered(registeredContests.has(contestId));
        }
      } catch (err) {
        console.error("Failed to fetch registration status:", err);
      }
    };

    fetchContest();
    fetchRegistrationStatus();
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
        setContestEnded(true);
        return;
      }

      const diff = targetTime.getTime() - now.getTime();
      if (diff <= 0) {
        setTimeLeft("Contest has ended");
        setContestEnded(true);
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

  const isProblemAccessRestricted = () => {
    if (contestEnded) return false;
    return !isRegistered;
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

  const restricted = isProblemAccessRestricted();
  const problem = contest.problems[0];

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary">{contest.title}</h1>
        {contestEnded && (
          <Link
            to={`/user/contests/${contest._id}/results`}
            className="flex items-center gap-1 py-1.5 px-3 rounded text-sm text-white bg-blue-500 hover:bg-blue-600"
          >
            <Trophy className="w-4 h-4" />
            Contest Results
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
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

        <div className="lg:col-span-2">
          <div className="bg-card rounded-lg shadow-md p-4 border border-border mb-6">
            <h2 className="text-lg font-semibold text-primary mb-2">Description</h2>
            <p className="text-sm text-gray-400">{contest.description}</p>
          </div>

          <div className="bg-card rounded-lg shadow-md p-4 border border-border mb-6">
            <h2 className="text-lg font-semibold text-primary mb-4 flex items-center">
              <Code2 className="w-5 h-5 mr-2" />
              Problem
            </h2>
            {problem ? (
              <div
                className={`flex items-center justify-between p-3 rounded-lg ${contestEnded || restricted
                    ? "bg-gray-700/30 cursor-not-allowed"
                    : "bg-gray-800/30 hover:bg-gray-800/50 cursor-pointer"
                  } transition-colors`}
                onClick={
                  contestEnded || restricted ? undefined : () => handleProblemClick(problem)
                }
              >
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-foreground">{problem.title}</h3>
                  <p className="text-xs text-gray-400 capitalize">
                    Difficulty: {problem.difficulty}
                  </p>
                </div>
                <button
                  className={`text-xs ${contestEnded || restricted
                      ? "text-gray-500"
                      : "text-blue-400 hover:text-blue-300"
                    }`}
                  disabled={contestEnded || restricted}
                >
                  {contestEnded
                    ? "Contest Ended"
                    : restricted
                      ? "Register to Solve"
                      : "Solve Now"}
                </button>
              </div>
            ) : (
              <p className="text-sm text-gray-400 italic">No problem available for this contest.</p>
            )}
            {restricted && !contestEnded && (
              <p className="text-sm text-yellow-400 mt-4">
                You must register for this contest to solve the problem. Go back to the contests page to register.
              </p>
            )}
          </div>

          {problem && (
            <div className="bg-card rounded-lg shadow-md p-4 border border-border">
              <h2 className="text-lg font-semibold text-primary mb-4 flex items-center">
                <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
                Top Participants (Based on Latest Submissions)
              </h2>
              {topParticipantsError ? (
                <p className="text-sm text-red-400 italic">{topParticipantsError}</p>
              ) : topParticipants.length === 0 ? (
                <p className="text-sm text-gray-400 italic">No submissions yet for this problem.</p>
              ) : (
                <ul className="space-y-2">
                  {topParticipants.map((participant, index) => (
                    <li
                      key={participant.userId}
                      className="flex justify-between items-center p-2 bg-gray-100 dark:bg-gray-800 rounded-lg"
                    >
                      <div>
                        <span className="font-medium">{index + 1}. {participant.userName}</span>
                        <p className="text-xs text-gray-400">
                          Submitted: {new Date(participant.submittedAt).toLocaleString()}
                        </p>
                      </div>
                      <p className="text-sm text-blue-500">{participant.executionTime} ms</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContestDetailsPage;