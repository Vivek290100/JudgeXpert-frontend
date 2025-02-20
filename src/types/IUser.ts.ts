export interface User {
    name: string;
    email: string;
    github: string;
    linkedin: string;
    acceptanceRate: {
      easy: number;
      medium: number;
      hard: number;
    };
    solvedProblems: number;
    totalProblems: number;
    // rank?: number;
  }
  