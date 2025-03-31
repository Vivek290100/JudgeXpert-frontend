import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "@/utils/axios/ApiRequest";
import Table from "../layout/Table";
import Pagination from "../layout/Pagination";
import Statistics from "./Statistics";
import ProblemFilter from "./ProblemFilter";
import { Menu, X, Search } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { TableSkeleton } from "@/utils/SkeletonLoader";
import { ApiResponse, ProblemsResponse, IProblem, IUserProblemStatus } from "@/types/ProblemTypes";

const ProblemsList: React.FC = () => {
  const [problems, setProblems] = useState<IProblem[]>([]);
  const [userProblemStatus, setUserProblemStatus] = useState<IUserProblemStatus[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<{ difficulty?: string; status?: string }>({ difficulty: "", status: "" });
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const itemsPerPage = 10;
  const navigate = useNavigate();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const fetchProblems = async (
    page: number,
    filters: { difficulty?: string; status?: string } = {},
    query: string = ""
  ) => {
    setLoading(true);
    try {
      let url = `/problems?page=${page}&limit=${itemsPerPage}`;
      if (filters.difficulty) url += `&difficulty=${filters.difficulty}`;
      if (filters.status) {
        if (filters.status === "SOLVED") url += "&solved=true";
        else if (filters.status === "NOT_SOLVED") url += "&solved=false";
        else if (filters.status === "PREMIUM") url += "&status=premium";
        else if (filters.status === "FREE") url += "&status=free";
      }
      if (query) url += `&search=${encodeURIComponent(query)}`;

      const response = await apiRequest<ApiResponse<ProblemsResponse>>("get", url);
      if (response.success && response.data) {
        const filteredProblems = response.data.problems.filter((problem) => !problem.isBlocked);
        setProblems(filteredProblems);
        setUserProblemStatus(response.data.userProblemStatus || []);
        setTotalPages(response.data.totalPages);
        setCurrentPage(response.data.currentPage);
      } else {
        setError(response.message || "Invalid response structure");
      }
    } catch (err) {
      console.error("Failed to fetch problems:", err);
      setError("Failed to fetch problems. Please log in or try again.");
    } finally {
      setLoading(false);
      searchInputRef.current?.focus();
    }
  };

  useEffect(() => {
    fetchProblems(currentPage, filters, debouncedSearchQuery);
  }, [currentPage, debouncedSearchQuery, filters]);

  const handleRowClick = (problem: IProblem) => {
    navigate(`/user/problems/${problem.slug}`);
  };

  const getDifficultyColor = (difficulty: "EASY" | "MEDIUM" | "HARD") => {
    switch (difficulty) {
      case "EASY":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "HARD":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const isProblemSolved = (problemId: string) => {
    const status = userProblemStatus.find((s) => s.problemId === problemId);
    return status?.solved || false;
  };

  const columns = [
    { key: "title", header: "Title" },
    {
      key: "difficulty",
      header: "Difficulty",
      render: (problem: IProblem) => (
        <span
          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
            problem.difficulty
          )}`}
        >
          {problem.difficulty}
        </span>
      ),
    },
    {
      key: "solved",
      header: "Status",
      render: (problem: IProblem) => (
        <span
          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
            isProblemSolved(problem._id)
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
              : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
          }`}
        >
          {isProblemSolved(problem._id) ? "Solved" : "Not Solved"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Premium",
      render: (problem: IProblem) => (
        <span
          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
            problem.status === "premium"
              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
              : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
          }`}
        >
          {problem.status === "premium" ? "Premium" : "Free"}
        </span>
      ),
    },
  ];

  if (loading && !problems.length) return <TableSkeleton />;
  if (error) return <div className="text-red-500 text-center py-4">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-6 min-h-screen flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-semibold text-primary">Problems</h1>
        <div className="relative w-full sm:w-72 flex items-center">
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search problems by title..."
            className="w-full pl-10 pr-10 py-2 text-sm rounded-lg border bg-background border-gray-200 dark:border-gray-700 text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
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
      </div>

      <div className="flex-1 flex gap-6">
        <div
          className={`fixed inset-y-0 left-0 z-50 w-72 bg-background border-r border-gray-200 dark:border-gray-700 transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:relative md:translate-x-0 md:w-72 transition-transform duration-300 ease-in-out shadow-lg`}
        >
          <div className="flex flex-col h-full">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-primary">Filters</h2>
            </div>
            <ProblemFilter
              onFilterChange={(newFilters) => {
                setFilters(newFilters);
                setCurrentPage(1);
              }}
              filters={filters}
            />
            <div className="p-4">
              <button
                onClick={() => {
                  setFilters({ difficulty: "", status: "" });
                  setSearchQuery("");
                  setCurrentPage(1);
                }}
                className="w-full py-2 px-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Clear Filters
              </button>
            </div>
            <div className="flex-1">
              <Statistics problems={problems} userProblemStatus={userProblemStatus} />
            </div>
          </div>
        </div>

        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-4 md:hidden">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 bg-background border border-gray-200 dark:border-gray-700 rounded-lg"
              aria-label="Toggle sidebar"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
          <div className="flex-1">
            {problems.length<1?(
              <div className="text-center text-gray-500">No problems available</div>

            ):(<Table
              data={problems}
              columns={columns}
              onRowClick={handleRowClick}
              emptyMessage="No problems found"
            />)}
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
        </div>
      </div>
    </div>
  );
};

export default ProblemsList;