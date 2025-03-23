export interface DefaultCode {
    _id: string;
    languageId: number;
    languageName: string;
    problemId: string;
    code: string;
    status?: "active" | "inactive" | "pending";
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  export interface TestCase {
    _id: string;
    problemId: string;
    input: string;
    output: string;
    index: number;
    status?: "active" | "inactive" | "pending";
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  export interface Problem {
    _id: string;
    title: string;
    description: string;
    difficulty: "EASY" | "MEDIUM" | "HARD";
    defaultCodes: DefaultCode[];
    testCases: TestCase[];
    slug: string;
    status: "premium" | "free";
    updatedAt: Date;
  }
  
  export interface ProblemApiResponse {
    success: boolean;
    message: string;
    data: { problem: Problem };
  }
  
  export interface SubmissionApiResponse {
    success: boolean;
    message: string;
    data: {
      result: string;
      details: any;
    };
  }

  export interface EditProfileProps {
    isOpen: boolean;
    onClose: () => void;
  }