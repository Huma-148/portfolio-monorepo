import type { Role } from "@prisma/client";

export type AuthenticatedContext = {
  isAuthenticated: true;
  userId: string;
  role: Role;
};

export type UnauthenticatedContext = {
  isAuthenticated: false;
  userId: null;
  role: null;
};

export type AuthContext = AuthenticatedContext | UnauthenticatedContext;

export type TokenPayload = {
  userId: string;
  role: Role;
};


export type ErrorResponse = {
  success: false;
  error: {
      message: string;
      statusCode: number;
  };
};