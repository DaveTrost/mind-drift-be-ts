import { Router, Request, Response, NextFunction } from 'express';
import { Setting } from '../models/Setting';

export default Router()
  .get('/settings', ({ query }: Request, res: Response, next: NextFunction) => {
    const settingsQuery = { $in: ['__default__', query.userId || ''] };
    Setting
      .find({ userId: settingsQuery })
      .then(settings => res.send(settings))
      .catch(next);
  })

  .post('/settings', ({ body }: Request, res: Response, next: NextFunction) => {
    const { userId, title, description, inhale, holdIn, exhale, holdOut, endTime } = body;
    Setting
      .create({ userId, title, description, inhale, holdIn, exhale, holdOut, endTime })
      .then(settings => res.send(settings))
      .catch(next);
  })

  .put('/settings/:id', ({ params, body }: Request, res: Response, next: NextFunction) => {
    Setting
      .findByIdAndUpdate(
        params.id,
        body, 
        { new: true })
      .then(updatedSettings => res.json(updatedSettings))
      .catch(next);
  })

  .delete('/settings/:id', ({ params }: Request, res: Response, next: NextFunction) => {
    Setting
      .findByIdAndRemove(params.id)
      .then(deleted => res.json(deleted))
      .catch(next);
  });
