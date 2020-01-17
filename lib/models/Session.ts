import { Schema, Model, model } from 'mongoose';
import { ISessionDocument } from '../interfaces/ISessionDocument';

interface ISession extends ISessionDocument {};

interface ISessionModel extends Model<ISession> {
  averageSessionTime(userId: String): number;
  totalSessionTime(userId: String): number;
}

export const sessionSchema: Schema = new Schema({
  start: {
    type: Date,
    required: true,
  },
  duration: {
    type: Number,
    required: true
  }, 
  userId: {
    type: String,
    required: true
  }
});

sessionSchema.static('averageSessionTime', function(userId: string): number {
  const pipeline = [
    {
      $match: { userId: userId }
    }, 
    {
      $group: {
        _id: null,
        averageTime: { $avg: '$duration' }
      }
    }
  ];
  return this.aggregate(pipeline);
});

sessionSchema.static('totalSessionTime', function(userId: string): number {
  const pipeline = [
    {
      $match: { userId: userId }
    }, 
    {
      $group: {
        _id: null,
        totalTime: { $sum: '$duration' }
      }
    }
  ];
  return this.aggregate(pipeline);
});

export const Session: ISessionModel = model<ISession, ISessionModel>('Session', sessionSchema);
export default Session;
