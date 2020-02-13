import { Schema, Model, model } from 'mongoose';
import masterAchievementsList from '../data/achievementsList';
import { IAchievementDocument } from '../interfaces/IAchievementDocument';
import { IUserDocument } from '../interfaces/IUserDocument';

interface IAchievement extends IAchievementDocument {};

interface IAchievementModel extends Model<IAchievement> {
  updateUser(user: IUserDocument): Promise<IAchievementDocument[]>;
  markAsDelivered(userId: string): Promise<void>;
}

export const achievementSchema: Schema = new Schema({
  name: {
    type: String,
    enum: ['First Steps', '2-Day Streak', '5-Day Streak', '10-Day Streak', '25-Day Streak', '50-Day Streak'],
    required: true
  },
  img: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    required: true
  },
  delivered: {
    type: Boolean,
    default: false
  },
  userId: {
    type: String,
    required: true
  }
});

achievementSchema.static ('updateUser', async function(user: IUserDocument): Promise<IAchievementDocument[]> {
  const { userId, currentStreak } = user;

  const userAchievements = await Achievement.find({ userId });
  const oldAchievementNames = userAchievements.map(({ name }) => name);

  const newAchievements = masterAchievementsList
    .filter(({ qualifier, name }) => {
      if(currentStreak < qualifier.streak) return false;
      if(oldAchievementNames.includes(name)) return false;
      return true;
    })
    .map(achievement => ({ 
      ...achievement, 
      userId, 
      created: new Date(), 
      delivered: false 
    }));

  return await Achievement.insertMany(newAchievements);
}); 

achievementSchema.static ('markAsDelivered', async function(userId: string): Promise<void> {
  return Achievement.updateMany(
    { userId, delivered: false },
    { $set: { delivered: true } }
  );
}); 

export const Achievement: IAchievementModel = model<IAchievement, IAchievementModel>('Achievements', achievementSchema);
export default Achievement;
