import dotenv from 'dotenv';
import moment from 'moment';
import request from '../request';
import { postSession } from '../session-helper';
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
  afterAll(async () => {
    await dropDatabase();
    await closeConnection();
    await disconnect();
  });
  
  const sessionDay0 = {
    start: new Date(),
    duration: 16,
    userId: '123456'
  };
  const sessionDay1 = {
    start: moment(new Date()).add(1, 'days'),
    duration: 24,
    userId: '123456'
  };
  const sessionDay5 = {
    start: moment(new Date()).add(5, 'days'),
    duration: 40,
    userId: '123456'
  };
  const badSessionData = {
    start: true,
    duration: {},
    userId: []
  };
  
  it('posts a session', () => {
    return postSession(sessionDay0)
      .then((body: object) => {
        expect(body).toMatchInlineSnapshot(
          {
            ...sessionDay0,
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
    return postSession(sessionDay0)
      .then(() => {
        return request.get('/api/v1/sessions?userId=123456').expect(200);
      })
      .then(({ body }) => {
        expect(body.length).toBe(1);
        expect(body[0].duration).toBe(16);
      });
  });

  it('gets all sessions', () => {
    return postSession(sessionDay0)
      .then(() => {
        return postSession(sessionDay0);
      })
      .then(() => {
        return postSession(sessionDay5);
      })
      .then(() => {
        return request.get('/api/v1/sessions').expect(200);
      })
      .then(({ body }) => {
        expect(body.length).toBe(3);
      });
  });

  it('posts 2 sessions and gets new achievements', () => {
    return postSession(sessionDay0)
      .then(() => {
        return postSession(sessionDay1);
      })
      .then(() => {
        return request
          .get('/api/v1/achievements/new?userId=123456')
          .expect(200);
      })
      .then(({ body }) => {
        expect(body.length).toBeLessThanOrEqual(2);
        expect(body[0].delivered).toBe(false);
      });
  });

  it('marks achievements as **delivered** after they are retrieved the first time', () => {
    return postSession(sessionDay0)
      .then(() => {
        return postSession(sessionDay1);
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

  it('can retrieve **all** achievements (marked delivered) after retrieving **new** achievements (marked undelivered)', () => {
    return postSession(sessionDay0)
      .then(() => {
        return postSession(sessionDay1);
      })
      .then(() => {
        return request
          .get('/api/v1/achievements/new?userId=123456')
          .expect(200);
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

  it('cannot retrieve any **new** achievements after retrieving **all** achievements', () => {
    return postSession(sessionDay0)
      .then(() => {
        return postSession(sessionDay1);
      })
      .then(() => {
        return request.get('/api/v1/achievements?userId=123456').expect(200);
      })
      .then(({ body }) => {
        expect(body.length).toBeLessThanOrEqual(2);
      })
      .then(() => {
        return request
          .get('/api/v1/achievements/new?userId=123456')
          .expect(200);
      })
      .then(({ body }) => {
        expect(body.length).toBe(0);
      });
  });

  it('should get a 400 error', () => {
    return request
      .post('/api/v1/sessions')
      .send(badSessionData)
      .expect(400);
  });
});
