import dotenv from 'dotenv';
import app from './lib/app';
// import connect from './lib/utils/connect';

// connect();

dotenv.config();
const PORT = process.env.PORT || 7891;

app.listen(PORT, () => {
  console.log(`Started on ${PORT}`);
});
