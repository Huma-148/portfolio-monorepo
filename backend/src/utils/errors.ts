export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace?.(this, this.constructor);
  }
}

export type ErrorResponse = {
  success: false;
  error: {
    message: string;
    statusCode: number;
  };
};

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

  const message =
    error instanceof Error ? error.message : "Internal server error";

  return {
    success: false,
    error: {
      message,
      statusCode: 500,
    },
  };
}
