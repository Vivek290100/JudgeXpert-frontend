import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "@/utils/axios/ApiRequest";
import { Search, Plus } from "lucide-react";
import Table from "../layout/Table";
import Pagination from "../layout/Pagination";
import { useDebounce } from "@/hooks/useDebounce";
import { lazy, Suspense } from "react";
import { TableSkeleton } from "@/utils/SkeletonLoader";

const ProcessProblemModal = lazy(() => import("./ProcessProblemModal"));

interface IProblem {
  isBlocked: boolean;
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
        console.log("Fetched problems:", response.data.problems);
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

  const handleRowClick = (problem: IProblem) => {
    navigate(`/admin/problems/${problem._id}`);
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

  const columns = [
    { key: "slug", header: "Slug", className: "max-w-[200px] truncate" },
    { key: "_id", header: "ID", className: "max-w-[100px] truncate" },
    { key: "title", header: "Title" },
    {
      key: "difficulty",
      header: "Difficulty",
      render: (problem: IProblem) => (
        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getDifficultyColor(problem.difficulty)}`}>
          {problem.difficulty}
        </span>
      ),
    },
    {
      key: "updatedAt",
      header: "Updated At",
      render: (problem: IProblem) =>
        new Date(problem.updatedAt).toLocaleString("en-US", {
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
      header: "Access",
      render: (problem: IProblem) => (
        <span
          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
            problem.status === "premium"
              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
              : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
          }`}
        >
          {problem.status.charAt(0).toUpperCase() + problem.status.slice(1)}
        </span>
      ),
    },
    {
      key: "isBlocked",
      header: "Status", // Updated from "Blocked" to "Status"
      render: (problem: IProblem) => {
        const isActive = !problem.isBlocked;
        return (
          <span
            className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
              isActive
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
            }`}
          >
            {isActive ? "Active" : "Inactive"}
          </span>
        );
      },
    },
  ];

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
            onClick={() => setIsProcessModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-accent text-accent-foreground px-3 py-2 text-sm rounded-lg hover:bg-opacity-90 transition-colors w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Process New Problem</span>
          </button>
        </div>
      </div>

      <div className="flex-1">
        <Table
          data={problems}
          columns={columns}
          onRowClick={handleRowClick}
          emptyMessage="No problems found"
        />
      </div>

      <div className="mt-6">
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>

      <Suspense fallback={<div>Loading Process Modal...</div>}>
        <ProcessProblemModal
          isOpen={isProcessModalOpen}
          onClose={() => setIsProcessModalOpen(false)}
          onSuccess={() => fetchProblems(currentPage)}
        />
      </Suspense>
    </div>
  );
};

export default ProblemsList;
