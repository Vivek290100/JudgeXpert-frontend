import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { apiRequest } from "@/utils/axios/ApiRequest";
import { Trophy, AlertCircle, Clock } from "lucide-react";
import { ContestDetailsSkeleton } from "@/utils/SkeletonLoader";

interface Problem {
  _id: string;
  title: string;
  slug: string;
}

interface Participant {
  _id: string;
  userName: string;
}

interface Contest {
  _id: string;
  title: string;
  startTime: string;
  endTime: string;
  problems: Problem[];
  participants: Participant[];
}

const ContestResultsPage: React.FC = () => {
  const { contestId } = useParams<{ contestId: string }>();
  const [contest, setContest] = useState<Contest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContestDetails = async () => {
      if (!contestId) {
        setError("Invalid contest ID");
        setLoading(false);
        return;
      }

      try {
        // Fetch contest details with problems and participants
        const contestResponse = await apiRequest<{ success: boolean; data: { contest: Contest } }>(
          "get",
          `/contests/${contestId}`
        );

        if (contestResponse.success && contestResponse.data.contest) {
          setContest(contestResponse.data.contest);
        } else {
          setError("Failed to load contest details");
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch contest details. Please try again.");
        console.error("Fetch contest error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchContestDetails();
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary">{contest.title} - Details</h1>
        <Link
          to={`/user/contests/${contest._id}`}
          className="text-blue-500 hover:underline text-sm"
        >
          ← Back to Contest
        </Link>
      </div>

      <div className="bg-card rounded-lg shadow-md p-4 border border-border mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-primary mb-2">Contest Information</h2>
            <div className="text-sm text-gray-400 space-y-1">
              <p className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                <span>Start: {formatDate(contest.startTime)}</span>
              </p>
              <p className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                <span>End: {formatDate(contest.endTime)}</span>
              </p>
              <p>Problems: {contest.problems.length}</p>
              <p>Participants: {contest.participants.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Problems Section */}
        <div className="bg-card rounded-lg shadow-md p-4 border border-border">
          <h2 className="text-lg font-semibold text-primary mb-4 flex items-center">
            <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
            Problems
          </h2>
          {contest.problems.length === 0 ? (
            <p className="text-sm text-gray-400 italic">No problems available for this contest.</p>
          ) : (
            <ul className="space-y-2">
              {contest.problems.map((problem) => (
                <li
                  key={problem._id}
                  className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg"
                >
                  <Link
                    to={`/problems/${problem.slug}`}
                    className="text-blue-500 hover:underline"
                  >
                    {problem.title}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Participants Section */}
        <div className="bg-card rounded-lg shadow-md p-4 border border-border">
          <h2 className="text-lg font-semibold text-primary mb-4 flex items-center">
            <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
            Participants
          </h2>
          {contest.participants.length === 0 ? (
            <p className="text-sm text-gray-400 italic">No participants registered for this contest.</p>
          ) : (
            <ul className="space-y-2">
              {contest.participants.map((participant) => (
                <li
                  key={participant._id}
                  className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg"
                >
                  <span className="font-medium">{participant.userName}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContestResultsPage;