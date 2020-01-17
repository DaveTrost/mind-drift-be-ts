import { Router, Request, Response, NextFunction } from 'express';
import Session from '../models/Session';
import User from '../models/User';

// const Achievement = require('../models/Achievement');

export default Router()
  .get('/sessions', ({ query }: Request, res: Response, next: NextFunction) => {
    const userQuery: object = query.userId && { userId: query.userId };
    Session
      .find(userQuery || {})
      .then((sessions: object[]) => res.send(sessions))
      .catch(next);
  })

  .post('/sessions', (req: Request, res: Response, next: NextFunction) => {
    const { start, duration, userId, moods } = req.body;
    Session
      .create({ start, duration, userId, moods })
      .then((session: object) => res.send(session))
      .then(() => User.schema.statics.updateStreak(userId, start))
      .catch(next);
  });

// .post('/sessions', (req, res, next) => {
//   const { start, duration, userId, moods } = req.body;
//   Session
//     .create({ start, duration, userId, moods })
//     .then(session => res.send(session))
//     .then(() => User.updateStreak(userId, start))
//     .then(user => Achievement.updateUser(user))
//     .catch(next);
// });
