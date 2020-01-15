import express from 'express';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

// app.use('/api/v1', require('./routes/sessions'));
// app.use('/api/v1', require('./routes/settings'));
// app.use('/api/v1', require('./routes/achievements'));
// app.use('/api/v1', require('./routes/users'));
// app.use('/api/v1', require('./routes/aggregations/sessionAggs'));

app.use(require('./middleware/not-found'));
// app.use(require('./middleware/error'));

export default app;
