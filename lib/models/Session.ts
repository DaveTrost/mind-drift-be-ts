import { Schema, Model, model, Aggregate } from 'mongoose';
import { ISessionDocument } from '../interfaces/ISessionDocument';

interface ISession extends ISessionDocument {};

interface ISessionModel extends Model<ISession> {
  averageSessionTime(userId: String): Promise<number>;
  totalSessionTime(userId: String): Promise<number>;
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

sessionSchema.static('averageSessionTime', function(userId: string): Aggregate<ISessionDocument[]> {
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
  return Session.aggregate(pipeline);
});

sessionSchema.static('totalSessionTime', function(userId: string): Aggregate<ISessionDocument[]> {
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
  return Session.aggregate(pipeline);
});

export const Session: ISessionModel = model<ISession, ISessionModel>('Session', sessionSchema);
export default Session;
