import dotenv from 'dotenv';
import request from '../request';
import connect from '../../lib/utils/connect';
import { dropCollection, dropDatabase, closeConnection } from '../db';

dotenv.config();

describe('Settings', () => {
  beforeAll(() => {
    connect(process.env.MONGODB_URI, { log: false });
  });
  beforeEach(async () => {
    await dropCollection('settings');
  });
  afterAll( async() => {
    await dropDatabase();
    await closeConnection();
  });

  const settings1 = {
    userId: '5689',
    title: 'Box Breathing',
    description: 'This is a breathing technique.',
    inhale: 5,
    holdIn: 4,
    exhale: 5,
    holdOut: 4,
    endTime: 126
  };
  const settings2 = {
    userId: '123456',
    title: 'Different Breathing Type',
    description: 'This is a different breathing technique.',
    inhale: 3,
    holdIn: 4,
    exhale: 5,
    holdOut: 1,
    endTime: 16
  };
  const settings3 = {
    userId: '1234',
    title: 'Different Breathing Type',
    description: 'This is a different breathing technique.',
    inhale: 3,
    holdIn: 4,
    exhale: 5,
    holdOut: 1,
    endTime: 16
  };

  function postSettings(settings) {
    return request
      .post('/api/v1/settings')
      .send(settings)
      .expect(200)
      .then(({ body }) => body);
  }

  it('posts settings', () => {
    return postSettings(settings1)
      .then((body) => {
        expect(body).toMatchInlineSnapshot(
          {
            ...settings1,
            _id: expect.any(String)
          },
          `
          Object {
            "__v": 0,
            "_id": Any<String>,
            "description": "This is a breathing technique.",
            "endTime": 126,
            "exhale": 5,
            "holdIn": 4,
            "holdOut": 4,
            "inhale": 5,
            "title": "Box Breathing",
            "userId": "5689",
          }
        `
        );
      });
  });

  // it('gets settings', () => {
  //   return postSettings(settings1)
  //     .then(() => {
  //       return request
  //         .get('/api/v1/settings?userId=5689')
  //         .expect(200);
  //     })
  //     .then(({ body }) => {
  //       expect(body.length).toBe(1);
  //       expect(body[0].title).toBe('Box Breathing');
  //     });
  // });

  // it('gets settings #2', () => {
  //   return postSettings(settings2)
  //     .then(() => {
  //       return request
  //         .get('/api/v1/settings?userId=123456')
  //         .expect(200);
  //     })
  //     .then(({ body }) => {
  //       expect(body.length).toBe(1);
  //       expect(body[0].title).toBe('Different Breathing Type');
  //     });
  // });

  // it('returns an empty array when no userId is input to URL', () => {
  //   return postSettings(settings3)
  //     .then(() => {
  //       return request
  //         .get('/api/v1/settings')
  //         .expect(200);
  //     })
  //     .then(({ body }) => {
  //       expect(body.length).toBe(0);
  //     });
  // });

  // it('puts new settings', () => {
  //   return postSettings(settings1)
  //     .then(settings => {
  //       settings.title = 'new title';
  //       return request
  //         .put(`/api/v1/settings/${settings._id}`)
  //         .send(settings)
  //         .expect(200);
  //     })
  //     .then(({ body }) => {
  //       expect(body.title).toBe('new title');
  //     });
  // });

  // it('deletes a setting', () => {
  //   return postSettings(settings1)
  //     .then(response => {
  //       return request
  //         .delete(`/api/v1/settings/${response._id}`)
  //         .expect(200)
  //         .then(() => {
  //           return request
  //             .get('/api/v1/settings')
  //             .expect(200)
  //             .then(({ body }) => {
  //               expect(body.length).toBe(0);
  //             });
  //         });
  //     });
  // });
});
