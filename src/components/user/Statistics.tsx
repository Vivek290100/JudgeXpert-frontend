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
  const solvedByDifficulty = { EASY: 0, MEDIUM: 0, HARD: 0 };

  problems.forEach((problem) => {
    if (userProblemStatus.find((status) => status.problemId === problem._id && status.solved)) {
      solvedByDifficulty[problem.difficulty]++;
    }
  });

  return (
    <div className="w-full p-4 bg-background flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-primary">Acceptance</h3>
        <span className="text-lg font-bold text-foreground">{solvedProblems}/{totalProblems}</span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="flex flex-col items-center p-2 bg-green-100 dark:bg-green-900 rounded-lg">
          <span className="text-xs text-green-800 dark:text-green-200">Easy</span>
          <span className="text-sm font-semibold text-green-800 dark:text-green-200">{solvedByDifficulty.EASY}</span>
        </div>
        <div className="flex flex-col items-center p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
          <span className="text-xs text-yellow-800 dark:text-yellow-200">Medium</span>
          <span className="text-sm font-semibold text-yellow-800 dark:text-yellow-200">{solvedByDifficulty.MEDIUM}</span>
        </div>
        <div className="flex flex-col items-center p-2 bg-red-100 dark:bg-red-900 rounded-lg">
          <span className="text-xs text-red-800 dark:text-red-200">Hard</span>
          <span className="text-sm font-semibold text-red-800 dark:text-red-200">{solvedByDifficulty.HARD}</span>
        </div>
      </div>
    </div>
  );
};

export default Statistics;