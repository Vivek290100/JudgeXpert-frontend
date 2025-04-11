import React, { useState, useEffect } from "react";
import { apiRequest } from "@/utils/axios/ApiRequest";
import { useNavigate } from "react-router-dom";
import { Code2, Users, Calendar, AlertCircle, Activity } from "lucide-react";
import { ApiResponse } from "@/types/ProblemTypes";
import Pagination from "@/components/layout/Pagination";
import { ContestsPageSkeleton } from "@/utils/SkeletonLoader";

interface Contest {
  _id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  problems: string[];
  participants: string[];
  isActive: boolean;
  isBlocked: boolean;
}

const ContestsPage: React.FC = () => {
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "active" | "upcoming" | "ended">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalContests, setTotalContests] = useState(0);
  const [activeContests, setActiveContests] = useState(0);
  const [upcomingContests, setUpcomingContests] = useState(0);
  const [endedContests, setEndedContests] = useState(0);
  const itemsPerPage = 9;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContests = async () => {
      setLoading(true);
      try {
        const response = await apiRequest<
          ApiResponse<{
            contests: Contest[];
            totalPages: number;
            currentPage: number;
            totalContests: number;
            activeContests: number;
            upcomingContests: number;
            endedContests: number;
          }>
        >("get", `/contests?page=${currentPage}&limit=${itemsPerPage}`);
        if (response.success) {
          const unblockedContests = response.data.contests.filter((contest) => !contest.isBlocked);
          setContests(unblockedContests);
          setTotalPages(response.data.totalPages);
          setTotalContests(response.data.totalContests);
          setActiveContests(response.data.activeContests);
          setUpcomingContests(response.data.upcomingContests);
          setEndedContests(response.data.endedContests);
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
    fetchContests();
  }, [currentPage]);

  const handleRegister = async (contestId: string) => {
    try {
      const response = await apiRequest<ApiResponse<{ message: string }>>(
        "post",
        `/contests/${contestId}/register`
      );
      if (response.success) {
        alert(response.data.message);
        setContests((prev) =>
          prev.map((c) =>
            c._id === contestId ? { ...c, participants: [...c.participants, "userId"] } : c
          )
        );
      } else {
        setError(response.message || "Failed to register");
      }
    } catch (err) {
      setError("Registration failed. Please try again.");
      console.error(err);
    }
  };

  const getContestStatus = (startTime: string, endTime: string) => {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (now < start) return "upcoming";
    if (now >= start && now <= end) return "active";
    return "ended";
  };

  const calculateDuration = (startTime: string, endTime: string): string => {
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);
    const durationMs = endDate.getTime() - startDate.getTime();
    const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
    const durationMins = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${durationHours}h ${durationMins}m`;
  };

  const filteredContests = contests.filter((contest) => {
    if (filter === "all") return true;
    const status = getContestStatus(contest.startTime, contest.endTime);
    return status === filter;
  });

  if (loading) {
    return <ContestsPageSkeleton />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 flex items-center justify-center h-screen">
        <div className="bg-red-50 text-red-600 p-6 rounded-lg max-w-lg flex items-center shadow-lg">
          <AlertCircle className="w-8 h-8 mr-4" />
          <div>
            <h3 className="text-lg font-semibold mb-1">Error</h3>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 flex flex-col">
      <nav className="flex items-center justify-between py-4">
        <h1 className="text-xl sm:text-2xl font-semibold text-primary">Contests</h1>
      </nav>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-72 flex-shrink-0 mb-6 lg:mb-0">
          <div className="flex flex-col gap-6">
            <div className="bg-card rounded-lg shadow-md p-4 border border-border">
              <h2 className="text-lg font-semibold text-primary mb-4">Filters</h2>
              <div className="space-y-2">
                <button
                  onClick={() => setFilter("all")}
                  className={`w-full text-left px-4 py-2 font-medium text-sm rounded-lg ${
                    filter === "all"
                      ? "text-blue-400 bg-blue-900/20"
                      : "text-gray-400 hover:text-gray-300"
                  }`}
                >
                  All Contests
                </button>
                <button
                  onClick={() => setFilter("active")}
                  className={`w-full text-left px-4 py-2 font-medium text-sm rounded-lg ${
                    filter === "active"
                      ? "text-green-400 bg-green-900/20"
                      : "text-gray-400 hover:text-gray-300"
                  }`}
                >
                  Active
                </button>
                <button
                  onClick={() => setFilter("upcoming")}
                  className={`w-full text-left px-4 py-2 font-medium text-sm rounded-lg ${
                    filter === "upcoming"
                      ? "text-purple-400 bg-purple-900/20"
                      : "text-gray-400 hover:text-gray-300"
                  }`}
                >
                  Upcoming
                </button>
                <button
                  onClick={() => setFilter("ended")}
                  className={`w-full text-left px-4 py-2 font-medium text-sm rounded-lg ${
                    filter === "ended"
                      ? "text-orange-400 bg-orange-900/20"
                      : "text-gray-400 hover:text-gray-300"
                  }`}
                >
                  Ended
                </button>
              </div>
              <button
                onClick={() => setFilter("all")}
                className="w-full mt-4 py-2 px-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Clear Filters
              </button>
            </div>

            <div className="bg-card rounded-lg shadow-md p-4 border border-border">
              <h2 className="text-lg font-bold mb-3 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-blue-500" />
                Contest Statistics
              </h2>
              <div className="grid grid-cols-2 gap-2 sm:gap-4">
                <div className="flex flex-col items-center p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <span className="text-xs text-blue-800 dark:text-blue-300">Total</span>
                  <span className="text-sm font-semibold text-blue-800 dark:text-blue-300">
                    {totalContests}
                  </span>
                </div>
                <div className="flex flex-col items-center p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <span className="text-xs text-blue-800 dark:text-blue-300">Active</span>
                  <span className="text-sm font-semibold text-blue-800 dark:text-blue-300">
                    {activeContests}
                  </span>
                </div>
                <div className="flex flex-col items-center p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <span className="text-xs text-blue-800 dark:text-blue-300">Upcoming</span>
                  <span className="text-sm font-semibold text-blue-800 dark:text-blue-300">
                    {upcomingContests}
                  </span>
                </div>
                <div className="flex flex-col items-center p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                  <span className="text-xs text-blue-800 dark:text-blue-300">Ended</span>
                  <span className="text-sm font-semibold text-blue-800 dark:text-blue-300">
                    {endedContests}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1">
          {filteredContests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Calendar className="w-16 h-16 text-gray-600 mb-4" />
              <h3 className="text-xl font-medium text-gray-300 mb-2">No contests found</h3>
              <p className="text-gray-500 max-w-md">
                {filter !== "all"
                  ? `There are no ${filter} contests at the moment.`
                  : "No contests available yet."}
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredContests.map((contest) => {
                  const status = getContestStatus(contest.startTime, contest.endTime);
                  let statusColor = "";
                  let statusBg = "";
                  let buttonColor = "";
                  let buttonText = "";
                  let statusIcon = null;

                  switch (status) {
                    case "active":
                      statusColor = "text-green-400";
                      statusBg = "bg-green-900/20";
                      buttonColor = "bg-green-600 hover:bg-green-700";
                      buttonText = "Join Now";
                      statusIcon = <Activity className="w-3 h-3 mr-1" />;
                      break;
                    case "upcoming":
                      statusColor = "text-purple-400";
                      statusBg = "bg-purple-900/20";
                      buttonColor = "bg-purple-600 hover:bg-purple-700";
                      buttonText = "Register";
                      statusIcon = <Calendar className="w-3 h-3 mr-1" />;
                      break;
                    case "ended":
                      statusColor = "text-orange-400";
                      statusBg = "bg-orange-900/20";
                      buttonColor = "bg-gray-600 cursor-not-allowed";
                      buttonText = "Ended";
                      statusIcon = <AlertCircle className="w-3 h-3 mr-1" />;
                      break;
                  }

                  const durationText = calculateDuration(contest.startTime, contest.endTime);

                  return (
                    <div
                      key={contest._id}
                      className="bg-card backdrop-blur rounded-lg shadow-md border border-gray-700 overflow-hidden transition-all hover:shadow-lg hover:shadow-blue-900/20 hover:border-blue-900/50 group"
                    >
                      <div className="p-4">
                        {/* Title and Status Badge */}
                        <div className="flex justify-between items-start mb-3">
                          <h2 className="text-base font-semibold text-foreground group-hover:text-blue-400 transition-colors line-clamp-1 flex-1 pr-2">
                            {contest.title}
                          </h2>
                          <div
                            className={`px-2 py-1 rounded-full text-xs font-medium flex items-center ${statusColor} ${statusBg}`}
                          >
                            {statusIcon}
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-sm font-normal text-gray-400 mb-3 line-clamp-2 min-h-12">
                          {contest.description}
                        </p>

                        {/* Divider */}
                        <div className="border-t border-gray-700 my-3"></div>

                        {/* Contest Info */}
                        <div className="space-y-3 mb-4">
                          {/* Times */}
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="flex flex-col">
                              <span className="text-gray-400 mb-1">Start</span>
                              <span className="text-foreground font-medium">
                                {new Date(contest.startTime).toLocaleString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: true,
                                })}
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-gray-400 mb-1">End</span>
                              <span className="text-foreground font-medium">
                                {new Date(contest.endTime).toLocaleString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: true,
                                })}
                              </span>
                            </div>
                          </div>

                          {/* Stats Row */}
                          <div className="flex justify-between text-xs font-medium p-2 bg-gray-800/50 rounded-lg">
                            <div className="flex items-center">
                              <div className="flex items-center mr-3">
                                <Users className="w-4 h-4 mr-1 text-purple-400" />
                                <span>{contest.participants.length}</span>
                              </div>
                              <div className="flex items-center">
                                <Code2 className="w-4 h-4 mr-1 text-yellow-400" />
                                <span>{contest.problems.length}</span>
                              </div>
                            </div>
                            <div className="flex items-center text-blue-300">
                              <Calendar className="w-4 h-4 mr-1" />
                              <span>{durationText}</span>
                            </div>
                          </div>
                        </div>

                        {/* Action Button */}
                        <button
                          onClick={() => {
                            if (status === "active") {
                              navigate(`/user/contests/${contest._id}`);
                            } else if (status === "upcoming") {
                              handleRegister(contest._id);
                            } else {
                              alert("Contest has ended");
                            }
                          }}
                          className={`w-full py-2 text-sm font-medium rounded-lg text-white ${buttonColor} transition-colors flex items-center justify-center`}
                          disabled={status === "ended"}
                        >
                          {status === "active" && <Activity className="w-4 h-4 mr-2" />}
                          {status === "upcoming" && <Calendar className="w-4 h-4 mr-2" />}
                          {buttonText}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
              {totalPages > 1 && (
                <div className="mt-4 mb-6">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContestsPage;