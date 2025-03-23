//Frontend\src\redux\types\UserTypes.ts
import { AuthUser } from './AuthTypes';

export interface UserState {
  user: AuthUser | null; 
  solvedProblems: string[];
  loading: boolean;
  error: string | null;
}

export interface FetchUserSuccessPayload {
  user: AuthUser;
}

export interface FetchUserFailurePayload {
  error: string;
}

export interface AddSolvedProblemPayload {
  problemId: string;
}

export interface UpdateProfilePayload {
  fullName: string;
  github?: string;
  linkedin?: string;
  profileImage?: string;
}

export interface UpdateProfileData {
  fullName: string;
  github?: string;
  linkedin?: string;
  profileImage?: File | string;
}

export interface UserState {
  user: AuthUser | null;
  solvedProblems: string[];
  loading: boolean;
  error: string | null;
}

