// src/utils/validations/EditProfileValidation.ts
import { z } from "zod";

export const editProfileSchema = z.object({
  fullName: z.string().min(3, "Full Name must be at least 3 characters"),
  github: z.string().url("Enter a valid GitHub URL").optional().or(z.literal("")),
  linkedin: z.string().url("Enter a valid LinkedIn URL").optional().or(z.literal("")),
  profileImage: z.instanceof(File, { message: "Invalid file" })
    .optional()
    .nullable(),
});

export type EditProfileFormData = z.infer<typeof editProfileSchema>;