import connect, { disconnect } from '../../lib/utils/connect';

describe('mongoDB connection utility', () => {
  it('logs connection details in the console', async () => {
    await connect();
    await disconnect();
  });
});
