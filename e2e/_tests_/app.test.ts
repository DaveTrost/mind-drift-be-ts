import { Request } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import request from '../request';
import connect from '../../lib/utils/connect';

dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI;

describe('app routes', () => {
  beforeAll(() => {
    return connect(MONGODB_URI, { log: false });
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

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
