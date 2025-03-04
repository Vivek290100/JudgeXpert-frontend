// src/components/user/ProblemsList.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "@/utils/axios/ApiRequest";
import { useTheme } from "@/contexts/ThemeContext";
import { TableSkeleton } from "@/utils/SkeletonLoader";
import Pagination from "../layout/Pagination";
import Statistics from "./Statistics";
import ProblemFilter, { FilterProps } from "./ProblemFilter"; // Import FilterProps
import { Menu, X } from "lucide-react";

interface IProblem {
  _id: string;
  title: string;
  slug: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  status: "premium" | "free";
}

interface IUserProblemStatus {
  problemId: string;
  solved: boolean;
}

interface ProblemsResponse {
  problems: IProblem[];
  userProblemStatus: IUserProblemStatus[];
  total: number;
  totalPages: number;
  currentPage: number;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: ProblemsResponse;
}

const ProblemsList: React.FC = () => {
  const [problems, setProblems] = useState<IProblem[]>([]);
  const [userProblemStatus, setUserProblemStatus] = useState<IUserProblemStatus[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for sidebar toggle
  const itemsPerPage = 10;
  const { theme } = useTheme();
  const navigate = useNavigate();

  const fetchProblems = async (page: number, filters: { difficulty?: string; status?: string } = {}) => {
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

      const response = await apiRequest<ApiResponse>("get", url);
      if (response.success) {
        setProblems(response.data.problems);
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
    }
  };

  useEffect(() => {
    fetchProblems(currentPage);
  }, [currentPage]);

  const handleRowClick = (problem: IProblem) => {
    navigate(`/problems/${problem.slug}`);
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

  const handleFilterChange: FilterProps["onFilterChange"] = (filters) => {
    fetchProblems(1, filters); // Reset to page 1 when filters change
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (loading) return <TableSkeleton />;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 min-h-screen flex flex-col">
      <div className=" flex items-center gap-4">
        {/* Hamburger Menu Button (visible on mobile only, at the start of the title) */}
        <button
          onClick={toggleSidebar}
          className="md:hidden p-2 bg-background border border-gray-200 dark:border-gray-700 rounded-lg"
          aria-label="Open menu"
        >
          {isSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>

        {/* Problems Title */}
        {/* <h1 className="text-2xl font-semibold text-primary">Problems</h1> */}
      </div>

      <div className="flex-1 flex overflow-hidden rounded-lg border border-background shadow">
        {/* Sidebar (Filters and Statistics) */}
        <div
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-background border-r border-gray-200 dark:border-gray-900 transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:relative md:translate-x-0 md:flex md:flex-col transition-transform duration-300`}
        >
          <ProblemFilter onFilterChange={handleFilterChange} />
          <Statistics problems={problems} userProblemStatus={userProblemStatus} />
        </div>

        {/* Overlay for Mobile Sidebar */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={toggleSidebar}
          />
        )}

        {/* Problems Table */}
        <div className="flex-1 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-background border-b ">
                  <th className="px-4 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">Title</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">Difficulty</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">Premium</th>
                </tr>
              </thead>
              <tbody className="bg-background divide-y border-gray-600">
                {problems.map((problem) => (
                  <tr
                    key={problem._id}
                    onClick={() => handleRowClick(problem)}
                    className={`transition-colors cursor-pointer ${theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-200"}`}
                  >
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-foreground">{problem.title}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getDifficultyColor(problem.difficulty)}`}
                      >
                        {problem.difficulty}
                      </span>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                          isProblemSolved(problem._id)
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                        }`}
                      >
                        {isProblemSolved(problem._id) ? "Solved" : "Not Solved"}
                      </span>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                          problem.status === "premium"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                            : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        }`}
                      >
                        {problem.status === "premium" ? "Premium" : "Free"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default ProblemsList;