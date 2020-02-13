import { Schema, Model, model } from 'mongoose';
import moment from 'moment';
import { IUserDocument } from '../interfaces/IUserDocument';

interface IUser extends IUserDocument {};

interface IUserModel extends Model<IUser> {
  updateUser(userId: string, start: Date): Promise<IUserDocument>;
};

export const userSchema: Schema = new Schema({
  userId: {
    type: String,
    required: true
  },
  lastSessionDate: {
    type: Date,
    required: false
  },
  currentStreak: {
    type: Number,
    required: true
  },
  totalTime: {
    type: Number,
    required: false
  }
});

userSchema.static('updateUser', async function(userId: string, start: Date, duration: number): Promise<IUserDocument> {
  const users = await User.find({ userId });
  if(!users.length) {
    return User.create({ 
      userId, 
      lastSessionDate: start, 
      currentStreak: 1, 
      totalTime: duration 
    });
  }

  let { lastSessionDate, currentStreak, totalTime } = users[0];

  const difference = moment(start).diff(moment(lastSessionDate), 'days');
  switch(difference) {
    case 0: 
      break;
    case 1:
      currentStreak++;
      break;
    default:
      currentStreak = 1;
  }
  return User.findOneAndUpdate(
    { userId }, 
    { 
      userId, 
      lastSessionDate: start, 
      currentStreak, 
      totalTime: totalTime + duration,
    }, 
    { new: true }
  );
});

export const User: IUserModel = model<IUser, IUserModel>('Users', userSchema);
export default User;
