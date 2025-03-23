// src/redux/types/ProblemTypes.ts

export interface IProblem {
  status: string;
  id: string;
  title: string;
  description: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  slug: string;
  solvedCount: number;
  createdAt: Date;
  updatedAt: Date;
  testCases: {
    input: string;
    output: string;
    index: number;
  }[];
  defaultCode: {
    language: string;
    code: string;
  }[];
}

export interface ProcessProblemPayload {
  problemDir: string;
}

export interface ProcessProblemResponse {
  success: boolean;
  message: string;
  status: number;
  data: {
    problem: {
      id: string;
      title: string;
      slug: string;
    };
  };
}

export interface ProblemState {
  problems: IProblem[];
  loading: boolean;
  error: string | null;
}

