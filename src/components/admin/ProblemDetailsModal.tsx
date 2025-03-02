// C:\Users\vivek_laxvnt1\Desktop\JudgeXpert\Frontend\src\components\admin\ProblemDetailsModal.tsx
import React, { useState } from "react";
import { X, ChevronDown, ChevronUp } from "lucide-react";

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
  id: string;
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

interface ProblemDetailsModalProps {
  problem: IProblem | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProblemDetailsModal: React.FC<ProblemDetailsModalProps> = ({
  problem,
  isOpen,
  onClose,
}) => {
  const [expandedCode, setExpandedCode] = useState<string | null>(null); // Track expanded code

  if (!isOpen || !problem) return null;

  const toggleCode = (codeId: string) => {
    setExpandedCode(expandedCode === codeId ? null : codeId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
      <div className="bg-background rounded-xl shadow-2xl w-full max-w-4xl p-8 max-h-[85vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-primary tracking-tight">
            {problem.title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong className="font-semibold text-primary">ID:</strong> {problem.id}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong className="font-semibold text-primary">Slug:</strong> {problem.slug}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong className="font-semibold text-primary">Difficulty:</strong>{" "}
                <span
                  className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    problem.difficulty === "EASY"
                      ? "bg-green-100 text-green-800"
                      : problem.difficulty === "MEDIUM"
                      ? "bg-orange-100 text-orange-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {problem.difficulty}
                </span>
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong className="font-semibold text-primary">Status:</strong>{" "}
                <span
                  className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    problem.status === "premium"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
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

          {/* Description */}
          <div>
            <h3 className="text-xl font-semibold text-primary mb-2">Description</h3>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow-inner text-forground text-sm whitespace-pre-wrap">
              {problem.description}
            </div>
          </div>

          {/* Default Codes */}
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
              <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                No default codes available
              </p>
            )}
          </div>

          {/* Test Cases */}
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
                    {problem.testCaseIds.map((test) => (
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
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                No test cases available
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemDetailsModal;