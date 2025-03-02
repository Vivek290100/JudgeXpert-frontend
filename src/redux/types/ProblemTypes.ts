// src/redux/types/ProblemTypes.ts (or add to Index.ts)

export interface IProblem {
  status: string;
  id: string; // Use 'id' instead of '_id' for frontend (simpler)
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

// Update src/redux/types/Index.ts to export IProblem
