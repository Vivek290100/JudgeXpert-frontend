import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { apiRequest } from "@/utils/axios/ApiRequest";
import { Trophy, AlertCircle } from "lucide-react";
import { ContestDetailsSkeleton } from "@/utils/SkeletonLoader";

interface Problem {
  _id: string;
  title: string;
}

interface Contest {
  _id: string;
  title: string;
  problems: Problem[];
}

interface TopParticipant {
  userId: string;
  userName: string;
  executionTime: number;
  submittedAt: string;
}

interface ProblemResults {
  problemId: string;
  problemTitle: string;
  topParticipants: TopParticipant[];
  error?: string;
}

const ContestResultsPage: React.FC = () => {
  const { contestId } = useParams<{ contestId: string }>();
  const [contest, setContest] = useState<Contest | null>(null);
  const [results, setResults] = useState<ProblemResults[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContestAndResults = async () => {
      if (!contestId) {
        setError("Invalid contest ID");
        setLoading(false);
        return;
      }

      try {
        const contestResponse = await apiRequest<{ success: boolean; data: { contest: Contest } }>(
          "get",
          `/contests/${contestId}`
        );
        console.log("Contest Response:", contestResponse);

        if (contestResponse.success && contestResponse.data.contest) {
          setContest(contestResponse.data.contest);

          const resultsPromises = contestResponse.data.contest.problems.map(async (problem) => {
            const query = new URLSearchParams();
            query.append("problemId", problem._id);
            query.append("contestId", contestId);
            try {
              const response = await apiRequest<{ success: boolean; data: { topParticipants: TopParticipant[] } }>(
                "get",
                `/problems/top-participants?${query.toString()}`
              );
              console.log("Top Participants Response:", response);
              if (response.success) {
                return {
                  problemId: problem._id,
                  problemTitle: problem.title,
                  topParticipants: response.data.topParticipants,
                } as ProblemResults;
              } else {
                console.warn(`Failed to fetch top participants for problem ${problem._id}: ${response.success}`);
                return {
                  problemId: problem._id,
                  problemTitle: problem.title,
                  topParticipants: [] as TopParticipant[],
                  error: "Failed to fetch top participants",
                } as ProblemResults;
              }
            } catch (err: any) {
              console.warn(`Top participants fetch error for problem ${problem._id}:`, err);
              if (err.response?.data?.message === "Problem not found") {
                return null;
              }
              return {
                problemId: problem._id,
                problemTitle: problem.title,
                topParticipants: [] as TopParticipant[],
                error: err.response?.data?.message || "Failed to fetch top participants",
              } as ProblemResults;
            }
          });

          const resultsData = (await Promise.all(resultsPromises)).filter((result): result is ProblemResults => result !== null);
          setResults(resultsData);
        } else {
          setError("Failed to load contest details");
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch contest results. Please try again.");
        console.error("Fetch contest results error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchContestAndResults();
  }, [contestId]);

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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary">{contest.title} - Results</h1>
        <Link
          to={`/user/contests/${contest._id}`}
          className="text-blue-500 hover:underline text-sm"
        >
          ← Back to Contest
        </Link>
      </div>

      <div className="bg-card rounded-lg shadow-md p-4 border border-border">
        <h2 className="text-lg font-semibold text-primary mb-4 flex items-center">
          <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
          Leaderboard
        </h2>
        {results.length === 0 ? (
          <p className="text-sm text-gray-400 italic">No results available for this contest.</p>
        ) : (
          <div className="space-y-6">
            {results.map((problemResult) => (
              <div key={problemResult.problemId}>
                <h3 className="text-md font-medium text-foreground mb-3">{problemResult.problemTitle}</h3>
                {problemResult.error ? (
                  <p className="text-sm text-red-400 italic">{problemResult.error}</p>
                ) : problemResult.topParticipants.length === 0 ? (
                  <p className="text-sm text-gray-400 italic">No submissions for this problem.</p>
                ) : (
                  <ul className="space-y-2">
                    {problemResult.topParticipants.map((participant, index) => (
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
                        <p className="text-sm text-blue-500">
                          {participant.executionTime} ms
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContestResultsPage;