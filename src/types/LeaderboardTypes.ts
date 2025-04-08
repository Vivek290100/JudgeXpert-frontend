
export interface LeaderboardEntry {
  rank: number;
  username: string;
  fullName: string;
  score: number;
  executionTime?: number;
  _id: string;
}

export interface LeaderboardApiResponse {
  leaderboard: LeaderboardEntry[];
  totalPages: number;
  currentPage: number;
}

export interface UserStats {
  totalProblems: number;
  solvedProblems: number;
  solvedByDifficulty: {
    EASY: number;
    MEDIUM: number;
    HARD: number;
  };
  rank?: number;
  score?: number;
}