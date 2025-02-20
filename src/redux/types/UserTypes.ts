// src/redux/types/userTypes.ts
export interface User {
    _id: string;
    userName: string;
    email: string;
    role: 'user' | 'admin';
    solvedProblems: string[];
  }
  
  export interface UserState {
    user: User | null;
    solvedProblems: string[];
    loading: boolean;
    error: string | null;
  }
  
  export interface FetchUserSuccessPayload {
    user: User;
  }
  
  export interface FetchUserFailurePayload {
    error: string;
  }
  
  export interface AddSolvedProblemPayload {
    problemId: string;
  }