import { Router, Request, Response, NextFunction } from 'express';
import { Achievement } from '../models/Achievement';
import { IAchievementDocument } from '../interfaces/IAchievementDocument';

export default Router()
  .get('/achievements/new', ({ query }: Request, res: Response, next: NextFunction) => {
    const { userId } = query;
    let newAchievements: IAchievementDocument[] = [];
    Achievement
      .find({ userId, delivered: false })
      .sort({ created: 'desc' })
      .then((achieves: IAchievementDocument[]) => newAchievements = achieves)
      .then(() => Achievement.markAsDelivered(userId))
      .then(() => res.send(newAchievements))
      .catch(next);
  })

  .get('/achievements', ({ query }: Request, res: Response, next: NextFunction) => {
    const { userId } = query;
    let allAchievements: IAchievementDocument[] = [];
    Achievement
      .find({ userId })
      .sort({ created: 'desc' })
      .then((achieves: IAchievementDocument[]) => allAchievements = achieves)
      .then(() => Achievement.markAsDelivered(userId))
      .then(() => res.send(allAchievements))
      .catch(next);
  });
