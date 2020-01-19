import { Router, Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { Session } from '../models/Session';

export default Router()
  .get('/users', ({ query }: Request, res: Response, next: NextFunction) => {
    User
      .find({ userId: query.userId })
      .then(user => res.send(user))
      .catch(next);
  })
  .get('/users/averageTime', ({ query }: Request, res: Response, next: NextFunction) => {
    const { userId } = query;
    Session.schema.statics.averageSessionTime(userId)
      .then((avg: number) => res.json(avg))
      .catch(next);
  })
  .get('/users/totalTime', ({ query }: Request, res: Response, next: NextFunction) => {
    const { userId } = query;
    Session.schema.statics.totalSessionTime(userId)
      .then((total: number) => res.json(total))
      .catch(next);
  })
