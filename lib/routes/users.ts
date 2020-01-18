import { Router, Request, Response, NextFunction } from 'express';
import { User } from '../models/User';

export default Router()
  .get('/users', ({ query }: Request, res: Response, next: NextFunction) => {
    console.log(query);
    
    User
      .find({ userId: query.userId })
      .then(user => res.send(user))
      .catch(next);
  });
