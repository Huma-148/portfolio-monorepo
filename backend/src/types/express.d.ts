import { AuthContext } from './infrastructure';

declare global {
  namespace Express {
    interface Request {
      auth: AuthContext;
    }
  }
}
