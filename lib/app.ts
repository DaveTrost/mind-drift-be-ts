import express from 'express';
import cors from 'cors';
import errorHandler from './middleware/error';
import apiNotFound from './middleware/not-found';
import sessions from './routes/sessions';
import settings from './routes/settings';
import users from './routes/users';
import achievements from './routes/achievements';

const app = express();
app.use(express.json());
app.use(cors());

const API_PATH = '/api/v1';

app.use(API_PATH, sessions);
app.use(API_PATH, users);
app.use(API_PATH, achievements);
app.use(API_PATH, settings);

app.use(API_PATH, apiNotFound);
app.use(errorHandler);

export default app;
