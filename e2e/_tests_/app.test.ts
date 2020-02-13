import { Request } from 'express';
import request from '../request';

describe('app routes', () => {
  it('returns 404 on non-api bad path', () => {
    return request
      .get('/bad-path')
      .expect(404)
      .expect('Content-Type', /text/);
  });

  it('returns application/json 404 on bad api path', () => {
    return request
      .post('/api/v1/bad-path')
      .expect(404)
      .expect('Content-Type', /json/)
      .then( (res: Request) => {
        expect(res.body.error).toMatch(/not found/i);
      });
  });
});
