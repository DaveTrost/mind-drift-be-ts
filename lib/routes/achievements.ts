import { Router, Request, Response, NextFunction } from 'express';
import { Achievement } from '../models/Achievement';

export default Router()
  .get('/achievements/new', ({ query }: Request, res: Response, next: NextFunction) => {
    const { userId } = query;
    Achievement
      .find({ userId, delivered: false })
      .sort({ created: 'desc' })
      .then(achieves => res.send(achieves))
      .then(() => Achievement.markAsDelivered(userId))
      .catch(next);
  })

  .get('/achievements', ({ query }: Request, res: Response, next: NextFunction) => {
    const { userId } = query;
    Achievement
      .find({ userId })
      .sort({ created: 'desc' })
      .then(achieves => res.send(achieves))
      .then(() => Achievement.markAsDelivered(userId))
      .catch(next);
  });
