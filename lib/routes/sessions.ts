import { Router, Request, Response, NextFunction } from 'express';
import Session from '../models/Session';
import User from '../models/User';
import { ISessionDocument } from '../interfaces/ISessionDocument';
import { Achievement } from '../models/Achievement';

export default Router()
  .get('/sessions', ({ query }: Request, res: Response, next: NextFunction) => {
    const userQuery: object = query.userId && { userId: query.userId };
    Session
      .find(userQuery || {})
      .then((sessions: ISessionDocument[]) => res.send(sessions))
      .catch(next);
  })

  .post('/sessions', (req: Request, res: Response, next: NextFunction) => {
    const { start, duration, userId, moods } = req.body;
    let createdSession: ISessionDocument = null;
    Session
      .create({ start, duration, userId, moods })
      .then((session: ISessionDocument) => createdSession = session)
      .then(() => User.schema.statics.updateUser(userId, start, duration))
      .then(user => Achievement.schema.statics.updateUser(user))
      .then(() => res.send(createdSession))
      .catch(next);
  });
