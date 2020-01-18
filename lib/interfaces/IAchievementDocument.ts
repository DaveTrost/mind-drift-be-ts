import { Document } from 'mongoose';

export interface IAchievementDocument extends Document {
  name?: string;
  img?: string;
  description?: string;
  created?: Date;
  delivered?: Boolean;
  userId?: string;
};
