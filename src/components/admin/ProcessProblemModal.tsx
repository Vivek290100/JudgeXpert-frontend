// src/components/Admin/ProcessProblemModal.tsx
import React, { useState } from "react";
import { X, Upload, Search } from "lucide-react";
import { useAppDispatch } from "@/redux/Store";
import { processSpecificProblem } from "@/redux/thunks/ProblemThunks";
import toast from "react-hot-toast";

interface ProcessProblemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ProcessProblemModal: React.FC<ProcessProblemModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
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
      onSuccess();
      setProblemDir("");
      onClose();
    } catch (err: any) {
      const errorMessage = err.message || "Failed to process problem";
      toast.error(errorMessage);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-md p-6 border border-gray-200 dark:border-gray-800">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Process New Problem
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
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
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            This will create or update the problem in the system.
          </p>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-accent hover:bg-opacity-90 rounded-lg transition-colors"
            disabled={!problemDir.trim()}
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