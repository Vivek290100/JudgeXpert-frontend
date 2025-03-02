import React, { useState, useEffect, useRef, useMemo } from "react"; // Add useRef
import { useNavigate } from "react-router-dom";
import { apiRequest } from "@/utils/axios/ApiRequest";
import { Unlock, Lock, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

interface ProblemsResponse {
  problems: IProblem[];
  total: number;
  totalPages: number;
  currentPage: number;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: ProblemsResponse;
}

interface IProblem {
  id: string;
  _id: string;
  title: string;
  slug: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  status: "premium" | "free";
  updatedAt: string;
}

const ProblemsList: React.FC = () => {
  const navigate = useNavigate();
  const [problems, setProblems] = useState<IProblem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(() => {
    // Load search query from localStorage on mount
    return localStorage.getItem("searchQuery") || "";
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;
  const { theme } = useTheme();
  const searchInputRef = useRef<HTMLInputElement>(null); // Ref for input

  const fetchProblems = async (page: number) => {
    setLoading(true);
    try {
      const response = await apiRequest<ApiResponse>(
        "get",
        `/problems/problems?page=${page}&limit=${itemsPerPage}&search=${encodeURIComponent(
          searchQuery
        )}`
      );

      console.log("rrrrrrrrrrrr", response);

      if (response.success) {
        const normalizedProblems = response.data.problems.map(
          (problem: any) => ({
            id: problem._id.toString(),
            _id: problem._id.toString(),
            title: problem.title || "Untitled",
            slug: problem.slug || "",
            difficulty: problem.difficulty || "MEDIUM",
            status: problem.status || "free",
            createdAt: problem.createdAt || "",
            updatedAt: problem.updatedAt || "",
          })
        );
        setProblems(normalizedProblems);
        setTotalPages(response.data.totalPages || 1);
        setCurrentPage(response.data.currentPage || 1);
      } else {
        setError(
          "Invalid response structure: " + (response.message || "Unknown error")
        );
      }
    } catch (err) {
      console.error("Failed to fetch problems:", err);
      setError("Failed to fetch problems");
    } finally {
      setLoading(false);
    }
  };

  // Fetch problems when currentPage or searchQuery changes
  useEffect(() => {
    fetchProblems(currentPage);
  }, [currentPage]);

  // Auto-focus on mount and after refresh if there's a search query
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  // Persist searchQuery to localStorage whenever it changes
  const filteredProblems = useMemo(() => {
    return problems.filter(
      (problem) =>
        problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        problem.slug.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [problems, searchQuery]);

  const handleUpdateStatus = async (
    problemId: string,
    currentStatus: "premium" | "free"
  ) => {
    try {
      const newStatus = currentStatus === "premium" ? "free" : "premium";
      await apiRequest<ApiResponse>("put", `/problems/${problemId}/status`, {
        status: newStatus,
      });
      fetchProblems(currentPage);
    } catch (error) {
      console.error("Failed to update problem status:", error);
      setError("Failed to update problem status");
    }
  };

  const handleRowClick = (problemId: string) => {
    navigate(`/admin/problems/${problemId}`);
  };

  const renderPaginationButtons = () => {
    let buttons = [];
    const maxVisibleButtons = window.innerWidth < 640 ? 3 : 5;
    let startPage = Math.max(
      1,
      currentPage - Math.floor(maxVisibleButtons / 2)
    );
    let endPage = Math.min(totalPages, startPage + maxVisibleButtons - 1);

    if (endPage - startPage + 1 < maxVisibleButtons) {
      startPage = Math.max(1, endPage - maxVisibleButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
            currentPage === i
              ? theme === "dark"
                ? "bg-gray-600 text-white border-gray-600"
                : "bg-gray-300 text-black border-gray-300"
              : theme === "dark"
              ? "hover:bg-gray-700 text-gray-200 border-gray-600"
              : "hover:bg-gray-200 text-gray-900 border-gray-200"
          }`}
        >
          {i}
        </button>
      );
    }
    return buttons;
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mx-auto px-4 py-9 min-h-screen flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-semibold text-primary">Problems List</h1>
        <div className="relative w-full sm:w-72">
          <input
            ref={searchInputRef} // Attach ref to input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (searchInputRef.current) {
                searchInputRef.current.focus(); // Keep focus while typing
              }
            }}
            placeholder="Search by title or slug..."
            className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border bg-background border-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
        </div>
      </div>

      <div className="flex-1 overflow-hidden rounded-lg border border-background shadow">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-background border-b border-forground">
                <th className="px-4 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">
                  S.No
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">
                  ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">
                  Title
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider hidden sm:table-cell">
                  Slug
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">
                  Difficulty
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">
                  Created At
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-background divide-y border-gray-600">
              {filteredProblems.map((problem, index) => (
                <tr
                  key={problem.id}
                  onClick={() => handleRowClick(problem.id)}
                  className={`transition-colors cursor-pointer ${
                    theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-200"
                  }`}
                >
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-forground">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-forground max-w-[100px] truncate">
                    {problem._id}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-forground">
                    {problem.title}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-forground hidden sm:table-cell max-w-[200px] truncate">
                    {problem.slug}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">
                    <span
                      className={`text-${
                        problem.difficulty === "EASY"
                          ? "green"
                          : problem.difficulty === "MEDIUM"
                          ? "orange"
                          : "red"
                      }-600`}
                    >
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
                        problem.status === "premium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {problem.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUpdateStatus(problem.id, problem.status);
                      }}
                      className={`p-2 rounded-lg transition-colors ${
                        problem.status === "premium"
                          ? "bg-green-600 hover:bg-green-700 text-white"
                          : "bg-yellow-700 hover:bg-yellow-700 text-white"
                      }`}
                    >
                      {problem.status === "premium" ? (
                        <Unlock className="w-4 h-4" />
                      ) : (
                        <Lock className="w-4 h-4" />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 flex justify-center items-center gap-2">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
          className={`p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed border transition-colors ${
            theme === "dark"
              ? "hover:bg-gray-700 border-gray-600"
              : "hover:bg-gray-200 border-gray-200"
          }`}
        >
          <ChevronLeft
            className={`w-4 h-4 ${
              theme === "dark" ? "text-gray-200" : "text-gray-900"
            }`}
          />
        </button>
        {renderPaginationButtons()}
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(totalPages, prev + 1))
          }
          disabled={currentPage === totalPages}
          className={`p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed border transition-colors ${
            theme === "dark"
              ? "hover:bg-gray-700 border-gray-600"
              : "hover:bg-gray-200 border-gray-200"
          }`}
        >
          <ChevronRight
            className={`w-4 h-4 ${
              theme === "dark" ? "text-gray-200" : "text-gray-900"
            }`}
          />
        </button>
      </div>
    </div>
  );
};

export default ProblemsList;