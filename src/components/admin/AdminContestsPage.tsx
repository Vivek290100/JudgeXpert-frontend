import React, { useState, useEffect, useRef } from "react";
import { apiRequest } from "@/utils/axios/ApiRequest.ts";
import { Search, Plus, X, AlertCircle } from "lucide-react";
import { ApiResponse } from "@/types/ProblemTypes";
import AddContestForm from "./AddContestForm";
import Table from "../layout/Table";
import Pagination from "../layout/Pagination";
import { useDebounce } from "@/hooks/useDebounce";
import { TableSkeleton } from "@/utils/SkeletonLoader";
import { Contest } from "@/types/ContestType";



const AdminContestsPage: React.FC = () => {
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedContest, setSelectedContest] = useState<Contest | null>(null);
  const itemsPerPage = 10;
  const searchInputRef = useRef<HTMLInputElement>(null);

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
      >(
        "get",
        `/admin/contests?page=${currentPage}&limit=${itemsPerPage}&search=${encodeURIComponent(debouncedSearchQuery)}`
      );
      if (response.success && response.data && Array.isArray(response.data.contests)) {
        const validContests = response.data.contests.filter(
          (contest): contest is Contest => contest && typeof contest._id === "string"
        );
        setContests(validContests);
        setTotalPages(response.data.totalPages || 1);
      } else {
        setError(response.message || "Failed to load contests");
        setContests([]);
      }
    } catch (err) {
      setError("Failed to fetch contests. Please try again.");
      console.error(err);
      setContests([]);
    } finally {
      setLoading(false);
      searchInputRef.current?.focus();
    }
  };

  useEffect(() => {
    fetchContests();
  }, [currentPage, debouncedSearchQuery]);

  const handleContestCreated = (newContest: Contest) => {
    if (!newContest || !newContest._id) {
      console.error("Invalid contest data:", newContest);
      return;
    }
    setContests((prev) => {
      const updatedContests = [...prev, newContest];
      return updatedContests.filter(
        (contest, index, self) => index === self.findIndex((c) => c._id === contest._id)
      );
    });
    setIsModalOpen(false);
    setTimeout(fetchContests, 1000);
  };

  const handleStatusChange = async (contestId: string, isBlocked: boolean) => {
    try {
      const response = await apiRequest<ApiResponse<{ message: string; data: Contest }>>(
        "put",
        `/admin/contests/${contestId}`,
        { isBlocked }
      );
      if (response.success) {
        setContests((prev) =>
          prev.map((c) => (c._id === contestId ? { ...c, isBlocked } : c))
        );
        setSelectedContest((prev) => (prev && prev._id === contestId ? { ...prev, isBlocked } : prev));
      } else {
        setError(response.message || "Failed to update contest status");
      }
    } catch (err) {
      setError("Failed to update contest status. Please try again.");
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "upcoming":
        return "bg-purple-100 text-purple-800";
      case "ended":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toUpperCase()) {
      case "EASY":
        return "bg-green-100 text-green-800";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800";
      case "HARD":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const columns = [
    { key: "_id", header: "ID", className: "max-w-[100px] truncate" },
    { key: "title", header: "Title", className: "max-w-[200px] truncate" },
    {
      key: "startTime",
      header: "Start Time",
      render: (contest: Contest) =>
        new Date(contest.startTime).toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
    },
    {
      key: "endTime",
      header: "End Time",
      render: (contest: Contest) =>
        new Date(contest.endTime).toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
    },
    {
      key: "status",
      header: "Status",
      render: (contest: Contest) => {
        const status = getContestStatus(contest.startTime, contest.endTime);
        return (
          <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        );
      },
    },
    {
      key: "participants",
      header: "Participants",
      render: (contest: Contest) => contest.participants.length,
    },
    {
      key: "problems",
      header: "Problems",
      render: (contest: Contest) => contest.problems.length,
    },
    {
      key: "isBlocked",
      header: "Access",
      render: (contest: Contest) => (
        <span
          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
            contest.isBlocked ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
          }`}
        >
          {contest.isBlocked ? "Blocked" : "Active"}
        </span>
      ),
    },
  ];

  const handleRowClick = (contest: Contest) => {
    setSelectedContest(contest);
    setIsDetailsModalOpen(true);
  };

  if (loading && !contests.length) {
    return <TableSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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
    <div className="container mx-auto px-4 py-9 min-h-screen flex flex-col bg-background">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-semibold text-primary">Contest Management</h1>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-72">
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by title..."
              className="w-full pl-10 pr-10 py-2 text-sm rounded-lg border bg-background border-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
            {loading ? (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <svg className="animate-spin h-5 w-5 text-gray-500" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z" />
                </svg>
              </div>
            ) : (
              searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setCurrentPage(1);
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              )
            )}
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-accent text-accent-foreground px-3 py-2 text-sm rounded-lg hover:bg-opacity-90 transition-colors w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Create Contest</span>
          </button>
        </div>
      </div>

      <div className="flex-1">
        <Table
          data={contests}
          columns={columns}
          onRowClick={handleRowClick}
          emptyMessage="No contests found"
        />
      </div>

      {totalPages > 1 && (
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 w-full max-w-3xl relative animate-fade-in-up shadow-2xl">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-800"
            >
              ✕
            </button>
            <h2 className="text-xl font-bold text-white mb-6">Create New Contest</h2>
            <AddContestForm onContestCreated={handleContestCreated} onClose={() => setIsModalOpen(false)} />
          </div>
        </div>
      )}

      {isDetailsModalOpen && selectedContest && (
        <div className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 w-full max-w-3xl max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-primary tracking-tight truncate max-w-[80%]">
                {selectedContest.title}
              </h2>
              <button
                onClick={() => setIsDetailsModalOpen(false)}
                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors duration-200"
                aria-label="Close modal"
              >
                <X className="w-6 h-6 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200" />
              </button>
            </div>

            <div className="p-6 flex-1 overflow-y-auto space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-primary mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
                  Contest Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <strong className="font-semibold text-primary w-24 shrink-0">ID:</strong>
                      <span className="font-mono bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded text-sm text-gray-600 dark:text-gray-400 truncate w-full">
                        {selectedContest._id}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <strong className="font-semibold text-primary w-24 shrink-0">Start Time:</strong>
                      <span className="font-mono bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded text-sm text-gray-600 dark:text-gray-400 truncate w-full">
                        {new Date(selectedContest.startTime).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <strong className="font-semibold text-primary w-24 shrink-0">End Time:</strong>
                      <span className="font-mono bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded text-sm text-gray-600 dark:text-gray-400 truncate w-full">
                        {new Date(selectedContest.endTime).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <strong className="font-semibold text-primary w-24 shrink-0">Status:</strong>
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          getContestStatus(selectedContest.startTime, selectedContest.endTime)
                        )}`}
                      >
                        {getContestStatus(selectedContest.startTime, selectedContest.endTime).charAt(0).toUpperCase() +
                          getContestStatus(selectedContest.startTime, selectedContest.endTime).slice(1)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <strong className="font-semibold text-primary w-24 shrink-0">Access:</strong>
                      <select
                        value={selectedContest.isBlocked ? "inactive" : "active"}
                        onChange={(e) => handleStatusChange(selectedContest._id, e.target.value === "inactive")}
                        className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded p-1 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors w-full max-w-xs"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-primary mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
                  Description
                </h3>
                <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg shadow-inner text-sm text-foreground whitespace-pre-wrap">
                  {selectedContest.description}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-primary mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
                  Problems
                </h3>
                {selectedContest.problems.length > 0 ? (
                  <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                    <table className="w-full text-sm text-foreground">
                      <thead>
                        <tr className="bg-gray-100 dark:bg-gray-900">
                          <th className="px-4 py-3 text-left font-medium text-primary">Problem ID</th>
                          <th className="px-4 py-3 text-left font-medium text-primary">Title</th>
                          <th className="px-4 py-3 text-left font-medium text-primary">Difficulty</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedContest.problems.map((problem) => (
                          <tr
                            key={problem._id}
                            className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                          >
                            <td className="px-4 py-3">
                              <span className="font-mono bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded text-sm text-gray-600 dark:text-gray-400 truncate w-full">
                                {problem._id}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-sm text-foreground">{problem.title}</span>
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                                  problem.difficulty
                                )}`}
                              >
                                {problem.difficulty}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400 italic">No problems assigned to this contest</p>
                )}
              </div>

              <div>
                <h3 className="text-xl font-semibold text-primary mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
                  Participants
                </h3>
                {selectedContest.participants.length > 0 ? (
                  <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                    <table className="w-full text-sm text-foreground">
                      <thead>
                        <tr className="bg-gray-100 dark:bg-gray-900">
                          <th className="px-4 py-3 text-left font-medium text-primary">User ID</th>
                          <th className="px-4 py-3 text-left font-medium text-primary">Username</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedContest.participants.map((user) => (
                          <tr
                            key={user._id}
                            className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                          >
                            <td className="px-4 py-3">
                              <span className="font-mono bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded text-sm text-gray-600 dark:text-gray-400 truncate w-full">
                                {user._id}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-sm text-foreground">{user.userName}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400 italic">No participants registered for this contest</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminContestsPage;