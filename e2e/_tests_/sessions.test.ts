import dotenv from 'dotenv';
import moment from 'moment';
import request from '../request';
import connect from '../../lib/utils/connect';
import { dropCollection, dropDatabase } from '../db';

dotenv.config();

describe('Sessions', () => {
  beforeAll(() => {
    return connect(process.env.MONGODB_URI, { log: false });
  });
  beforeEach(() => {
    dropCollection('sessions');
    dropCollection('achievements');
  });
  afterAll(() => dropDatabase());

  const session = {
    start: new Date(),
    duration: 16,
    userId: '123456'
  };
  const session2 = {
    start: moment(new Date()).add(1, 'days'),
    duration: 16,
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
        return request.get('/api/v1/users?userId=123456').expect(200);
      })
      .then(() => {
        return request.get('/api/v1/achievements/new?userId=123456').expect(200);
      })
      .then(({ body }) => {
        expect(body.length).toBeLessThanOrEqual(2);
        expect(body[0].delivered).toBe(false);
      });
  });

  it('posts 2 sessions, gets new achievements, gets all achievements', () => {
    return postSession(session)
      .then(() => {
        return postSession(session2);
      })
      .then(() => {
        return request.get('/api/v1/users?userId=123456').expect(200);
      })
      .then(() => {
        return request.get('/api/v1/achievements/new?userId=123456').expect(200);
      })
      .then(() => {
        return request.get('/api/v1/achievements?userId=123456').expect(200);
      })
      .then(({ body }) => {
        expect(body.length).toBeLessThanOrEqual(2);
        expect(body[0].delivered).toBe(true);
      })
      .then(() => {
        return request.get('/api/v1/achievements/new?userId=123456').expect(200);
      })
      .then(({ body }) => {
        expect(body.length).toBe(0);
      });
  });

  // it('gets average session time', () => {
  //   return postSession(session)
  //     .then(() => {
  //       return request.get('/api/v1/average?userId=123456').expect(200);
  //     })
  //     .then(({ body }) => {
  //       expect(body[0].averageTime).toBe(16);
  //     });
  // });

  // it('gets total session time', () => {
  //   return postSession(session)
  //     .then(() => {
  //       return request.get('/api/v1/total?userId=123456').expect(200);
  //     })
  //     .then(({ body }) => {
  //       expect(body[0].totalTime).toBe(16);
  //     });
  // });

  it('should get a 400', () => {
    return request
      .post('/api/v1/sessions')
      .send(fake)
      .expect(400);
  });
});
