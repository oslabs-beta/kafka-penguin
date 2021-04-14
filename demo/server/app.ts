// routers
import express from 'express';
import path from 'path';
import dotenv from 'dotenv';

import strategyRouter from './routes/strategy';
import topicRouter from './routes/topic';

const app = express();

dotenv.config(); app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/assets', express.static(path.resolve(__dirname, '../client/assets/')));
app.use('/js', express.static(path.resolve(__dirname, '../build/js/')));

app.get('/', (req, res) => res.status(200).sendFile(path.join(__dirname, '../build/index.html')));

app.use('/topic', topicRouter);
app.use('/strategy', strategyRouter);
app.get('/*', (req, res) => res.status(200).sendFile(path.resolve(__dirname, '../build/index.html')));
app.get('*', (req, res) => res.status(404).json());

app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: 'An error occurred',
  };
  const error = {
    ...defaultErr,
    ...err,
  };
  return res.status(error.status).json(error.message);
});

export default app;
