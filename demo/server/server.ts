import express = require('express');
import path = require('path');
import dotenv = require('dotenv')
//routers
import topicRouter from './routes/topic'
import strategyRouter from './routes/strategy';


const PORT = 3000;
const app = express();
dotenv.config()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  '/assets',
  express.static(path.resolve(__dirname, '../client/assets/'))
);

app.get('/', (req,res)=> res.status(200).sendFile(path.join(__dirname, '../client/index.html')));

console.log('inside server')

app.use('/topic', topicRouter)
app.use('/strategy', strategyRouter)

app.get('*', (req, res) => {
  return res.status(404).json();
});
  
app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: 'An error occurred',
  };
  const error = { ...defaultErr, ...err };
  return res.status(error.status).json(error.message);
});

app.listen(PORT)





