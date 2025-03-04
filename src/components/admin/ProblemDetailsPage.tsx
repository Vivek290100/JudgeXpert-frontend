// src/components/admin/ProblemDetailsPage.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import { apiRequest } from "@/utils/axios/ApiRequest";
import Pagination from "../layout/Pagination";
import { ProblemDetailsSkeleton } from "@/utils/SkeletonLoader";

interface DefaultCode {
  _id: string;
  languageId: number;
  languageName: string;
  code: string;
  status: string;
}

interface TestCase {
  _id: string;
  input: string;
  output: string;
  index: number;
}

interface IProblem {
  _id: string;
  title: string;
  slug: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  status: "premium" | "free";
  updatedAt: string;
  description: string;
  defaultCodeIds: DefaultCode[];
  testCaseIds: TestCase[];
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

const ProblemDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [problem, setProblem] = useState<IProblem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedCode, setExpandedCode] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<"EASY" | "MEDIUM" | "HARD">("MEDIUM");
  const [testCasePage, setTestCasePage] = useState(1);
  const testCasesPerPage = 10;

  useEffect(() => {
    const fetchProblem = async () => {
      setLoading(true);
      try {
        const response = await apiRequest<ApiResponse<{ problem: IProblem }>>(
          "get",
          `/admin/problems/${id}`
        );
        if (response.success) {
          setProblem(response.data.problem);
          setDifficulty(response.data.problem.difficulty);
        } else {
          setError(response.message || "Failed to fetch problem details");
        }
      } catch (err) {
        console.error("Failed to fetch problem:", err);
        setError("Failed to fetch problem details");
      } finally {
        setLoading(false);
      }
    };
    fetchProblem();
  }, [id]);

  const toggleCode = (codeId: string) => {
    setExpandedCode(expandedCode === codeId ? null : codeId);
  };

  const handleDifficultyChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDifficulty = e.target.value as "EASY" | "MEDIUM" | "HARD";
    setDifficulty(newDifficulty);
    try {
      const response = await apiRequest<ApiResponse<{ problem: IProblem }>>(
        "patch",
        `/admin/problems/${id}`,
        { difficulty: newDifficulty }
      );
      if (response.success) {
        setProblem((prev) => (prev ? { ...prev, difficulty: newDifficulty } : null));
      } else {
        setError("Failed to update difficulty");
      }
    } catch (err) {
      console.error("Failed to update difficulty:", err);
      setError("Failed to update difficulty");
    }
  };

  const handleBack = () => {
    navigate("/admin/problems");
  };

  if (loading) return <ProblemDetailsSkeleton/>;
  if (error) return <div>{error}</div>;
  if (!problem) return <div>Problem not found</div>;

  const paginatedTestCases = problem.testCaseIds.slice(
    (testCasePage - 1) * testCasesPerPage,
    testCasePage * testCasesPerPage
  );
  const totalTestCasePages = Math.ceil(problem.testCaseIds.length / testCasesPerPage);

  return (
    <div className="container mx-auto px-4 py-9 min-h-screen bg-background">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-primary tracking-tight">{problem.title}</h1>
        <button
          onClick={handleBack}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
        >
          <X className="w-6 h-6 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200" />
        </button>
      </div>

      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong className="font-semibold text-primary">ID:</strong> {problem._id}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong className="font-semibold text-primary">Slug:</strong> {problem.slug}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong className="font-semibold text-primary">Difficulty:</strong>{" "}
              <select
                value={difficulty}
                onChange={handleDifficultyChange}
                className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded p-1 text-sm"
              >
                <option value="EASY">EASY</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HARD">HARD</option>
              </select>
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong className="font-semibold text-primary">Status:</strong>{" "}
              <span
                className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                  problem.status === "premium" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"
                }`}
              >
                {problem.status}
              </span>
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong className="font-semibold text-primary">Updated At:</strong>{" "}
              {new Date(problem.updatedAt).toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-primary mb-2">Description</h3>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow-inner text-forground text-sm whitespace-pre-wrap">
            {problem.description}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-primary mb-3">Default Codes</h3>
          {problem.defaultCodeIds.length > 0 ? (
            <div className="space-y-3">
              {problem.defaultCodeIds.map((code) => (
                <div
                  key={code._id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() => toggleCode(code._id)}
                    className="w-full flex justify-between items-center p-4 bg-gray-100 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                  >
                    <span className="text-sm font-medium text-primary">
                      {code.languageName} (ID: {code.languageId})
                    </span>
                    {expandedCode === code._id ? (
                      <ChevronUp className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    )}
                  </button>
                  {expandedCode === code._id && (
                    <div className="p-4 bg-gray-50 dark:bg-gray-800">
                      <pre className="text-sm text-forground bg-gray-100 dark:bg-gray-900 p-3 rounded-lg whitespace-pre-wrap">
                        {code.code}
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400 italic">No default codes available</p>
          )}
        </div>

        <div>
          <h3 className="text-xl font-semibold text-primary mb-3">Test Cases</h3>
          {problem.testCaseIds.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-forground border border-gray-200 dark:border-gray-700 rounded-lg">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-900">
                    <th className="px-4 py-2 text-left font-medium text-primary">ID</th>
                    <th className="px-4 py-2 text-left font-medium text-primary">Input</th>
                    <th className="px-4 py-2 text-left font-medium text-primary">Output</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedTestCases.map((test) => (
                    <tr
                      key={test._id}
                      className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <td className="px-4 py-2 truncate max-w-[150px]">{test._id}</td>
                      <td className="px-4 py-2">
                        <pre className="bg-gray-100 dark:bg-gray-900 p-2 rounded">{test.input}</pre>
                      </td>
                      <td className="px-4 py-2">
                        <pre className="bg-gray-100 dark:bg-gray-900 p-2 rounded">{test.output}</pre>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-4">
                <Pagination
                  currentPage={testCasePage}
                  totalPages={totalTestCasePages}
                  onPageChange={setTestCasePage}
                />
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400 italic">No test cases available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProblemDetailsPage;