import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTime(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  const ms = Math.floor((milliseconds % 1000) / 10); // 保留到百分之一秒
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
}

export function validateUsername(username: string): boolean {
  // 用户名长度3-20位，只允许字母、数字、下划线
  const regex = /^[a-zA-Z0-9_]{3,20}$/;
  return regex.test(username);
}

export function validatePassword(password: string): boolean {
  // 密码长度6-20位，只允许字母、数字、下划线
  const regex = /^[a-zA-Z0-9_]{6,20}$/;
  return regex.test(password);
} 