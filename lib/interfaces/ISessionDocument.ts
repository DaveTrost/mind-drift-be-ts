import { Document } from 'mongoose';

export interface ISessionDocument extends Document {
  start?: Date;
  duration?: number;
  userId?: string;
};
