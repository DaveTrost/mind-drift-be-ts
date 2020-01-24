import dotenv from 'dotenv';
import moment from 'moment';
import request from '../request';
import connect, { disconnect } from '../../lib/utils/connect';
import { dropCollection, dropDatabase, closeConnection } from '../db';

dotenv.config();

describe('Sessions', () => {
  beforeAll(async () => {
    await connect(process.env.MONGODB_URI, { log: false });
  });
  beforeEach(async () => {
    await dropCollection('sessions');
    await dropCollection('users');
    await dropCollection('achievements');
  });
  afterAll( async() => {
    await dropDatabase();
    await closeConnection();
    await disconnect();
  });

  const session = {
    start: new Date(),
    duration: 16,
    userId: '123456'
  };
  const session2 = {
    start: moment(new Date()).add(1, 'days'),
    duration: 24,
    userId: '123456'
  };
  const fake = {
    start: true,
    duration: {},
    userId: []
  };

  function postSession(sessions: object) {
    return request
      .post('/api/v1/sessions')
      .send(sessions)
      .expect(200)
      .then(({ body }) => body);
  }

  it('posts a session', () => {
    return postSession(session)
      .then((body: object) => {
        expect(body).toMatchInlineSnapshot(
          {
            ...session,
            __v: 0,
            _id: expect.any(String),
            start: expect.any(String)
          },
          `
          Object {
            "__v": 0,
            "_id": Any<String>,
            "duration": 16,
            "start": Any<String>,
            "userId": "123456",
          }
        `
        );
      });
  });

  it('gets a session', () => {
    return postSession(session)
      .then(() => {
        return request.get('/api/v1/sessions?userId=123456').expect(200);
      })
      .then(({ body }) => {
        expect(body.length).toBe(1);
        expect(body[0].duration).toBe(16);
      });
  });

  it('finds a user after the session is posted', () => {
    return postSession(session)
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
              "userId": "123456",
            }
          `
        );
      });
  });

  it('posts 2 sessions and gets new achievements', () => {
    return postSession(session)
      .then(() => {
        return postSession(session2);
      })
      .then(() => {
        return request.get('/api/v1/achievements/new?userId=123456').expect(200);
      })
      .then(({ body }) => {
        expect(body.length).toBeLessThanOrEqual(2);
        expect(body[0].delivered).toBe(false);
      });
  });

  it('marks achievements as "delivered" after they are retrieved the first time', () => {
    return postSession(session)
      .then(() => {
        return postSession(session2);
      })
      .then(() => {
        return request.get('/api/v1/achievements?userId=123456').expect(200);
      })
      .then(() => {
        return request.get('/api/v1/achievements?userId=123456').expect(200);
      })
      .then(({ body }) => {
        expect(body.length).toBeLessThanOrEqual(2);
        expect(body[0].delivered).toBe(true);
      });
  });

  it('can retrieve "all" achievements (marked delivered) after retrieving "new" achievements (marked undelivered)', () => {
    return postSession(session)
      .then(() => {
        return postSession(session2);
      })
      .then(() => {
        return request.get('/api/v1/achievements/new?userId=123456').expect(200);
      })
      .then(({ body }) => {
        expect(body.length).toBeLessThanOrEqual(2);
        expect(body[0].delivered).toBe(false);
      })
      .then(() => {
        return request.get('/api/v1/achievements?userId=123456').expect(200);
      })
      .then(({ body }) => {
        expect(body.length).toBeLessThanOrEqual(2);
        expect(body[0].delivered).toBe(true);
      });
  });

  it('cannot retrieve any "new" achievements after retrieving "all" achievements', () => {
    return postSession(session)
      .then(() => {
        return postSession(session2);
      })
      .then(() => {
        return request.get('/api/v1/achievements?userId=123456').expect(200);
      })
      .then(({ body }) => {
        expect(body.length).toBeLessThanOrEqual(2);
      })
      .then(() => {
        return request.get('/api/v1/achievements/new?userId=123456').expect(200);
      })
      .then(({ body }) => {
        expect(body.length).toBe(0);
      });
  });

  it('gets average session time for a user', () => {
    return postSession(session)
      .then(() => {
        return postSession(session2);
      })
      .then(() => {
        return request.get('/api/v1/users/averageTime?userId=123456').expect(200);
      })
      .then(({ body }) => {
        expect(body[0].averageTime).toBe(20);
      });
  });

  it('gets total session time for a user', () => {
    return postSession(session)
      .then(() => {
        return postSession(session2);
      })
      .then(() => {
        return request.get('/api/v1/users/totalTime?userId=123456').expect(200);
      })
      .then(({ body }) => {
        expect(body[0].totalTime).toBe(40);
      });
  });

  it('should get a 400', () => {
    return request
      .post('/api/v1/sessions')
      .send(fake)
      .expect(400);
  });
});
