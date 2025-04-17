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

interface Submission {
  userId: string;
  userName: string;
  executionTime: number;
  submittedAt: string;
}

interface Contest {
  _id: string;
  title: string;
  startTime: string;
  endTime: string;
  problems: Problem[];
  participants: Participant[];
  latestSubmissions: { [problemId: string]: Submission[] };
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

  // Helper to get the latest submission's execution time for a participant and problem
  const getExecutionTime = (userId: string, problemId: string): string => {
    const submissions = contest.latestSubmissions[problemId] || [];
    const submission = submissions.find((sub) => sub.userId === userId);
    return submission ? `${submission.executionTime} ms` : "N/A";
  };

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

      <div className="grid grid-cols-1 gap-6">
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
                    to={`/user/problems/${problem.slug}`}
                    className="text-blue-500 hover:underline"
                  >
                    {problem.title}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Participants and Submissions Section */}
        <div className="bg-card rounded-lg shadow-md p-4 border border-border">
          <h2 className="text-lg font-semibold text-primary mb-4 flex items-center">
            <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
            Participants & Latest Submissions
          </h2>
          {contest.participants.length === 0 ? (
            <p className="text-sm text-gray-400 italic">No participants registered for this contest.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">Participant</th>
                    {contest.problems.map((problem) => (
                      <th key={problem._id} scope="col" className="px-6 py-3">
                        <Link
                          to={`/problems/${problem.slug}`}
                          className="text-blue-500 hover:underline"
                        >
                          {problem.title}
                        </Link>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {contest.participants.map((participant) => (
                    <tr
                      key={participant._id}
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                        {participant.userName}
                      </td>
                      {contest.problems.map((problem) => (
                        <td key={problem._id} className="px-6 py-4">
                          {getExecutionTime(participant._id, problem._id)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContestResultsPage;