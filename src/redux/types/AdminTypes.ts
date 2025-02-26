// C:\Users\vivek_laxvnt1\Desktop\JudgeXpert\Frontend\src\redux\types\AdminTypes.ts
export interface AdminUser {
  id: string;
  email: string;
  userName: string;
  fullName: string;
  role: 'user' | 'admin';
  isBlocked: boolean;
  joinedDate: string;
}

export interface AdminUsersResponse {
  success: boolean;
  message: string;
  data: {
    users: AdminUser[];
    totalPages: number;
  };
}

export interface BlockUserResponse {
  success: boolean;
  message: string;
  data: {
    userId: string;
    isBlocked: boolean;
  };
}