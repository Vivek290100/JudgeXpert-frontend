import React, { useState, useEffect } from "react";
import { apiRequest } from "@/utils/axios/ApiRequest.ts";
import { ApiResponse, IProblem } from "@/types/ProblemTypes";
import { Calendar, Clock, ListChecks, AlertCircle, Loader2, CheckCircle } from "lucide-react";
import { Contest } from "@/types/ContestType";

interface AddContestFormProps {
  onContestCreated: (contest: Contest) => void;
  onClose: () => void;
}

const AddContestForm: React.FC<AddContestFormProps> = ({ onContestCreated, onClose }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [problems, setProblems] = useState<string[]>([]);
  const [availableProblems, setAvailableProblems] = useState<IProblem[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingProblems, setFetchingProblems] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(1);
  const [formValid, setFormValid] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchProblems = async () => {
      setFetchingProblems(true);
      try {
        const response = await apiRequest<ApiResponse<{ problems: IProblem[] }>>("get", "/admin/problems");

        if (response.success) {
          const freeProblems = response.data.problems.filter(
            (problem) => problem.status.toLowerCase() !== "premium"
          );
          setAvailableProblems(freeProblems);
        }
      } catch (err) {
        console.error("Failed to fetch problems:", err);
        setError("Failed to fetch problems. Please try again.");
      } finally {
        setFetchingProblems(false);
      }
    };
    fetchProblems();
  }, []);

  useEffect(() => {
    if (activeStep === 1) {
      setFormValid(!!title && !!description && !!startTime && !!endTime && new Date(endTime) > new Date(startTime));
    } else if (activeStep === 2) {
      setFormValid(problems.length > 0);
    }
  }, [title, description, startTime, endTime, problems, activeStep]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (activeStep === 1) {
      setActiveStep(2);
      return;
    }

    setLoading(true);
    try {
      const contestData = { title, description, startTime, endTime, problems };
      const response = await apiRequest<ApiResponse<{ contest: any }>>("post", "/admin/contests", contestData);
      console.log("API Response:", response);

      if (response.success) {
        const apiContest = response.data.contest || response.data;
        console.log("New Contest Data:", apiContest);

        if (!apiContest || !apiContest._id) {
          throw new Error("Invalid contest data returned from API");
        }

        const newContest: Contest = {
          _id: apiContest._id,
          title: apiContest.title,
          description: apiContest.description,
          startTime: apiContest.startTime,
          endTime: apiContest.endTime,
          problems: problems.map((problemId) => {
            const problem = availableProblems.find((p) => p._id === problemId);
            return {
              _id: problemId,
              title: problem?.title || "Unknown",
              difficulty: problem?.difficulty || "Unknown",
              slug: problem?.slug || "Unknown",
            };
          }),
          participants: apiContest.participants?.map((userId: string) => ({
            _id: userId,
            userName: "Unknown",
          })) || [],
          isActive: apiContest.isActive ?? true,
          isBlocked: apiContest.isBlocked ?? false,
        };

        onContestCreated(newContest);
        setTitle("");
        setDescription("");
        setStartTime("");
        setEndTime("");
        setProblems([]);
        setActiveStep(1);
        setError(null);
        onClose();
      } else {
        setError(response.message || "Failed to create contest");
        setActiveStep(1);
      }
    } catch (err) {
      setError("Failed to create contest. Please try again.");
      console.error("Error creating contest:", err);
      setActiveStep(1);
    } finally {
      setLoading(false);
    }
  };

  const filteredProblems = availableProblems.filter((problem) =>
    problem.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleProblemSelection = (problemId: string) => {
    if (problems.includes(problemId)) {
      setProblems(problems.filter((id) => id !== problemId));
    } else {
      setProblems([...problems, problemId]);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "text-green-400";
      case "medium":
        return "text-yellow-400";
      case "hard":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="flex justify-between mt-2 text-xs text-gray-400">
          <span>Contest Details</span>
          <span>Select Problems</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {activeStep === 1 ? (
          <div className="animate-slide-in">
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center">
                  <span className="bg-blue-500/20 p-1 rounded mr-2">
                    <Calendar className="h-4 w-4 text-blue-400" />
                  </span>
                  Contest Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter an engaging title for your contest"
                  className="w-full p-3 rounded-lg border border-gray-700 bg-gray-800/50 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center">
                  <span className="bg-blue-500/20 p-1 rounded mr-2">
                    <ListChecks className="h-4 w-4 text-blue-400" />
                  </span>
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the contest rules, prizes, and what participants can expect"
                  className="w-full p-3 rounded-lg border border-gray-700 bg-gray-800/50 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 flex items-center">
                    <span className="bg-green-500/20 p-1 rounded mr-2">
                      <Clock className="h-4 w-4 text-green-400" />
                    </span>
                    Start Time
                  </label>
                  <input
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full p-3 rounded-lg border border-gray-700 bg-gray-800/50 text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 flex items-center">
                    <span className="bg-red-500/20 p-1 rounded mr-2">
                      <Clock className="h-4 w-4 text-red-400" />
                    </span>
                    End Time
                  </label>
                  <input
                    type="datetime-local"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full p-3 rounded-lg border border-gray-700 bg-gray-800/50 text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              {startTime && endTime && new Date(endTime) <= new Date(startTime) && (
                <div className="text-sm text-red-400 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  End time must be after start time
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="animate-slide-in">
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-300 mb-2 block">
                Search Problems
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by problem title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full p-3 pl-10 rounded-lg border border-gray-700 bg-gray-800/50 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <svg
                  className="absolute left-3 top-3.5 h-4 w-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {fetchingProblems ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                <span className="ml-2 text-gray-400">Loading problems...</span>
              </div>
            ) : filteredProblems.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                <div className="flex justify-center mb-2">
                  <AlertCircle className="w-8 h-8" />
                </div>
                <p>No free problems match your search</p>
              </div>
            ) : (
              <div className="border border-gray-700 rounded-lg overflow-hidden">
                <div className="max-h-96 overflow-y-auto">
                  <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-800 sticky top-0">
                      <tr>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Select</th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Problem</th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Difficulty</th>
                      </tr>
                    </thead>
                    <tbody className="bg-gray-900 divide-y divide-gray-800">
                      {filteredProblems.map((problem) => (
                        <tr
                          key={problem._id}
                          className={`${problems.includes(problem._id) ? "bg-blue-900/20" : "hover:bg-gray-800"} cursor-pointer transition-colors`}
                          onClick={() => toggleProblemSelection(problem._id)}
                        >
                          <td className="py-3 px-4 text-left whitespace-nowrap">
                            <div className="flex items-center">
                              {problems.includes(problem._id) ? (
                                <CheckCircle className="w-5 h-5 text-blue-500" />
                              ) : (
                                <div className="w-5 h-5 rounded-full border border-gray-600"></div>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-left text-sm text-white">{problem.title}</td>
                          <td className="py-3 px-4 text-left text-sm">
                            <span className={`py-1 px-2 rounded-full text-xs ${getDifficultyColor(problem.difficulty)}`}>
                              {problem.difficulty}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="mt-4 text-sm text-gray-400">
              Selected {problems.length} problem{problems.length !== 1 ? "s" : ""}
            </div>
          </div>
        )}

        <div className="flex flex-col space-y-4">
          {error && (
            <div className="bg-red-900/30 border border-red-800 text-red-400 px-4 py-3 rounded-lg flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex justify-between items-center">
            {activeStep === 2 ? (
              <button
                type="button"
                onClick={() => setActiveStep(1)}
                className="px-4 py-2 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-800"
              >
                Back
              </button>
            ) : (
              <div></div>
            )}

            <button
              type="submit"
              disabled={loading || !formValid}
              className={`px-6 py-2 rounded-lg flex items-center ${
                formValid
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-gray-700 text-gray-400 cursor-not-allowed"
              } transition-colors`}
            >
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {activeStep === 1 ? "Next" : "Create Contest"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddContestForm;