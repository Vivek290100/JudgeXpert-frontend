// Frontend\src\components\user\ContestsPage.tsx
import React, { useState, useEffect } from "react";
import { apiRequest } from "@/utils/axios/ApiRequest";
import { useNavigate } from "react-router-dom";
import { Code2, Users, Calendar, AlertCircle, Activity } from "lucide-react";
import { ApiResponse } from "@/types/ProblemTypes";
import Pagination from "@/components/layout/Pagination";
import { ContestsPageSkeleton } from "@/utils/SkeletonLoader";
import toast from "react-hot-toast";

interface Contest {
  _id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  problems: string[];
  participants: { _id: string; userName: string }[];
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContestId, setSelectedContestId] = useState<string | null>(null);
  const [registeredContests, setRegisteredContests] = useState<Set<string>>(new Set());
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
        console.log("Fetch contests response:", response);

        if (response.success && response.data) {
          const unblockedContests = response.data.contests.filter((contest) => !contest.isBlocked);
          setContests(unblockedContests);
          setTotalPages(response.data.totalPages || 1);
          setTotalContests(response.data.totalContests || 0);
          setActiveContests(response.data.activeContests || 0);
          setUpcomingContests(response.data.upcomingContests || 0);
          setEndedContests(response.data.endedContests || 0);
        } else {
          setError(response.message || "Failed to load contests");
          setContests([]);
        }
      } catch (err) {
        setError("Failed to fetch contests. Please try again.");
        console.error("Fetch contests error:", err);
        setContests([]);
      } finally {
        setLoading(false);
      }
    };
    fetchContests();
  }, [currentPage]);

  useEffect(() => {
    const fetchRegisteredContests = async () => {
      try {
        const response = await apiRequest<ApiResponse<{ contestIds: string[] }>>(
          "get",
          "/user/registered-contests"
        );
        console.log("Registered contests response:", response);
        if (response.success && response.data) {
          setRegisteredContests(new Set(response.data.contestIds));
        }
      } catch (err) {
        console.error("Failed to fetch registered contests:", err);
      }
    };
    fetchRegisteredContests();
  }, []);

  const handleRegisterClick = (contestId: string) => {
    setSelectedContestId(contestId);
    setIsModalOpen(true);
  };

  const handleRegisterConfirm = async () => {
    if (!selectedContestId) return;

    try {
      const response = await apiRequest<
        ApiResponse<{ message: string; user?: { _id: string; userName: string } }>
      >("post", `/contests/${selectedContestId}/register`);
      console.log("Register response:", response);

      if (response.success) {
        toast.success(response.data?.message || "Successfully registered for the contest!");
        setRegisteredContests((prev) => {
          const newSet = new Set(prev);
          newSet.add(selectedContestId);
          return newSet;
        });
        setContests((prev) =>
          prev.map((c) =>
            c._id === selectedContestId && response.data?.user
              ? {
                  ...c,
                  participants: [
                    ...c.participants,
                    { _id: response.data.user._id, userName: response.data.user.userName || "Unknown" },
                  ],
                }
              : c
          )
        );
        setIsModalOpen(false);
        setSelectedContestId(null);
      } else {
        toast.error(response.message || "Failed to register for the contest");
        setError(response.message || "Failed to register");
      }
    } catch (err: any) {
      toast.error(err.message || "Registration failed. Please try again.");
      console.error("Registration error:", err);
      setError(err.message || "Registration failed. Please try again.");
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
              <h2 className="text-lg font-bold mb-3 flex items-center">Contest Statistics</h2>
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
                  const isRegistered = registeredContests.has(contest._id);
                  let statusColor = "";
                  let statusBg = "";
                  let buttonColor = "";
                  let buttonText = "";
                  let statusIcon = null;
                  let isButtonDisabled = false;
                  let tooltipMessage = "";

                  switch (status) {
                    case "active":
                      if (isRegistered) {
                        statusColor = "text-green-400";
                        statusBg = "bg-green-900/20";
                        buttonColor = "bg-green-600 hover:bg-green-700";
                        buttonText = "Join Now";
                        statusIcon = <Activity className="w-3 h-3 mr-1" />;
                        isButtonDisabled = false;
                      } else {
                        statusColor = "text-green-400";
                        statusBg = "bg-green-900/20";
                        buttonColor = "bg-gray-600 cursor-not-allowed";
                        buttonText = "Join Now";
                        statusIcon = <Activity className="w-3 h-3 mr-1" />;
                        isButtonDisabled = true;
                        tooltipMessage = "You must register before the contest starts to join.";
                      }
                      break;
                    case "upcoming":
                      statusColor = "text-purple-400";
                      statusBg = "bg-purple-900/20";
                      buttonColor = isRegistered
                        ? "bg-gray-600 cursor-not-allowed"
                        : "bg-purple-600 hover:bg-purple-700";
                      buttonText = isRegistered ? "Registered" : "Register";
                      statusIcon = <Calendar className="w-3 h-3 mr-1" />;
                      isButtonDisabled = isRegistered;
                      break;
                    case "ended":
                      statusColor = "text-orange-400";
                      statusBg = "bg-orange-900/20";
                      buttonColor = "bg-gray-600 cursor-not-allowed";
                      buttonText = "Ended";
                      statusIcon = <AlertCircle className="w-3 h-3 mr-1" />;
                      isButtonDisabled = true;
                      break;
                  }

                  const durationText = calculateDuration(contest.startTime, contest.endTime);

                  return (
                    <div
                      key={contest._id}
                      className="bg-card backdrop-blur rounded-lg shadow-md border border-gray-700 overflow-hidden transition-all hover:shadow-lg hover:shadow-blue-900/20 hover:border-blue-900/50 group"
                    >
                      <div className="p-4">
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

                        <p className="text-sm font-normal text-gray-400 mb-3 line-clamp-2 min-h-12">
                          {contest.description}
                        </p>

                        <div className="border-t border-gray-700 my-3"></div>

                        <div className="space-y-3 mb-4">
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

                        <div className="relative group/tooltip">
                          <button
                            onClick={() => {
                              if (status === "active" && isRegistered) {
                                navigate(`/user/contests/${contest._id}`);
                              } else if (status === "upcoming" && !isRegistered) {
                                handleRegisterClick(contest._id);
                              } else if (status === "ended") {
                                toast("Contest has ended");
                              }
                            }}
                            className={`w-full py-2 text-sm font-medium rounded-lg text-white ${buttonColor} transition-colors flex items-center justify-center disabled:cursor-not-allowed disabled:opacity-50`}
                            disabled={isButtonDisabled}
                          >
                            {status === "active" && <Activity className="w-4 h-4 mr-2" />}
                            {status === "upcoming" && <Calendar className="w-4 h-4 mr-2" />}
                            {buttonText}
                          </button>
                          {isButtonDisabled && tooltipMessage && (
                            <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover/tooltip:block text-xs text-white bg-gray-800 px-2 py-1 rounded shadow-lg whitespace-nowrap">
                              {tooltipMessage}
                            </span>
                          )}
                        </div>
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

      {/* Modal for Rules and Registration */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg shadow-lg p-6 max-w-lg w-full mx-4">
            <h2 className="text-xl font-semibold text-primary mb-4">Contest Registration</h2>
            <h3 className="text-lg font-medium text-foreground mb-2">Rules and Regulations</h3>
            <ul className="list-disc pl-5 text-sm text-gray-400 mb-6">
              <li>Participants must submit solutions independently.</li>
              <li>Plagiarism or cheating will result in disqualification.</li>
              <li>Submissions must be made before the contest ends.</li>
              <li>Follow the problem constraints and input/output formats.</li>
              <li>Respect the contest schedule and deadlines.</li>
            </ul>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="py-2 px-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleRegisterConfirm}
                className="py-2 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Register
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContestsPage;