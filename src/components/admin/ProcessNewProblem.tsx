// src/components/Admin/ProcessNewProblem.tsx
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/Store";
import { processSpecificProblem } from "@/redux/thunks/ProblemThunks";
import { Upload, Search } from "lucide-react";
import toast from "react-hot-toast"; // Assuming you’re using react-hot-toast
import { IProblem } from "@/redux/types/Index"; // Adjust the import path based on your types location

interface ProblemRowProps {
  number: string;
  title: string;
  submissions: string;
  submissionColor: string;
}

const ProblemRow = ({ number, title, submissions, submissionColor }: ProblemRowProps) => (
  <div className="flex items-center justify-between py-2 sm:py-3 border-b border-border">
    <div className="flex items-center gap-2 sm:gap-4">
      <span className="text-muted-foreground text-xs sm:text-sm md:text-base">#{number}</span>
      <span className="text-foreground text-xs sm:text-sm md:text-base truncate max-w-[100px] sm:max-w-[150px] md:max-w-full">{title}</span>
    </div>
    <span className={`text-${submissionColor} bg-${submissionColor}/20 px-2 py-1 text-xs sm:text-sm rounded-full`}>
      {submissions}
    </span>
  </div>
);

export default function ProcessNewProblem() {
  const [problemDir, setProblemDir] = useState(""); // State for problem slug
  const [error, setError] = useState<string | null>(null); // State for errors
  const dispatch = useAppDispatch();
  const problems = useAppSelector((state: { problems: { problems: any; }; }) => state.problems.problems); // Access processed problems with proper typing

  const handleProcessProblem = async () => {
    try {
     
      // Dispatch the thunk with the problem directory formatted for the backend
       await dispatch(processSpecificProblem({ problemDir: `${problemDir}` })).unwrap();
      setError(null);
      setProblemDir("")
      toast.success("Problem processed successfully!"); // Use toast for better UX
    } catch (err: any) {
      const errorMessage = err.message || "Failed to process problem";
      setError(errorMessage);
      toast.error(errorMessage); // Use toast for error feedback
    }
  };

  return (
    <div className="w-full bg-background text-foreground p-2 sm:p-3">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-14">
        <div className="relative w-full sm:w-[300px]">
          <input
            type="text"
            value={problemDir}
            onChange={(e) => setProblemDir(e.target.value)}
            placeholder="Enter problem slug (e.g., two-sum)"
            className="bg-card text-foreground pl-8 pr-3 py-2 text-sm rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-accent border border-border"
          />
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        </div>
        
        <button
          onClick={handleProcessProblem}
          className="flex items-center justify-center gap-2 bg-accent text-accent-foreground px-3 py-2 text-sm rounded-lg hover:bg-opacity-90 transition-colors w-full sm:w-auto"
          disabled={!problemDir.trim()} 
        >
          <Upload className="w-4 h-4" />
          <span>Process Problem</span>
        </button>
      </div>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      {problems.length > 0 && (
        <div className="bg-card p-3 sm:p-4 md:p-6 rounded-lg border border-border">
          <h3 className="text-foreground text-base sm:text-lg mb-3 sm:mb-4">Processed Problems</h3>
          <div className="space-y-2">
            {problems.map((problem: IProblem, index: number) => (
              <ProblemRow 
                key={problem.id} // Use string id from IProblem
                number={(index + 1).toString()} 
                title={problem.title} 
                submissions="1" // Simplified; consider fetching real submissions
                submissionColor="green-400" 
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}