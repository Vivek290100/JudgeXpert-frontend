import React, { useState } from "react";
import { X, Upload, Search } from "lucide-react";
import { useAppDispatch } from "@/redux/Store";
import { processSpecificProblem } from "@/redux/thunks/ProblemThunks";
import toast from "react-hot-toast";

interface ProcessProblemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (slug: string) => void;
  newProblems: string[];
}

const ProcessProblemModal: React.FC<ProcessProblemModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  newProblems,
}) => {
  const [problemDir, setProblemDir] = useState("");
  const dispatch = useAppDispatch();

  const handleConfirm = async () => {
    if (!problemDir.trim()) {
      toast.error("Please enter a problem slug");
      return;
    }

    try {
      await dispatch(processSpecificProblem({ problemDir })).unwrap();
      toast.success("Problem processed successfully!");
      onSuccess(problemDir);
      setProblemDir("");
      onClose();
    } catch (err: any) {
      const errorMessage = err.message || "Failed to process problem";
      toast.error(errorMessage);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm"
      aria-modal="true"
      role="dialog"
      aria-labelledby="process-problem-title"
    >
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-md p-6 border border-gray-200 dark:border-gray-800">
        <div className="flex justify-between items-center mb-4">
          <h2
            id="process-problem-title"
            className="text-xl font-semibold text-gray-900 dark:text-gray-100"
          >
            Process New Problem
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <input
              type="text"
              value={problemDir}
              onChange={(e) => setProblemDir(e.target.value)}
              placeholder="Enter problem slug (e.g., two-sum)"
              className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border bg-background border-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
              aria-label="Problem slug"
            />
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500"
              aria-hidden="true"
            />
          </div>
          {newProblems.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm text-gray-500 dark:text-gray-400">Suggested new problems:</p>
              <div className="flex flex-wrap gap-2">
                {newProblems.map((slug) => (
                  <button
                    key={slug}
                    onClick={() => setProblemDir(slug)}
                    className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label={`Select problem ${slug}`}
                  >
                    {slug}
                  </button>
                ))}
              </div>
            </div>
          )}
          <p className="text-sm text-gray-500 dark:text-gray-400">
            This will create or update the problem in the system.
          </p>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Cancel"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-accent hover:bg-opacity-90 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!problemDir.trim()}
            aria-label="Process problem"
          >
            <Upload className="w-4 h-4" />
            Process
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProcessProblemModal;