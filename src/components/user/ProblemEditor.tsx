import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { apiRequest } from "@/utils/axios/ApiRequest";
import CodeMirror from "@uiw/react-codemirror";
import { cpp } from "@codemirror/lang-cpp";
import { javascript } from "@codemirror/lang-javascript";
import { useTheme } from "@/contexts/ThemeContext";
import { SUPPORTED_LANGUAGES } from "@/utils/Languages";
import { Play, Send, ChevronDown, ChevronUp } from "lucide-react";
import { ProblemEditorSkeleton } from "@/utils/SkeletonLoader";
import toast from "react-hot-toast";
import { IProblem, ProblemApiResponse, SubmissionApiResponse } from "@/types/ProblemTypes";
import { Difficulty } from "@/utils/Enums";
import Discussion from "./Discussion";

const ProblemEditor: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [problem, setProblem] = useState<IProblem | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState(SUPPORTED_LANGUAGES[0].name);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  const [isDiscussionOpen, setIsDiscussionOpen] = useState(false);
  const [testResults, setTestResults] = useState<SubmissionApiResponse["data"]["results"]>([]);
  const { theme } = useTheme();

  useEffect(() => {
    const fetchProblem = async () => {
      if (!slug) {
        setError("No slug provided");
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const response = await apiRequest<ProblemApiResponse>("get", `/problems/${slug}`);
        if (response.success && response.data.problem) {
          const problemData = response.data.problem;
          setProblem(problemData);
          const defaultCode = problemData.defaultCodeIds.find(
            (dc) => dc.languageName.toLowerCase() === selectedLanguage.toLowerCase()
          )?.code;
          setCode(defaultCode || "");
        } else {
          setError(response.message || "Failed to load problem");
        }
      } catch (err) {
        setError("Failed to fetch problem. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProblem();
  }, [slug, selectedLanguage]);

  useEffect(() => {
    if (!problem) return;
    const defaultCode = problem.defaultCodeIds.find(
      (dc) => dc.languageName.toLowerCase() === selectedLanguage.toLowerCase()
    )?.code;
    setCode(defaultCode || "");
    setTestResults([]); // Clear test results when language changes
  }, [selectedLanguage, problem]);

  const getLanguageExtension = () => {
    switch (selectedLanguage.toLowerCase()) {
      case "cpp":
        return cpp();
      case "javascript":
        return javascript();
      case "python":
      case "kotlin":
      case "ruby":
      case "go":
      default:
        return javascript(); // Fallback to JavaScript syntax for unsupported languages
    }
  };

  const handleRun = async () => {
    if (!problem || !problem._id) {
      toast.error("Problem not loaded yet. Please wait.");
      return;
    }
  
    setLoading(true);
    try {
      const languageConfig = SUPPORTED_LANGUAGES.find(
        (lang) => lang.name.toLowerCase() === selectedLanguage.toLowerCase()
      );
      if (!languageConfig) {
        toast.error("Unsupported language");
        return;
      }
  
      console.log("frontend", problem._id, selectedLanguage, languageConfig.version, code, languageConfig.ext);
  
      const response = await apiRequest<SubmissionApiResponse>("post", "/execute", {
        problemId: problem._id,
        language: selectedLanguage, // Use selectedLanguage directly
        version: languageConfig.version,
        code,
        isRunOnly: true,
      });
  
      console.log("gggggggggggggggg", response);
  
      if (response.success) {
        setTestResults(response.data.results);
        const allPassed = response.data.results.every((r) => r.passed);
        toast.success(
          allPassed
            ? "Run successful! First 2 test cases passed."
            : `Run failed: ${response.data.results.filter((r) => !r.passed).length}/2 test cases failed`,
          { duration: 5000, style: { maxWidth: "500px" } }
        );
        console.log("Run details:", response.data.results);
      } else {
        toast.error(response.message || "Run failed.");
      }
    } catch (error) {
      toast.error("An error occurred during run.");
      console.error("Run error:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSubmit = async () => {
    if (!problem || !problem._id) {
      toast.error("Problem not loaded yet. Please wait.");
      return;
    }
  
    setLoading(true);
    try {
      const languageConfig = SUPPORTED_LANGUAGES.find(
        (lang) => lang.name.toLowerCase() === selectedLanguage.toLowerCase()
      );
      if (!languageConfig) {
        toast.error("Unsupported language");
        return;
      }
  
      console.log("frontend", problem._id, selectedLanguage, languageConfig.version, code, languageConfig.ext);
  
      const response = await apiRequest<SubmissionApiResponse>("post", "/execute", {
        problemId: problem._id,
        language: selectedLanguage, // Use selectedLanguage directly
        version: languageConfig.version,
        code,
        isRunOnly: false,
      });
  
      if (response.success) {
        setTestResults(response.data.results);
        const allPassed = response.data.results.every((r) => r.passed);
        toast.success(
          allPassed
            ? "Submission successful! All test cases passed."
            : `Submission failed: ${response.data.results.filter((r) => !r.passed).length} test case(s) failed`,
          { duration: 5000, style: { maxWidth: "500px" } }
        );
        console.log("Submission details:", response.data.results);
      } else {
        toast.error(response.message || "Submission failed.");
      }
    } catch (error) {
      toast.error("An error occurred during submission.");
      console.error("Submission error:", error);
    } finally {
      setLoading(false);
    }
  };

  const extractRelevantError = (stderr: string) => {
    if (!stderr) return "Unknown error occurred.";
    const errorLines = stderr.split("\n").filter((line) => line.trim() !== "");
    for (let line of errorLines) {
      if (
        line.includes("ReferenceError") ||
        line.includes("SyntaxError") ||
        line.includes("TypeError")
      ) {
        return line.trim();
      }
    }
    return errorLines[0] || "Unknown error occurred.";
  };

  const formatTestCase = (testCase: any) => {
    if (!testCase || !testCase.inputs || !testCase.outputs) {
      return { input: "N/A", output: "N/A" };
    }
    const inputStr = testCase.inputs
      .map((input: { name: string; value: any }) => `${input.name}: ${JSON.stringify(input.value)}`)
      .join("\n");
    const outputStr = testCase.outputs
      .map((output: { name: string; value: any }) => `${output.name}: ${JSON.stringify(output.value)}`)
      .join("\n");
    return { input: inputStr, output: outputStr };
  };

  if (loading) {
    return <ProblemEditorSkeleton />;
  }

  if (error && !problem) {
    return (
      <div className="flex-1 flex items-center justify-center text-red-500 min-h-screen">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Mobile Description Toggle */}
      <div className="lg:hidden bg-background border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setIsDescriptionOpen(!isDescriptionOpen)}
          className="flex items-center justify-between w-full p-4 text-primary text-sm font-semibold"
        >
          <span className="truncate">Problem Description</span>
          {isDescriptionOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
        {isDescriptionOpen && problem && (
          <div className="p-4 max-h-[40vh] overflow-y-auto">
            <div className="space-y-4">
              <div>
                <span
                  className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${problem.difficulty === Difficulty.EASY
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    : problem.difficulty === Difficulty.MEDIUM
                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                    }`}
                >
                  {problem.difficulty}
                </span>
                <h1 className="text-lg font-bold text-primary mt-2 truncate">{problem.title}</h1>
              </div>
              <div className="prose dark:prose-invert max-w-none text-foreground text-sm">
                <p className="leading-relaxed">{problem.description}</p>
              </div>
              {problem.testCaseIds && problem.testCaseIds.length > 0 && (
                <div className="space-y-4">
                  {problem.testCaseIds.slice(0, 2).map((tc: any, index) => {
                    const formattedTestCase = formatTestCase(tc);
                    return (
                      <div key={tc._id}>
                        <h2 className="text-md font-medium text-primary mb-2">Test Case {index + 1}</h2>
                        <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs">
                          <strong>Input:</strong> <pre className="whitespace-pre-wrap inline">{formattedTestCase.input}</pre>
                        </div>
                        <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded mt-1 text-xs">
                          <strong>Output:</strong> <pre className="whitespace-pre-wrap inline">{formattedTestCase.output}</pre>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Discussion Toggle */}
      <div className="lg:hidden bg-background border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setIsDiscussionOpen(!isDiscussionOpen)}
          className="flex items-center justify-between w-full p-4 text-primary text-sm font-semibold"
        >
          <span className="truncate">Discussion</span>
          {isDiscussionOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
        {isDiscussionOpen && problem && (
          <div className="p-4 max-h-[40vh] overflow-y-auto">
            <Discussion problemId={problem._id} problemTitle={problem.title} />
          </div>
        )}
      </div>

      {/* Main Layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Panel: Problem Description and Discussion (Desktop Only) */}
        <div className="hidden lg:block lg:w-1/3 bg-background border-r border-gray-200 dark:border-gray-700 overflow-y-auto h-screen">
          <div className="p-6 space-y-6">
            <div className="space-y-4">
              <div>
                <h1 className="text-xl font-semibold text-primary truncate">{problem?.title ?? "Loading..."}</h1>
                <span
                  className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium mt-2 ${problem?.difficulty === Difficulty.EASY
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    : problem?.difficulty === Difficulty.MEDIUM
                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                    }`}
                >
                  {problem?.difficulty ?? Difficulty.EASY}
                </span>
              </div>
              <div className="prose dark:prose-invert max-w-none text-foreground text-sm">
                <p className="leading-relaxed">{problem?.description ?? "No description available."}</p>
              </div>
              {problem && problem.testCaseIds && problem.testCaseIds.length > 0 && (
                <div className="space-y-4">
                  {problem.testCaseIds.slice(0, 2).map((tc: any, index) => {
                    const formattedTestCase = formatTestCase(tc);
                    return (
                      <div key={tc._id}>
                        <h2 className="text-lg font-medium text-primary mb-2">Test Case {index + 1}</h2>
                        <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-sm">
                          <strong>Input:</strong> <pre className="whitespace-pre-wrap inline">{formattedTestCase.input}</pre>
                        </div>
                        <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded mt-2 text-sm">
                          <strong>Output:</strong> <pre className="whitespace-pre-wrap inline">{formattedTestCase.output}</pre>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            {problem && <Discussion problemId={problem._id} problemTitle={problem.title} />}
          </div>
        </div>

        {/* Right Panel: Editor and Test Cases */}
        <div className="flex-1 flex flex-col overflow-hidden h-screen">
          {/* Editor Section */}
          <div className="flex flex-col border-b border-gray-200 dark:border-gray-700 flex-1 overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 gap-3 shrink-0">
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full sm:w-32 p-1.5 border rounded bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:border-gray-700"
              >
                {SUPPORTED_LANGUAGES.map((lang, index) => (
                  <option key={index} value={lang.name}>
                    {lang.name.toUpperCase()}
                  </option>
                ))}
              </select>
              <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-end">
                <Link
                  to={`/user/submissions?problemSlug=${slug}`}
                  className="flex items-center gap-1 py-1.5 px-3 rounded text-sm text-white bg-gray-500 hover:bg-gray-600"
                >
                  Submissions
                </Link>
                <button
                  onClick={handleRun}
                  className="flex items-center gap-1 py-1.5 px-3 rounded text-sm text-white bg-green-500 hover:bg-green-600"
                  disabled={loading}
                >
                  <Play className="w-4 h-4" />
                  Run
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex items-center gap-1 py-1.5 px-3 rounded text-sm text-white bg-blue-500 hover:bg-blue-600"
                  disabled={loading}
                >
                  <Send className="w-4 h-4" />
                  Submit
                </button>
              </div>
            </div>
            <CodeMirror
              value={code}
              height="50vh"
              theme={theme === "dark" ? "dark" : "light"}
              extensions={[getLanguageExtension()]}
              onChange={(value) => setCode(value)}
              className="border-t border-gray-200 dark:border-gray-700 overflow-y-auto"
              readOnly={loading}
            />
          </div>

          {/* Test Cases Section */}
          <div
            className={`p-4 ${theme === "dark" ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-900"} overflow-y-auto h-[40vh]`}
          >
            <h3 className="text-sm font-semibold mb-3">Test Results</h3>
            {testResults.length > 0 ? (
              <div className="space-y-4">
                {testResults.map((result, index) => (
                  <div key={index} className="space-y-2">
                    <span className="text-sm font-medium">Case {result.testCaseIndex + 1}</span>
                    <div
                      className={`p-2 rounded text-xs ${result.passed
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        }`}
                    >
                      <strong>Input:</strong> <pre className="whitespace-pre-wrap inline">{result.input}</pre>
                    </div>
                    <div
                      className={`p-2 rounded text-xs ${result.passed
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        }`}
                    >
                      <strong>Expected:</strong> <pre className="whitespace-pre-wrap inline">{result.expectedOutput}</pre>
                    </div>
                    <div
                      className={`p-2 rounded text-xs ${result.passed
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        }`}
                    >
                      <strong>Output:</strong> <pre className="whitespace-pre-wrap inline">{result.actualOutput}</pre>
                    </div>
                    {result.stderr && (
                      <div className="p-2 rounded text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                        <strong>Error:</strong>
                        <pre className="whitespace-pre-wrap inline">{extractRelevantError(result.stderr)}</pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : problem && problem.testCaseIds && problem.testCaseIds.length > 0 ? (
              <div className="space-y-4">
                {problem.testCaseIds.slice(0, 2).map((tc: any, index) => {
                  const formattedTestCase = formatTestCase(tc);
                  return (
                    <div key={tc._id} className="space-y-2">
                      <span className="text-sm font-medium">Test Case {index + 1}</span>
                      <div className="p-2 rounded text-xs bg-gray-200 dark:bg-gray-700">
                        <strong>Input:</strong> <pre className="whitespace-pre-wrap inline">{formattedTestCase.input}</pre>
                      </div>
                      <div className="p-2 rounded text-xs bg-gray-200 dark:bg-gray-700">
                        <strong>Output:</strong> <pre className="whitespace-pre-wrap inline">{formattedTestCase.output}</pre>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No test cases available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemEditor;