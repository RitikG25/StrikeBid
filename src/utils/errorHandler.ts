// src/errors/AppError.ts
export class AppError extends Error {
  readonly status: string;
  readonly isOperational: boolean;
  readonly statusCode: number;

  constructor(status: number, message: string, isOperational = true) {
    super(message);
    this.name = "AppError";
    this.status = status >= 400 && status < 500 ? "fail" : "error";
    this.statusCode = status;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}
