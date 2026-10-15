import { UnauthenticatedContext } from "../types/infrastructure";

/** Clean fallback identity used whenever no valid token is present. */
export const UNAUTHENTICATED: UnauthenticatedContext = Object.freeze({
    isAuthenticated: false,
    userId: null,
    role: null,
  });