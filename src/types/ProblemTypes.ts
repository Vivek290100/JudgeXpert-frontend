import { Difficulty, ProblemStatus, Status } from "@/utils/Enums";
import { ReactNode } from "react";


  export interface IProblem {
  isPremium: any;
  id: string;
  _id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  slug: string;
  solvedCount: number;
  status: ProblemStatus;
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
  defaultCodeIds: DefaultCode[];
  testCaseIds: TestCase[];
}
  
  export interface ProblemsResponse {
    problems: IProblem[];
    userProblemStatus?: IUserProblemStatus[];
    total: number;
    totalPages: number;
    totalProblemsInDb: number;
    currentPage: number;
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
  
  export interface IUserProblemStatus {
    problemId: string;
    solved: boolean;
  }


export interface StatisticsProps {
  problems: IProblem[];
  userProblemStatus: IUserProblemStatus[];
}

export interface FilterProps {
  onFilterChange: (filters: { difficulty?: string; status?: string }) => void;
  filters: { difficulty?: string; status?: string };
}

export interface DefaultCode {
  _id: string;
  languageId: number;
  languageName: string;
  problemId: string;
  code: string;
  status?: Status;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TestCase {
  _id: string;
  problemId: string;
  input: string;
  output: string;
  index: number;
  status?: Status;
  createdAt?: Date;
  updatedAt?: Date;
}


export interface ProblemApiResponse {
  success: boolean;
  message: string;
  data: { problem: IProblem };
}

export interface TestCaseResult {
  testCaseIndex: number;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  stderr: string;
  passed: boolean;
}

export interface SubmissionApiResponse {
  success: boolean;
  message: string;
  data: {
    results: TestCaseResult[];
    executionTime: number;
    details: any; 
  };
}

export interface Submission {
  problemTitle: ReactNode;
  _id: string;
  language: string;
  passed: boolean;
  testCasesPassed: number;
  totalTestCases: number;
  executionTime:number;
  code: string;
  createdAt: string;
}

export interface SubmissionsApiResponse {
  success: boolean;
  message: string;
  data: {
    submissions: Submission[];
  };
}


export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
  }



