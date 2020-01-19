import { Document } from 'mongoose';

export interface ISettingDocument extends Document {
  userId?: string;
  title?: string;
  description?: string;
  inhale?: number;
  holdIn?: number;
  exhale?: number;
  holdOut?: number;
  endTime?: number;
};
