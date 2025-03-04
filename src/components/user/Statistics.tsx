// src/components/user/Statistics.tsx
interface IProblem {
  _id: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
}

interface IUserProblemStatus {
  problemId: string;
  solved: boolean;
}

interface StatisticsProps {
  problems: IProblem[];
  userProblemStatus: IUserProblemStatus[];
}

const Statistics: React.FC<StatisticsProps> = ({ problems, userProblemStatus }) => {

  const totalProblems = problems.length;
  const solvedProblems = userProblemStatus.filter((status) => status.solved).length;
  const solvedByDifficulty = {
    EASY: 0,
    MEDIUM: 0,
    HARD: 0,
  };

  // Count solved problems by difficulty
  problems.forEach((problem) => {
    if (userProblemStatus.find((status) => status.problemId === problem._id && status.solved)) {
      solvedByDifficulty[problem.difficulty]++;
    }
  });

  return (
    <div className="w-full p-4 bg-background border-t border-gray-200 dark:border-gray-900 flex flex-col gap-4">
      {/* Total Solved / Total Problems */}
      <div className="flex items-center gap-4">
        <div className="bg-gray-200 dark:bg-gray-700 rounded-lg p-4 text-center w-24">
          <span className="text-lg font-bold text-foreground">
            {solvedProblems}/{totalProblems}
          </span>
        </div>
        <h3 className="text-lg font-semibold text-primary">Acceptance</h3>
      </div>

      {/* Difficulty Breakdown */}
      <div className="flex flex-col gap-2">
        <button
          className="w-full flex justify-between items-center p-2 bg-green-100 dark:bg-green-900 rounded-lg text-green-800 dark:text-green-200 text-sm"
        >
          Easy
          <span>{solvedByDifficulty.EASY}</span>
        </button>
        <button
          className="w-full flex justify-between items-center p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg text-yellow-800 dark:text-yellow-200 text-sm"
        >
          Medium
          <span>{solvedByDifficulty.MEDIUM}</span>
        </button>
        <button
          className="w-full flex justify-between items-center p-2 bg-red-100 dark:bg-red-900 rounded-lg text-red-800 dark:text-red-200 text-sm"
        >
          Hard
          <span>{solvedByDifficulty.HARD}</span>
        </button>
      </div>
    </div>
  );
};

export default Statistics;