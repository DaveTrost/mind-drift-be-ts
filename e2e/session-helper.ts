import request from './request';

export function postSession(sessions: object) {
  return request
    .post('/api/v1/sessions')
    .send(sessions)
    .expect(200)
    .then(({ body }) => body);
};
