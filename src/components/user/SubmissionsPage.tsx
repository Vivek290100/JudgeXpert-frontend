import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { apiRequest } from "@/utils/axios/ApiRequest";
import { CheckCircle, XCircle, Award, ChevronUp } from "lucide-react";
import CodeMirror from "@uiw/react-codemirror";
import { cpp } from "@codemirror/lang-cpp";
import { javascript } from "@codemirror/lang-javascript";

interface Submission {
  _id: string;
  language: string;
  passed: boolean;
  testCasesPassed: number;
  totalTestCases: number;
  createdAt: string;
  executionTime: number;
  contestId?: string | null;
  contestTitle?: string | null;
  code: string;
}

const SubmissionsPage: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const problemSlug = queryParams.get("problemSlug");
  const contestId = queryParams.get("contestId");

  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams();
        if (problemSlug) query.append("problemSlug", problemSlug);
        if (contestId) query.append("contestId", contestId);

        const response = await apiRequest<{ success: boolean; data: { submissions: Submission[] } }>(
          "get",
          `/submissions${query.toString() ? `?${query.toString()}` : ""}`
        );

        if (response.success) {
          setSubmissions(response.data.submissions);
        } else {
          setError("Failed to fetch submissions");
        }
      } catch (err) {
        setError("Failed to fetch submissions. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [problemSlug, contestId]);

  const getLanguageExtension = (language: string) => {
    switch (language.toLowerCase()) {
      case "cpp":
        return cpp();
      case "javascript":
        return javascript();
      default:
        return javascript();
    }
  };

  const openModal = (submission: Submission) => setSelectedSubmission(submission);
  const closeModal = () => setSelectedSubmission(null);

  if (loading) {
    return <div className="flex-1 flex items-center justify-center min-h-screen">Loading submissions...</div>;
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center text-red-500 min-h-screen">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <h1 className="text-2xl font-bold text-primary mb-6">Your Submissions</h1>
      {submissions.length === 0 ? (
        <p className="text-foreground text-center">No submissions found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800 text-foreground text-sm">
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Language</th>
                <th className="p-3 text-left">Test Cases</th>
                <th className="p-3 text-left">Execution Time</th>
                <th className="p-3 text-left">Contest</th>
                <th className="p-3 text-left">Submitted At</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission) => (
                <tr
                  key={submission._id}
                  className="border-b border-gray-200 dark:border-gray-700 text-foreground text-sm hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer"
                  onClick={() => openModal(submission)}
                >
                  <td className="p-3">
                    {submission.passed ? (
                      <span className="flex items-center text-green-500">
                        <CheckCircle className="w-5 h-5 mr-1" />
                        Accepted
                      </span>
                    ) : (
                      <span className="flex items-center text-red-500">
                        <XCircle className="w-5 h-5 mr-1" />
                        Failed
                      </span>
                    )}
                  </td>
                  <td className="p-3">{submission.language}</td>
                  <td className="p-3">
                    {submission.testCasesPassed}/{submission.totalTestCases}
                  </td>
                  <td className="p-3">{submission.executionTime} ms</td>
                  <td className="p-3">
                    {submission.contestTitle ? (
                      <span className="flex items-center text-blue-500">
                        <Award className="w-4 h-4 mr-1" />
                        {submission.contestTitle}
                      </span>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td className="p-3">
                    {new Date(submission.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="mt-6">
        <Link
          to={contestId ? `/user/contests/${contestId}` : "/user/problems"}
          className="text-blue-500 hover:underline"
        >
          ← Back to {contestId ? "Contest" : "Problems"}
        </Link>
      </div>

      {/* Modal for Code Viewing */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg p-6 w-full max-w-3xl"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                Submission - {selectedSubmission.language.toUpperCase()}
              </h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                <ChevronUp className="w-6 h-6" />
              </button>
            </div>
            <CodeMirror
              value={selectedSubmission.code}
              height="400px"
              theme="dark"
              extensions={[getLanguageExtension(selectedSubmission.language)]}
              readOnly
              className="border rounded"
            />
            <div className="mt-4 flex justify-between">
              <p>
                Status: <span className={selectedSubmission.passed ? "text-green-500" : "text-red-500"}>
                  {selectedSubmission.passed ? "Passed" : "Failed"}
                </span>
              </p>
              <p>
                Test Cases: {selectedSubmission.testCasesPassed}/{selectedSubmission.totalTestCases}
              </p>
            </div>
            <button
              onClick={closeModal}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmissionsPage;