import { Schema, Model, model } from 'mongoose';
import moment from 'moment';
import { IUserDocument } from '../interfaces/IUserDocument';

interface IUser extends IUserDocument {};

interface IUserModel extends Model<IUser> {
  updateStreak(userId: string, start: Date): Promise<IUserDocument>;
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
  }
});

userSchema.static('updateStreak', async function(userId: string, start: Date): Promise<IUserDocument> {
  const users = await this.find({ userId });
  if(!users.length) {
    return this.create({ userId, lastSessionDate: start, currentStreak: 1 });
  }

  let { lastSessionDate, currentStreak } = users[0];

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
  return this.findOneAndUpdate(
    { userId }, 
    { userId, lastSessionDate: start, currentStreak }, 
    { new: true }
  );
});

export const User: IUserModel = model<IUser, IUserModel>('Users', userSchema);
export default User;
