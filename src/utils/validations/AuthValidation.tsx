// C:\Users\vivek_laxvnt1\Desktop\JudgeXpert\Frontend\src\utils\validations\signUpValidation.tsx
import { z } from "zod";

export const signUpSchema = z.object({
  fullName: z.string().min(3, "Full Name must be at least 3 characters"),
  userName: z.string().min(3, "UserName must be at least 3 characters"),
  email: z
    .string()
    .email("Invalid email format")
    .regex(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Enter a valid email address"
    ),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/\d/, "Password must contain at least one number")
    .regex(/[\W_]/, "Password must contain at least one special character"),
});

// Type inference for validation
export type SignUpFormData = z.infer<typeof signUpSchema>;


export const loginSchema = z.object({
  email: z
    .string()
    .email("Invalid email format")
    .regex(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Enter a valid email address"
    ),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;