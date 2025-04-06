export interface AdminUser {
    id: string;
    email: string;
    userName: string;
    fullName: string;
    role: "user" | "admin";
    isBlocked: boolean;
    joinedDate: string;
    isPremium?: boolean;
  }
  
  export interface AdminUsersResponse {
    users: AdminUser[];
    total: number;
    totalPages: number;
    currentPage: number;
  }
  
  export interface BlockUserResponse {
    userId: string;
    isBlocked: boolean;
  }
  
  export interface AdminState {
    users: AdminUser[] | null;
    loading: boolean;
    error: string | null;
  }
  
  export interface StatCardProps {
    title: string;
    value: string;
    label: string;
    color: string;
  }
  
  export interface ProblemRowProps {
    number: string;
    title: string;
    submissions: string;
    submissionColor: string;
  }



// export interface ApiResponse {
//   success: boolean;
//   status: number;
//   message: string;
//   data: AdminUsersResponse;
// }