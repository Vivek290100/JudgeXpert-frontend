// C:\Users\vivek_laxvnt1\Desktop\JudgeXpert\Frontend\src\lib\utils.ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
