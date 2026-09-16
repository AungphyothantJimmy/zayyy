import type { SessionUser } from "@/lib/auth";

export type ApiError = {
  error: string;
  status?: number;
};

export type ApiResponse<T> =
  | (T & { error?: never })
  | ApiError;

export type { SessionUser };