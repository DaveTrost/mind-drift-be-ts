import { Router, Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { Session } from '../models/Session';

const getUser = ({ query }: Request, res: Response, next: NextFunction) => {
  User
    .find({ userId: query.userId })
    .then(user => res.send(user))
    .catch(next);
};

const getUserAvgTime = ({ query }: Request, res: Response, next: NextFunction) => {
  const { userId } = query;
  Session.schema.statics.averageSessionTime(userId)
    .then((avg: number) => res.json(avg))
    .catch(next);
};

export default Router()
  .get('/users', getUser)
  .get('/users/totalTime', getUser)
  .get('/users/averageTime', getUserAvgTime)
;