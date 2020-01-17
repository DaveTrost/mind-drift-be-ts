import { Document, Schema, Model, model } from 'mongoose';
import { sessionInterface } from '../interfaces/sessionInterface';

interface sessionModel extends sessionInterface, Document {}
//   averageSessionTime(): number;
//   totalSessionTime(): number;
// }

const sessionSchema: Schema = new Schema({
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

sessionSchema.static('averageSessionTime', function(userId: string) {
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

sessionSchema.static('totalSessionTime', function(userId: string) {
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

export const Session: Model<sessionModel> = model<sessionModel>('Sessions', sessionSchema);
