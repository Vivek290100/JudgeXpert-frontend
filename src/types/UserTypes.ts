// //Frontend\src\redux\types\UserTypes.ts

import { AuthUser } from "./AuthTypes";

export interface UserState {
  user: AuthUser | null;
  solvedProblems: string[];
  loading: boolean;
  error: string | null;
}

export interface UpdateProfileData {
  fullName: string;
  github?: string;
  linkedin?: string;
  profileImage?: File | string;
}


export interface EditProfileProps {
  isOpen: boolean;
  onClose: () => void;
}