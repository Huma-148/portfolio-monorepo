import { ErrorResponse } from "../types/infrastructure";

/**
 * Application error carrying an HTTP status code. Throw it for expected
 * failures (validation, not found, rate limit) so `toErrorResponse` can turn it
 * into a clean client response. `isOperational` marks errors we anticipated,
 * as opposed to programmer bugs.
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = 500,
    isOperational: boolean = true,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace?.(this, this.constructor);
  }
}


/**
 * Converts any thrown value into the standard JSON error body sent to clients.
 * `AppError` keeps its message and status code; anything else becomes a 500.
 */
export function toErrorResponse(error: unknown): ErrorResponse {
  if (error instanceof AppError) {
    return {
      success: false,
      error: {
        message: error.message,
        statusCode: error.statusCode,
      },
    };
  }

  const message: string =
    error instanceof Error ? error.message : "Internal server error";

  return {
    success: false,
    error: {
      message,
      statusCode: 500,
    },
  };
}
