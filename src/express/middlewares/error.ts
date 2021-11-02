import * as express from 'express';

export class ServiceError extends Error {
  public code;

  constructor(code: number, message: string) {
    super(message);
    this.code = code;
  }
}

export const errorMiddleware = (
  error: any,
  _req: express.Request,
  res: express.Response,
  _next: express.NextFunction
) => {
  const status = error.response?.status || 500;
  const message = error.response?.data?.message || error.message;
  // const stack = error.stack;
  res.status(status).json({
    status,
    message,
    // stack
  });
};
