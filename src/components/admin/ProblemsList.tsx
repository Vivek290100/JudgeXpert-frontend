// src/components/admin/ProblemsList.tsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "@/utils/axios/ApiRequest";
import { Unlock, Lock, Search, Plus } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { TableSkeleton } from "@/utils/SkeletonLoader";
import { lazy, Suspense } from "react";
import Pagination from "../layout/Pagination";
import { useDebounce } from "@/hooks/useDebounce";

const ProcessProblemModal = lazy(() => import("./ProcessProblemModal"));

interface IProblem {
  id: string;
  _id: string;
  title: string;
  slug: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  status: "premium" | "free";
  updatedAt: string;
  description: string;
  defaultCodeIds: { _id: string; languageId: number; languageName: string; code: string; status: string }[];
  testCaseIds: { _id: string; input: string; output: string; index: number }[];
}

interface ProblemsResponse {
  problems: IProblem[];
  total: number;
  totalPages: number;
  currentPage: number;
}

interface ApiResponse<T = ProblemsResponse> {
  success: boolean;
  message: string;
  data: T;
}

const ProblemsList: React.FC = () => {
  const [problems, setProblems] = useState<IProblem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isProcessModalOpen, setIsProcessModalOpen] = useState(false);
  const itemsPerPage = 10;
  const { theme } = useTheme();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const fetchProblems = async (page: number, query: string = "") => {
    setLoading(true);
    try {
      const response = await apiRequest<ApiResponse<ProblemsResponse>>(
        "get",
        `/admin/problems?page=${page}&limit=${itemsPerPage}&search=${encodeURIComponent(query)}`
      );
      if (response.success) {
        setProblems(response.data.problems);
        setTotalPages(response.data.totalPages);
        setCurrentPage(response.data.currentPage);
      } else {
        setError(response.message || "Invalid response structure");
      }
    } catch (err) {
      console.error("Failed to fetch problems:", err);
      setError("Failed to fetch problems");
    } finally {
      setLoading(false);
      searchInputRef.current?.focus();
    }
  };

  useEffect(() => {
    fetchProblems(currentPage, debouncedSearchQuery);
  }, [currentPage, debouncedSearchQuery]);

  const handleUpdateStatus = async (problemId: string, currentStatus: "premium" | "free") => {
    const newStatus = currentStatus === "premium" ? "free" : "premium";
    const originalProblems = [...problems];
    setProblems((prevProblems) =>
      prevProblems.map((problem) =>
        problem._id === problemId ? { ...problem, status: newStatus } : problem
      )
    );
    try {
      const response = await apiRequest<ApiResponse<{ problem: IProblem }>>(
        "patch",
        `/admin/problems/${problemId}/status`,
        { status: newStatus }
      );
      if (!response.success) throw new Error(response.message || "Failed to update status");
      setProblems((prevProblems) =>
        prevProblems.map((problem) =>
          problem._id === problemId ? response.data.problem : problem
        )
      );
    } catch (err) {
      console.error("Failed to update status:", err);
      setError("Failed to update problem status");
      setProblems(originalProblems);
    }
  };

  const handleRowClick = (problem: IProblem) => {
    navigate(`/admin/problems/${problem._id}`);
  };

  const handleOpenProcessModal = () => {
    setIsProcessModalOpen(true);
  };

  const closeProcessModal = () => {
    setIsProcessModalOpen(false);
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

  if (loading) return <TableSkeleton />;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mx-auto px-4 py-9 min-h-screen flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-semibold text-primary">Problems List</h1>
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
              placeholder="Search by title or slug..."
              className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border bg-background border-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
          </div>
          <button
            onClick={handleOpenProcessModal}
            className="flex items-center justify-center gap-2 bg-accent text-accent-foreground px-3 py-2 text-sm rounded-lg hover:bg-opacity-90 transition-colors w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Process New Problem</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden rounded-lg border border-background shadow">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-background border-b border-forground">
                <th className="px-4 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">Slug</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">Title</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">Difficulty</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">Updated At</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-background divide-y border-gray-600">
              {problems.map((problem) => (
                <tr
                  key={problem._id}
                  onClick={() => handleRowClick(problem)}
                  className={`transition-colors cursor-pointer ${theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-200"}`}
                >
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-forground max-w-[200px] truncate">{problem.slug}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-forground max-w-[100px] truncate">{problem._id}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-forground">{problem.title}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getDifficultyColor(problem.difficulty)}`}>
                      {problem.difficulty}
                    </span>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-forground">
                    {new Date(problem.updatedAt).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                        problem.status === "premium" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      }`}
                    >
                      {problem.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUpdateStatus(problem._id, problem.status);
                      }}
                      className={`p-2 rounded-lg transition-colors ${
                        problem.status === "premium" ? "bg-green-600 hover:bg-green-700 text-white" : "bg-yellow-600 hover:bg-yellow-700 text-white"
                      }`}
                    >
                      {problem.status === "premium" ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6">
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>

      <Suspense fallback={<div>Loading Process Modal...</div>}>
        <ProcessProblemModal
          isOpen={isProcessModalOpen}
          onClose={closeProcessModal}
          onSuccess={() => fetchProblems(currentPage)}
        />
      </Suspense>
    </div>
  );
};

export default ProblemsList;