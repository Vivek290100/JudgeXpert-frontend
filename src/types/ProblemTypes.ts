

export interface FilterProps {
    onFilterChange: (filters: { difficulty?: string; status?: string }) => void;
    filters: { difficulty?: string; status?: string };
  }

  export interface IProblem {
  _id: string;
  title: string;
  slug: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  status: "premium" | "free";
  isBlocked?: boolean;
}
  
  export interface IUserProblemStatus {
    problemId: string;
    solved: boolean;
  }
  
  export interface StatisticsProps {
    problems: IProblem[];
    userProblemStatus: IUserProblemStatus[];
  }

  export interface ProblemsResponse {
  problems: IProblem[];
  userProblemStatus: IUserProblemStatus[];
  total: number;
  totalPages: number;
  currentPage: number;
}

  export interface ApiResponse {
  success: boolean;
  message: string;
  data: ProblemsResponse;
}