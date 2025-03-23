import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { apiRequest } from "@/utils/axios/ApiRequest";
import CodeMirror from "@uiw/react-codemirror";
import { cpp } from "@codemirror/lang-cpp";
import { javascript } from "@codemirror/lang-javascript";
import { rust } from "@codemirror/lang-rust";
import { useTheme } from "@/contexts/ThemeContext";
import { SUPPORTED_LANGUAGES } from "@/config/Languages";
import { Play, Send, ChevronDown, ChevronUp } from "lucide-react";
import { ProblemEditorSkeleton } from "@/utils/SkeletonLoader";
import toast from "react-hot-toast";
import { IProblem, ProblemApiResponse, SubmissionApiResponse } from "@/types/ProblemTypes";
import { Difficulty } from "@/utils/Enums";

const ProblemEditor: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [problem, setProblem] = useState<IProblem | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState(SUPPORTED_LANGUAGES[0].name);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  const { theme } = useTheme();

  // Fetch problem data from the database
  useEffect(() => {
    const fetchProblem = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const response = await apiRequest<ProblemApiResponse>("get", `/problems/${slug}`);
        if (response.success) {
          const problemData = response.data.problem;
          setProblem(problemData);
          const defaultCode = problemData.defaultCodeIds.find(
            (dc) => dc.languageName.toLowerCase() === selectedLanguage.toLowerCase()
          );
          setCode(defaultCode?.code || "");
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

  // Language extension for CodeMirror
  const getLanguageExtension = () => {
    switch (selectedLanguage.toLowerCase()) {
      case "cpp":
        return cpp();
      case "js":
      case "javascript":
        return javascript();
      case "rust":
        return rust();
      default:
        return javascript();
    }
  };

  const handleSubmit = async () => {
    if (!problem) {
      toast.error("Problem not loaded yet. Please wait.");
      return;
    }

    try {
      const response = await apiRequest<SubmissionApiResponse>("post", "/execute", {
        problemId: problem._id,
        code,
        language: selectedLanguage.toLowerCase(),
      });

      console.log("SubmissionApiResponse", response);

      if (response.success) {
        const { result, details } = response.data;
        if (result === "Accepted") {
          toast.success("Submission successful! All test cases passed.");
        } else {
          toast.error(`Submission failed: ${result}`, {
            duration: 5000,
            style: { maxWidth: "500px" },
          });
          console.log("Submission details:", details);
        }
      } else {
        toast.error(response.message || "Submission failed.");
      }
    } catch (error) {
      toast.error("An error occurred during submission.");
      console.error("Submission error:", error);
    }
  };

  if (loading) {
    return <ProblemEditorSkeleton />;
  }

  if (error && !problem) {
    return (
      <div className="flex-1 flex items-center justify-center text-red-500 h-[calc(100vh-5rem)]">
        {error}
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-5rem)] flex flex-col lg:flex-row overflow-hidden">
      {/* Mobile Description Toggle */}
      <div className="lg:hidden bg-background border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setIsDescriptionOpen(!isDescriptionOpen)}
          className="flex items-center justify-between w-full p-4 text-primary text-sm font-semibold"
        >
          <span>{problem?.title || "Loading..."}</span>
          {isDescriptionOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
        {isDescriptionOpen && problem && (
          <div className="p-4 max-h-[30vh] overflow-y-auto">
            <div className="space-y-4">
              <div>
                <span
                  className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                    problem.difficulty === Difficulty.EASY
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : problem.difficulty === Difficulty.MEDIUM
                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                  }`}
                >
                  {problem.difficulty}
                </span>
                <h1 className="text-lg font-bold text-primary mt-2">{problem.title}</h1>
              </div>
              <div className="prose dark:prose-invert max-w-none text-foreground text-sm">
                <p className="leading-relaxed">{problem.description}</p>
              </div>
              {problem.testCaseIds?.slice(0, 2).length > 0 && (
                <div className="space-y-4">
                  {problem.testCaseIds.slice(0, 2).map((tc, index) => (
                    <div key={tc._id}>
                      <h2 className="text-md font-medium text-primary mb-2">Test Case {index + 1}</h2>
                      <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs">
                        <strong>Input:</strong> <pre className="whitespace-pre-wrap inline">{tc.input}</pre>
                      </div>
                      <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded mt-1 text-xs">
                        <strong>Output:</strong> <pre className="whitespace-pre-wrap inline">{tc.output}</pre>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Main Layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Panel: Problem Description (Desktop Only) */}
        <div className="hidden lg:block lg:w-1/3 bg-background border-r border-gray-200 dark:border-gray-700 p-6 overflow-y-auto">
          <div className="space-y-4">
            <div>
              <h1 className="text-xl font-semibold text-primary">{problem?.title ?? "Loading..."}</h1>
              <span
                className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium mt-2 ${
                  problem?.difficulty === Difficulty.EASY
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
            {problem && problem.testCaseIds?.slice(0, 2).length > 0 && (
              <div className="space-y-4">
                {problem.testCaseIds.slice(0, 2).map((tc, index) => (
                  <div key={tc._id}>
                    <h2 className="text-lg font-medium text-primary mb-2">Test Case {index + 1}</h2>
                    <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-sm">
                      <strong>Input:</strong> <pre className="whitespace-pre-wrap inline">{tc.input}</pre>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded mt-2 text-sm">
                      <strong>Output:</strong> <pre className="whitespace-pre-wrap inline">{tc.output}</pre>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Editor and Test Cases */}
        <div className="w-full lg:w-2/3 flex flex-col h-full">
          {/* Editor Section */}
          <div className="flex flex-col border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 md:p-4 bg-gray-50 dark:bg-gray-800 gap-2">
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full sm:w-auto p-1.5 border rounded bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:border-gray-700"
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option key={lang.id} value={lang.name}>
                    {lang.name.toUpperCase()}
                  </option>
                ))}
              </select>
              <div className="flex gap-2 w-full sm:w-auto justify-end">
                <button
                  disabled={true}
                  className="flex items-center gap-1 py-1.5 px-3 rounded text-sm text-white bg-gray-500 cursor-not-allowed"
                >
                  <Play className="w-4 h-4" />
                  Run
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex items-center gap-1 py-1.5 px-3 rounded text-sm text-white bg-blue-500 hover:bg-blue-600"
                >
                  <Send className="w-4 h-4" />
                  Submit
                </button>
              </div>
            </div>
            <CodeMirror
              value={code}
              height="min(40vh, 300px)"
              minHeight="150px"
              theme={theme === "dark" ? "dark" : "light"}
              extensions={[getLanguageExtension()]}
              onChange={(value) => setCode(value)}
              className="border-t border-gray-200 dark:border-gray-700"
            />
          </div>

          {/* Test Cases Section */}
          <div
            className={`p-3 md:p-4 ${
              theme === "dark" ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-900"
            } overflow-y-auto flex-1`}
          >
            <h3 className="text-sm font-semibold mb-3">Test Results</h3>
            <div className="flex gap-4 mb-4">
              {["Case 1", "Case 2"].map((label, index) => (
                <label key={index} className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="testCase"
                    value={index}
                    checked={index === 0}
                    disabled={true}
                    className="w-4 h-4 accent-blue-500"
                  />
                  {label}
                </label>
              ))}
            </div>
            <div className="space-y-4">
              {problem?.testCaseIds?.slice(0, 2).map((tc, index) => (
                <div key={tc._id} className="space-y-2">
                  <span className="text-sm font-medium">Case {index + 1}</span>
                  <div
                    className={`p-2 rounded text-xs ${
                      theme === "dark" ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-900"
                    }`}
                  >
                    <strong>Input:</strong> <pre className="whitespace-pre-wrap inline">{tc.input}</pre>
                  </div>
                  <div
                    className={`p-2 rounded text-xs ${
                      theme === "dark" ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-900"
                    }`}
                  >
                    <strong>Expected:</strong> <pre className="whitespace-pre-wrap inline">{tc.output}</pre>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemEditor;