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
    .regex(/[/a-z]/, "Password must contain at least one lowercase letter")
    .regex(/\d/, "Password must contain at least one number")
    .regex(/[\W_]/, "Password must contain at least one special character"),
});


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


export const forgotPasswordSchema = z.object({
  email: z
  .string()
    .email("Invalid email format")
    .regex(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Enter a valid email address"
    ),
  });

  
  export const resetPasswordSchema = z
  .object({
  email: z
      .string()
      .email("Invalid email address")
      .regex(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Enter a valid email address"
      ),
      otp: z.string().min(6, "OTP must be 6 digits"),
      newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
  
  export type SignUpFormData = z.infer<typeof signUpSchema>;
  export type LoginFormData = z.infer<typeof loginSchema>;
  export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
  export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;