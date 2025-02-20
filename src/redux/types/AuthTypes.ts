// C:\Users\vivek_laxvnt1\Desktop\JudgeXpert\Frontend\src\redux\types\authTypes.ts
export interface User {
  email: string;
  userName: string;
  fullName: string;
  role: string;
  profileImage: string;
  problemsSolved: number;
  rank: number;
  joinedDate: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
  };
  token?: string;  // Ensure token is optional if missing in API response
}


// export interface AuthResponse {
//   token: string; 
//   user: User;
// }