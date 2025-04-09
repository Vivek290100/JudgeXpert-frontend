import React from "react";
import { Activity } from "lucide-react";
import { StatisticsProps } from "@/types/ProblemTypes";

interface ExtendedStatisticsProps extends StatisticsProps {
  totalProblemsInDb: number;
}

const Statistics: React.FC<ExtendedStatisticsProps> = ({ problems, userProblemStatus, totalProblemsInDb }) => {
  const solvedProblems = userProblemStatus.filter((status) => status.solved).length;
  const solvedByDifficulty = { EASY: 0, MEDIUM: 0, HARD: 0 };

  problems.forEach((problem) => {
    const isSolved = userProblemStatus.find(
      (status) => status.problemId === problem._id && status.solved
    );
    if (isSolved) {
      solvedByDifficulty[problem.difficulty]++;
    }
  });

  const progressPercentage = totalProblemsInDb
    ? ((solvedProblems / totalProblemsInDb) * 100).toFixed(1)
    : 0;

  const userStats = {
    totalProblems: totalProblemsInDb,
    solvedProblems,
    solvedByDifficulty,
  };

  return (
    <div className="bg-card rounded-lg shadow-md p-4 border border-border">
      <h2 className="text-lg font-bold mb-3 flex items-center">
        <Activity className="w-5 h-5 mr-2 text-blue-500" />
        Problem Solving
      </h2>

      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-muted-foreground">Completion</span>
        <span className="text-sm font-medium">
          {userStats.solvedProblems}/{userStats.totalProblems}
        </span>
      </div>

      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-4">
        <div
          className="bg-blue-500 h-2.5 rounded-full"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        <div className="flex flex-col items-center p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
          <span className="text-xs text-green-800 dark:text-green-300">Easy</span>
          <span className="text-sm font-semibold text-green-800 dark:text-green-300">
            {userStats.solvedByDifficulty.EASY}
          </span>
        </div>
        <div className="flex flex-col items-center p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
          <span className="text-xs text-yellow-800 dark:text-yellow-300">Medium</span>
          <span className="text-sm font-semibold text-yellow-800 dark:text-yellow-300">
            {userStats.solvedByDifficulty.MEDIUM}
          </span>
        </div>
        <div className="flex flex-col items-center p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
          <span className="text-xs text-red-800 dark:text-red-300">Hard</span>
          <span className="text-sm font-semibold text-red-800 dark:text-red-300">
            {userStats.solvedByDifficulty.HARD}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Statistics;