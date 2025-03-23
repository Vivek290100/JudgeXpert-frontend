// src/types/CommonTypes.ts
export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
  }