import mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';

interface ResponseError extends Error {
  status?: number;
  statusCode?: number;
  error?: string;
}

export default (err: ResponseError, req: Request, res: Response, next: NextFunction): void => {
  let status = err.status || 500;
  let error = 'Internal Server Error';

  if(err instanceof mongoose.Error.ValidationError ||
    err instanceof mongoose.Error.CastError) {
    status = 400;
    error = err.message;
  }
  else if(err.statusCode) {
    status = err.statusCode;
    error = err.error;
  }

  res.status(status).send({ error });
};
