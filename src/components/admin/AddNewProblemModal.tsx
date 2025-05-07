import React, { useState } from "react";
import { X, Upload } from "lucide-react";
import { useAppDispatch } from "@/redux/Store";
import { processSpecificProblem } from "@/redux/thunks/ProblemThunks";
import toast from "react-hot-toast";

interface AddNewProblemModalProps {
  isOpen: boolean;
  onClose: () => void;
  newProblems: string[];
  onProblemProcessed: (slug: string) => void;
}

const AddNewProblemModal: React.FC<AddNewProblemModalProps> = ({
  isOpen,
  onClose,
  newProblems,
  onProblemProcessed,
}) => {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const dispatch = useAppDispatch();

  const handleProcess = async (slug: string) => {
    setProcessing(true);
    try {
      await dispatch(processSpecificProblem({ problemDir: slug })).unwrap();
      toast.success(`Problem ${slug} processed successfully!`);
      onProblemProcessed(slug);
      setSelectedSlug(null);
      if (newProblems.length === 1) onClose();
    } catch (err: any) {
      const errorMessage = err.message || "Failed to process problem";
      toast.error(errorMessage);
    } finally {
      setProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm"
      aria-modal="true"
      role="dialog"
      aria-labelledby="add-new-problem-title"
    >
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-md p-6 border border-gray-200 dark:border-gray-800">
        <div className="flex justify-between items-center mb-4">
          <h2
            id="add-new-problem-title"
            className="text-xl font-semibold text-gray-900 dark:text-gray-100"
          >
            Add New Problems
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Close modal"
            disabled={processing}
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200" />
          </button>
        </div>

        <div className="space-y-4">
          {newProblems.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">No new problems detected.</p>
          ) : (
            <>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                The following new problem folders were detected:
              </p>
              <ul className="space-y-2 max-h-60 overflow-y-auto">
                {newProblems.map((slug) => (
                  <li
                    key={slug}
                    className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-800 rounded-lg"
                  >
                    <span className="text-sm text-gray-900 dark:text-gray-100 truncate">{slug}</span>
                    <button
                      onClick={() => handleProcess(slug)}
                      className="flex items-center gap-1 px-3 py-1 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={processing}
                      aria-label={`Process problem ${slug}`}
                    >
                      <Upload className="w-4 h-4" />
                      Process
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Select a problem to process it into the system.
          </p>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Close"
            disabled={processing}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddNewProblemModal;