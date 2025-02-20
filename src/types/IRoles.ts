// C:\Users\vivek_laxvnt1\Desktop\JudgeXpert\Frontend\src\types\IRoles.ts
export const ROLES = {
    ADMIN: "admin",
    USER: "user", 
  } as const;
  
  export type Role = keyof typeof ROLES;