// C:\Users\vivek_laxvnt1\Desktop\JudgeXpert\Frontend\src\redux\types\AuthTypes.ts
export interface AuthUser {
  id: string;
  totalProblems: string;
  email: string;
  userName: string;
  fullName: string;
  role: "user" | "admin"
  profileImage: string;
  problemsSolved?: number;
  rank: number;
  joinedDate: string;
  github?: string; 
  linkedin?: string;
  isPremium?: boolean; 
  isGoogleAuth?: boolean; 
}


export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: AuthUser;
  };
  token?: string;  
}

