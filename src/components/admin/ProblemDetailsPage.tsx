import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import { apiRequest } from "@/utils/axios/ApiRequest";
import Pagination from "../layout/Pagination";
import { ProblemDetailsSkeleton } from "@/utils/SkeletonLoader";
import { IProblem, ProblemApiResponse } from "@/types/ProblemTypes";
import { Difficulty, ProblemStatus } from "@/utils/Enums";

const ProblemDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [problem, setProblem] = useState<IProblem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedCode, setExpandedCode] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.MEDIUM);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [status, setStatus] = useState<ProblemStatus>(ProblemStatus.FREE);
  const [testCasePage, setTestCasePage] = useState(1);
  const testCasesPerPage = 10;

  useEffect(() => {
    const fetchProblem = async () => {
      setLoading(true);
      try {
        const response = await apiRequest<ProblemApiResponse>("get", `/admin/problems/${id}`);
        if (response.success && response.data.problem) {
          setProblem(response.data.problem);
          setDifficulty(response.data.problem.difficulty);
          setIsActive(!response.data.problem.isBlocked);
          setStatus(response.data.problem.status);
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
    const newDifficulty = e.target.value as Difficulty;
    setDifficulty(newDifficulty);
    try {
      const response = await apiRequest<ProblemApiResponse>("patch", `/admin/problems/${id}`, {
        difficulty: newDifficulty,
      });
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

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as ProblemStatus;
    const previousStatus = status;
    setStatus(newStatus);
    try {
      const response = await apiRequest<ProblemApiResponse>("patch", `/admin/problems/${id}/status`, {
        status: newStatus,
      });
      if (!response.success) {
        throw new Error(response.message || "Failed to update status");
      }
      setProblem((prev) => (prev ? { ...prev, status: newStatus } : null));
    } catch (err) {
      console.error("Failed to update status:", err);
      setError("Failed to update problem status");
      setStatus(previousStatus);
    }
  };

  const handleActiveChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value === "true";
    const previousStatus = isActive;
    setIsActive(newStatus); // Optimistic update
    try {
      const endpoint = newStatus ? "unblock" : "block";
      const response = await apiRequest<ProblemApiResponse>("patch", `/admin/problems/${id}/${endpoint}`, {}); // Ensure empty object as payload
      console.log("API Response:", response); // Debug the response
    } catch (err) {
      console.error(`Failed to ${newStatus ? "activate" : "deactivate"} problem:`, err);
      setError(`Failed to ${newStatus ? "activate" : "deactivate"} problem: ${err}`);
      setIsActive(previousStatus); // Revert on failure
    }
  };

  const handleBack = () => {
    navigate("/admin/problems");
  };

  if (loading) return <ProblemDetailsSkeleton />;
  if (error) return <div className="text-center text-red-500 p-6 text-lg">{error}</div>;
  if (!problem) return <div className="text-center text-gray-500 dark:text-gray-400 p-6 text-lg">Problem not found</div>;

  const paginatedTestCases = problem.testCaseIds.slice(
    (testCasePage - 1) * testCasesPerPage,
    testCasePage * testCasesPerPage
  );
  const totalTestCasePages = Math.ceil(problem.testCaseIds.length / testCasesPerPage);

  // Format input and output values for display
  const formatTestCase = (testCase: any) => ({
    input: testCase.inputs.map((input: any) => `${input.name}: ${input.value}`).join('\n'),
    output: testCase.outputs.map((output: any) => `${output.name}: ${output.value}`).join('\n'),
  });

  return (
    <div className="container mx-auto px-4 py-9 min-h-screen bg-background">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8 bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <h1 className="text-3xl font-bold text-primary tracking-tight truncate max-w-[80%]">{problem.title}</h1>
        <button
          onClick={handleBack}
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors duration-200"
          aria-label="Back to problems"
        >
          <X className="w-6 h-6 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200" />
        </button>
      </div>

      {/* Main Content */}
      <div className="space-y-8">
        {/* Problem Info Card */}
        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-primary mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">
            Problem Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <strong className="font-semibold text-primary w-24 shrink-0">ID:</strong>
                <span className="font-mono bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded text-sm text-gray-600 dark:text-gray-400 truncate w-full">
                  {problem._id}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <strong className="font-semibold text-primary w-24 shrink-0">Slug:</strong>
                <span className="font-mono bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded text-sm text-gray-600 dark:text-gray-400 truncate w-full">
                  {problem.slug}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <strong className="font-semibold text-primary w-24 shrink-0">Difficulty:</strong>
                <select
                  value={difficulty}
                  onChange={handleDifficultyChange}
                  className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded p-1 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors w-full max-w-xs"
                >
                  <option value={Difficulty.EASY}>{Difficulty.EASY}</option>
                  <option value={Difficulty.MEDIUM}>{Difficulty.MEDIUM}</option>
                  <option value={Difficulty.HARD}>{Difficulty.HARD}</option>
                </select>
              </div>
              <div className="flex items-center gap-3">
                <strong className="font-semibold text-primary w-24 shrink-0">Active:</strong>
                <select
                  value={isActive.toString()}
                  onChange={handleActiveChange}
                  className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded p-1 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors w-full max-w-xs"
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <strong className="font-semibold text-primary w-24 shrink-0">Status:</strong>
                <select
                  value={status}
                  onChange={handleStatusChange}
                  className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded p-1 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors w-full max-w-xs"
                >
                  <option value={ProblemStatus.FREE}>{ProblemStatus.FREE}</option>
                  <option value={ProblemStatus.PREMIUM}>{ProblemStatus.PREMIUM}</option>
                </select>
              </div>
              <div className="flex items-center gap-3">
                <strong className="font-semibold text-primary w-24 shrink-0">Updated At:</strong>
                <span className="font-mono bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded text-sm text-gray-600 dark:text-gray-400 truncate w-full">
                  {new Date(problem.updatedAt).toLocaleString("en-US", {
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
          </div>
        </div>

        {/* Description Section */}
        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-primary mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
            Description
          </h3>
          <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg shadow-inner text-sm text-foreground whitespace-pre-wrap">
            {problem.description}
          </div>
        </div>

        {/* Default Codes Section */}
        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-primary mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
            Default Codes
          </h3>
          {problem.defaultCodeIds.length > 0 ? (
            <div className="space-y-4">
              {problem.defaultCodeIds.map((code) => (
                <div
                  key={code._id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm"
                >
                  <button
                    onClick={() => toggleCode(code._id)}
                    className="w-full flex justify-between items-center p-4 bg-gray-100 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors duration-200"
                  >
                    <span className="text-sm font-medium text-primary truncate">
                      {code.languageName} (ID: {code._id})
                    </span>
                    {expandedCode === code._id ? (
                      <ChevronUp className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    )}
                  </button>
                  {expandedCode === code._id && (
                    <div className="p-4 bg-gray-50 dark:bg-gray-800">
                      <pre className="text-sm text-foreground bg-gray-100 dark:bg-gray-900 p-3 rounded-lg shadow-inner whitespace-pre-wrap">
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

        {/* Test Cases Section */}
        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-primary mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
            Test Cases
          </h3>
          {problem.testCaseIds.length > 0 ? (
            <div className="space-y-4">
              <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                <table className="w-full text-sm text-foreground">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-900">
                      <th className="px-4 py-3 text-left font-medium text-primary">Input</th>
                      <th className="px-4 py-3 text-left font-medium text-primary">Output</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedTestCases.map((testCase) => {
                      const formattedTestCase = formatTestCase(testCase);
                      return (
                        <tr
                          key={testCase._id}
                          className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                          <td className="px-4 py-3">
                            <pre className="bg-gray-100 dark:bg-gray-900 p-2 rounded text-sm whitespace-pre-wrap">
                              {formattedTestCase.input}
                            </pre>
                          </td>
                          <td className="px-4 py-3">
                            <pre className="bg-gray-100 dark:bg-gray-900 p-2 rounded text-sm whitespace-pre-wrap">
                              {formattedTestCase.output}
                            </pre>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-center">
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