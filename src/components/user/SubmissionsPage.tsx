// Frontend\src\components\SubmissionsPage.tsx
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { apiRequest } from "@/utils/axios/ApiRequest";
import { SubmissionsApiResponse, Submission } from "@/types/ProblemTypes";
import { useTheme } from "@/contexts/ThemeContext";
import { ChevronUp } from "lucide-react";
import CodeMirror from "@uiw/react-codemirror";
import { cpp } from "@codemirror/lang-cpp";
import { javascript } from "@codemirror/lang-javascript";

const SubmissionsPage: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const slug = queryParams.get("problemSlug"); 
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const fetchSubmissions = async () => {
      setLoading(true);
      try {
        const response = await apiRequest<SubmissionsApiResponse>( "get", `/submissions${slug ? `?problemSlug=${slug}` : ""}` );
        console.log("submissions",response);
             
        if (response.success) {
          setSubmissions(response.data.submissions);
        } else {
          setError(response.message || "Failed to load submissions");
        }
      } catch (err) {
        setError("Failed to fetch submissions. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubmissions();
  }, [slug]);

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
    return <div>Loading submissions...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] p-6">
      <h1 className="text-2xl font-bold mb-6">Your Submissions</h1>
      {submissions.length === 0 ? (
        <p className="text-gray-500">No submissions found for this problem.</p>
      ) : (
        <div className="space-y-4">
          {submissions.map((submission) => (
            <div
              key={submission._id}
              className="border rounded-lg p-4 bg-background shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => openModal(submission)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{submission.language.toUpperCase()}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(submission.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p
                    className={`font-semibold ${
                      submission.passed ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {submission.passed ? "Passed" : "Failed"}
                  </p>
                  <p className="text-sm">
                    {submission.testCasesPassed}/{submission.totalTestCases} Test Cases
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Code Viewing */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className={`rounded-lg p-6 w-full max-w-3xl ${
              theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900"
            }`}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                Submission - {selectedSubmission.language.toUpperCase()}
              </h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <ChevronUp className="w-6 h-6" />
              </button>
            </div>
            <CodeMirror
              value={selectedSubmission.code}
              height="400px"
              theme={theme === "dark" ? "dark" : "light"}
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