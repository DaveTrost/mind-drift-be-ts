import { Document } from 'mongoose';

export interface IUserDocument extends Document {
  userId?: string;
  lastSessionDate?: Date;
  currentStreak?: number;
};
