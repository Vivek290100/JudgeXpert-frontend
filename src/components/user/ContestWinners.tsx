import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "@/utils/axios/ApiRequest";
import Table from "@/components/layout/Table";
import Pagination from "@/components/layout/Pagination";
import { useTheme } from "@/contexts/ThemeContext";
import { ApiResponse } from "@/types/ProblemTypes";
import { Column } from "@/types/ComponentsTypes";
import { AlertCircle, Users } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/Store";
import { TableSkeleton } from "@/utils/SkeletonLoader";
import { FaMedal } from "react-icons/fa";

interface AuthUser {
  _id: string;
  userName: string;
  profileImage: string;
}

interface Problem {
  _id: string;
  title: string;
  difficulty: string;
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
  slug: string;
  startTime: string;
  endTime: string;
  problems: Problem[];
  participants: Participant[];
  latestSubmissions: { [problemId: string]: Submission[] };
  isActive: boolean;
  isBlocked: boolean;
}

interface LeaderboardEntry extends Participant {
  problemsSolved: number;
  score: number;
  totalExecutionTime: number;
  solvedProblems: { [problemId: string]: number };
}

interface ContestsResponse {
  contests: Contest[];
  totalPages: number;
  totalContests: number;
  activeContests: number;
  upcomingContests: number;
  endedContests: number;
}

interface UserContestStats {
  totalContests: number;
  participatedContests: number;
  contestsWon: number;
  rank: number | undefined;
  score: number | undefined;
  activeContests?: number;
  upcomingContests?: number;
  endedContests?: number;
}

const ContestsWinners: React.FC = () => {
  const { theme } = useTheme();
  const user = useSelector((state: RootState) => state.auth.user) as AuthUser | null;
  const navigate = useNavigate();
  const [contests, setContests] = useState<Contest[]>([]);
  const [winners, setWinners] = useState<{ [contestId: string]: LeaderboardEntry | null }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [userStats, setUserStats] = useState<UserContestStats>({
    totalContests: 0,
    participatedContests: 0,
    contestsWon: 0,
    rank: undefined,
    score: undefined,
  });

  useEffect(() => {
    const fetchContests = async () => {
      setLoading(true);
      try {
        const response = await apiRequest<ApiResponse<ContestsResponse>>(
          "get",
          `/contests?page=${currentPage}&limit=10`
        );
        if (response.success && response.data) {
          const unblockedContests = response.data.contests
            .filter((c) => !c.isBlocked)
            .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
          setContests(unblockedContests);
          setTotalPages(response.data.totalPages);
          setUserStats((prev) => ({
            ...prev,
            totalContests: response.data.totalContests,
            activeContests: response.data.activeContests,
            upcomingContests: response.data.upcomingContests,
            endedContests: response.data.endedContests,
          }));

          const endedContests = unblockedContests.filter(
            (contest) => new Date(contest.endTime) < new Date()
          );
          const winnerPromises = endedContests.map(async (contest) => {
            try {
              const contestResponse = await apiRequest<{
                success: boolean;
                data: { contest: Contest };
              }>("get", `/contests/${contest._id}`);
              if (contestResponse.success && contestResponse.data.contest) {
                const leaderboard = computeLeaderboard(contestResponse.data.contest);
                return { contestId: contest._id, winner: leaderboard[0] || null };
              }
              return { contestId: contest._id, winner: null };
            } catch (err) {
              console.error(`Failed to fetch winner for contest ${contest._id}:`, err);
              return { contestId: contest._id, winner: null };
            }
          });

          const winnerResults = await Promise.all(winnerPromises);
          console.log("Winner Results:", winnerResults);
          const winnersMap = winnerResults.reduce(
            (acc, { contestId, winner }) => ({
              ...acc,
              [contestId]: winner,
            }),
            {}
          );
          setWinners(winnersMap);
        } else {
          setError(response.message || "Failed to load contests");
        }
      } catch (err) {
        setError("Failed to fetch contests. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const fetchUserContestStats = async () => {
      if (!user) {
        setUserStats((prev) => ({
          ...prev,
          participatedContests: 0,
          contestsWon: 0,
        }));
        return;
      }
      try {
        const registeredResponse = await apiRequest<ApiResponse<{ contestIds: string[] }>>(
          "get",
          "/registered-contests"
        );
        if (registeredResponse.success && registeredResponse.data) {
          const participatedContests = registeredResponse.data.contestIds.length;
          setUserStats((prev) => ({
            ...prev,
            participatedContests,
          }));
        }

        const contestsResponse = await apiRequest<ApiResponse<ContestsResponse>>(
          "get",
          `/contests?page=1&limit=1000`
        );
        if (contestsResponse.success && contestsResponse.data) {
          const endedContests = contestsResponse.data.contests.filter(
            (contest) => new Date(contest.endTime) < new Date()
          );
          let contestsWon = 0;
          for (const contest of endedContests) {
            try {
              const contestResponse = await apiRequest<{
                success: boolean;
                data: { contest: Contest };
              }>("get", `/contests/${contest._id}`);
              if (contestResponse.success && contestResponse.data.contest) {
                const leaderboard = computeLeaderboard(contestResponse.data.contest);
                if (leaderboard[0]?.userName && user.userName && leaderboard[0].userName === user.userName) {
                  contestsWon++;
                }
              }
            } catch (err) {
              console.error(`Failed to fetch contest ${contest._id}:`, err);
            }
          }
          setUserStats((prev) => ({
            ...prev,
            contestsWon,
          }));
        }
      } catch (err) {
        console.error("Failed to fetch user contest stats:", err);
        setUserStats((prev) => ({
          ...prev,
          participatedContests: 0,
          contestsWon: 0,
        }));
      }
    };

    fetchContests();
    fetchUserContestStats();
  }, [currentPage, user]);

  const computeLeaderboard = (contest: Contest): LeaderboardEntry[] => {
    return contest.participants
      .map((participant) => {
        let problemsSolved = 0;
        let score = 0;
        let totalExecutionTime = 0;
        const solvedProblems: { [problemId: string]: number } = {};

        contest.problems.forEach((problem) => {
          const submissions = contest.latestSubmissions[problem._id] || [];
          const submission = submissions.find((sub) => sub.userId === participant._id);
          if (submission) {
            problemsSolved++;
            const difficultyMultiplier = getDifficultyMultiplier(problem.difficulty);
            score += 100 * difficultyMultiplier;
            totalExecutionTime += submission.executionTime;
            solvedProblems[problem._id] = submission.executionTime;
          }
        });

        return {
          ...participant,
          problemsSolved,
          score,
          totalExecutionTime,
          solvedProblems,
        };
      })
      .filter((participant) => participant.problemsSolved > 0)
      .sort((a, b) => {
        if (b.problemsSolved !== a.problemsSolved) return b.problemsSolved - a.problemsSolved;
        if (b.score !== a.score) return b.score - a.score;
        return a.totalExecutionTime - b.totalExecutionTime;
      })
      .slice(0, 1);
  };

  const getDifficultyMultiplier = (difficulty: string): number => {
    switch (difficulty.toUpperCase()) {
      case "EASY": return 1;
      case "MEDIUM": return 2;
      case "HARD": return 3;
      default: return 1;
    }
  };

  const getContestStatus = (contest: Contest): string => {
    const now = new Date();
    const start = new Date(contest.startTime);
    const end = new Date(contest.endTime);
    if (now < start) return "Upcoming";
    if (now <= end) return "Active";
    return "Completed";
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const truncateContestName = (title: string, maxLength: number = 15): string => {
    if (title.length <= maxLength) return title;
    return title.slice(0, maxLength) + "...";
  };

  const renderWinnerBadge = (contestId: string) => {
    const winner = winners[contestId];
    if (!winner) return <span className="text-gray-500">None</span>;
    return (
      <div className="flex items-center">
        <FaMedal className="w-4 h-4 mr-1 text-yellow-500" />
        <span className="text-gray-900 dark:text-white">{winner.userName}</span>
      </div>
    );
  };

  const columns: Column<Contest>[] = [
    {
      key: "title",
      header: "Contest",
      render: (item: Contest) => (
        <span title={item.title} className="text-gray-900 dark:text-white font-medium">
          {truncateContestName(item.title)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item: Contest) => {
        const status = getContestStatus(item);
        return (
          <span
            className={`text-xs font-medium px-2 py-1 rounded ${
              status === "Active"
                ? "bg-green-100 text-green-800"
                : status === "Completed"
                ? "bg-gray-100 text-gray-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {status}
          </span>
        );
      },
    },
    {
      key: "startTime",
      header: "Start Time",
      render: (item: Contest) => formatDate(item.startTime),
    },
    {
      key: "endTime",
      header: "End Time",
      render: (item: Contest) => formatDate(item.endTime),
    },
    {
      key: "problems",
      header: "Problems",
      render: (item: Contest) => item.problems.length,
    },
    {
      key: "participants",
      header: "Participants",
      render: (item: Contest) => item.participants.length,
    },
    {
      key: "winner",
      header: "Winner",
      render: (item: Contest) =>
        getContestStatus(item) === "Completed" ? renderWinnerBadge(item._id) : <span className="text-gray-500">N/A</span>,
    },
  ];

  const handleRowClick = (item: Contest) => {
    if (getContestStatus(item) === "Completed") {
      navigate(`/user/contests/${item._id}`);
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const progressPercentage =
    Math.round((userStats.participatedContests / userStats.totalContests) * 100) || 0;

  if (loading) {
    return <TableSkeleton />;
  }

  if (error) {
    return (
      <div className="p-6 text-red-500 flex items-center justify-center">
        <AlertCircle className="w-6 h-6 mr-2" />
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-64 flex flex-col gap-4">
            <div className="bg-card rounded-lg shadow-md p-4 border border-border">
              <h2 className="text-lg font-bold mb-3 flex items-center gap-3">
                {user ? (
                  <img
                    src={user.profileImage}
                    alt="Profile"
                    className="w-8 h-8 rounded-full border-2 object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full border-2 bg-gray-200 dark:bg-gray-700" />
                )}
                Contest Participation
              </h2>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Participation</span>
                <span className="text-sm font-medium">
                  {userStats.participatedContests}/{userStats.totalContests}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-4">
                <div
                  className="bg-blue-500 h-2.5 rounded-full"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                <div className="flex flex-col items-center p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <span className="text-xs text-blue-800 dark:text-blue-300">Total Contests</span>
                  <span className="text-sm font-semibold text-blue-800 dark:text-blue-300">
                    {userStats.totalContests}
                  </span>
                </div>
                <div className="flex flex-col items-center p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <span className="text-xs text-green-800 dark:text-green-300">Participated</span>
                  <span className="text-sm font-semibold text-green-800 dark:text-green-300">
                    {userStats.participatedContests}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="bg-card rounded-lg shadow-md border border-border">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h2 className="text-lg font-bold flex items-center">
                  <Users className="w-5 h-5 mr-2 text-blue-500" />
                  Global Contests
                </h2>
              </div>
              <div className="p-4">
                <Table<Contest>
                  data={contests}
                  columns={columns}
                  onRowClick={handleRowClick}
                  emptyMessage="No contests available"
                  rowClassName={
                    theme === "dark"
                      ? "text-white cursor-pointer hover:bg-gray-800"
                      : "text-gray-900 cursor-pointer hover:bg-gray-100"
                  }
                />
                {totalPages > 1 && (
                  <div className="mt-6">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                      maxVisibleButtons={5}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContestsWinners;