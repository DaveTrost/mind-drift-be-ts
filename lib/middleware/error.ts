import mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';

function errorMiddleware(err: mongoose.Error, req: Request, res: Response, next: NextFunction): void {
  let status = err.status || 500;

  if(err instanceof mongoose.Error.ValidationError ||
    err instanceof mongoose.Error.CastError) {
    status = 400;
  }

  res.status(status);

  console.log(err);

  res.send({
    status,
    message: err.message
  });
};

export default errorMiddleware