export interface ProblemRowProps {
    number: string;
    title: string;
    submissions: string;
    submissionColor: string;
  }

  export interface StatCardProps {
    title: string;
    value: string;
    label: string;
    color: string;
  }

  
export interface DefaultCode {
    _id: string;
    languageId: number;
    languageName: string;
    code: string;
    status: string;
  }
  
  export interface TestCase {
    _id: string;
    input: string;
    output: string;
    index: number;
  }
  
  export interface IProblem {
    _id: string;
    title: string;
    slug: string;
    difficulty: "EASY" | "MEDIUM" | "HARD";
    status: "premium" | "free";
    updatedAt: string;
    description: string;
    defaultCodeIds: DefaultCode[];
    testCaseIds: TestCase[];
    isBlocked: boolean;
  }
  
  export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
  }