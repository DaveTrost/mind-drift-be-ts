import dotenv from 'dotenv';
import request from '../request';
import connect, { disconnect } from '../../lib/utils/connect';
import { dropCollection, dropDatabase, closeConnection } from '../db';
import { postSession } from '../session-helper';

dotenv.config();

describe('Users', () => {
  beforeAll(async () => {
    await connect(process.env.MONGODB_URI, { log: false });
  });
  beforeEach(async () => {
    await dropCollection('users');
    await dropCollection('sessions');
  });
  afterAll(async () => {
    await dropDatabase();
    await closeConnection();
    await disconnect();
  });

  const session1 = {
    start: new Date(),
    duration: 16,
    userId: '123456'
  };
  const session2 = {
    start: new Date(),
    duration: 24,
    userId: '123456'
  };

  it('gets a user after a session is posted', () => {
    return postSession(session1)
      .then(() => {
        return request.get('/api/v1/users?userId=123456').expect(200);
      })
      .then(({ body }) => {
        expect(body[0]).toMatchInlineSnapshot(
          {
            _id: expect.any(String),
            lastSessionDate: expect.any(String)
          },
          `
            Object {
              "__v": 0,
              "_id": Any<String>,
              "currentStreak": 1,
              "lastSessionDate": Any<String>,
              "totalTime": 16,
              "userId": "123456",
            }
          `
        );
      });
  });

  it('gets average session time for a user', () => {
    return postSession(session1)
      .then(() => {
        return postSession(session2);
      })
      .then(() => {
        return request
          .get('/api/v1/users/averageTime?userId=123456')
          .expect(200);
      })
      .then(({ body }) => {
        expect(body[0].averageTime).toBe(20);
      });
  });

  it('gets total session time for a user, two ways', () => {
    return postSession(session1)
      .then(() => {
        return postSession(session2);
      })
      .then(() => {
        return request.get('/api/v1/users/totalTime?userId=123456').expect(200);
      })
      .then(({ body }) => {
        expect(body[0].totalTime).toBe(40);
      })
      .then(() => {
        return request.get('/api/v1/users?userId=123456').expect(200);
      })
      .then(({ body }) => {
        expect(body[0].totalTime).toBe(40);
      });
  });
});
