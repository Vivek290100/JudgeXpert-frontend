export interface AuthUser {
    id: string;
    email: string;
    userName: string;
    fullName: string;
    role: "user" | "admin";
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
  
  export interface AuthState {
    token: string | null;
    isAuthenticated: boolean;
    user: AuthUser | null;
    loading: boolean;
    error: string | null;
  }
