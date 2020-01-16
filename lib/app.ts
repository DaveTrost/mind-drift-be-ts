import express from 'express';
import cors from 'cors';
import errorHandler from './middleware/error';
import apiNotFound from './middleware/not-found';

const app = express();
app.use(express.json());
app.use(cors());

const API_PATH = '/api/v1';

// app.use(API_PATH, require('./routes/sessions'));
// app.use(API_PATH, require('./routes/settings'));
// app.use(API_PATH, require('./routes/achievements'));
// app.use(API_PATH, require('./routes/users'));
// app.use(API_PATH, require('./routes/aggregations/sessionAggs'));

app.use(API_PATH, apiNotFound);
app.use(errorHandler);

export default app;
