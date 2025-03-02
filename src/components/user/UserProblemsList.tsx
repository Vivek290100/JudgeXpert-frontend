import React, { useState, useEffect, useRef } from "react";
import { apiRequest } from "@/utils/axios/ApiRequest";
import { Search, ChevronLeft, ChevronRight, Lock } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useNavigate } from "react-router-dom";

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
  difficulty: "EASY" | "MEDIUM" | "HARD";
  status: "premium" | "free";
  solved: boolean;
  isPremiumUser: boolean;
}

const UserProblemsList: React.FC = () => {
  const navigate = useNavigate();
  const [problems, setProblems] = useState<IProblem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;
  const { theme } = useTheme();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const fetchProblems = async (page: number) => {
    setLoading(true);
    try {
        const response = await apiRequest<ApiResponse>(
            "get",
            `/user/problems?page=${page}&limit=${itemsPerPage}&search=${encodeURIComponent(searchQuery)}`
          );
      if (response.success) {
        const normalizedProblems = response.data.problems.map((problem: any) => ({
          id: problem._id.toString(),
          _id: problem._id.toString(),
          title: problem.title,
          difficulty: problem.difficulty,
          status: problem.status,
          solved: problem.solved || false,
          isPremiumUser: problem.isPremiumUser || false,
        }));
        setProblems(normalizedProblems);
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
    }
  };

  useEffect(() => {
    fetchProblems(currentPage);
  }, [currentPage, searchQuery]);

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  const handleRowClick = (problem: IProblem) => {
    if (problem.status === "premium" && !problem.isPremiumUser) {
      alert("Get Premium to access this problem!");
      return;
    }
    navigate(`/problems/${problem._id}`);
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisibleButtons = window.innerWidth < 640 ? 3 : 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisibleButtons / 2));
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

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-9 min-h-screen flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <h1 className="text-2xl font-semibold text-primary">Problem List</h1>
        <div className="relative w-full sm:w-72">
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title..."
            className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border bg-background border-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
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
                  Q.No
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">
                  Title
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">
                  Difficulty
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">
                  Premium
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-background divide-y border-gray-600">
              {problems.map((problem, index) => (
                <tr
                  key={problem.id}
                  onClick={() => handleRowClick(problem)}
                  className={`transition-colors ${
                    problem.status === "premium" && !problem.isPremiumUser
                      ? "cursor-not-allowed opacity-60"
                      : "cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800"
                  }`}
                >
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-forground">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-forground flex items-center gap-2">
                    {problem.title}
                    {problem.status === "premium" && !problem.isPremiumUser && (
                      <Lock className="w-4 h-4 text-yellow-600" />
                    )}
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
                  <td className="px-4 py-2 whitespace-nowrap text-sm">
                    <span
                      className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                        problem.solved
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {problem.solved ? "Solved" : "Not Solved"}
                    </span>
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
            theme === "dark" ? "hover:bg-gray-700 border-gray-600" : "hover:bg-gray-200 border-gray-200"
          }`}
        >
          <ChevronLeft
            className={`w-4 h-4 ${theme === "dark" ? "text-gray-200" : "text-gray-900"}`}
          />
        </button>
        {renderPaginationButtons()}
        <button
          onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed border transition-colors ${
            theme === "dark" ? "hover:bg-gray-700 border-gray-600" : "hover:bg-gray-200 border-gray-200"
          }`}
        >
          <ChevronRight
            className={`w-4 h-4 ${theme === "dark" ? "text-gray-200" : "text-gray-900"}`}
          />
        </button>
      </div>
    </div>
  );
};

export default UserProblemsList;