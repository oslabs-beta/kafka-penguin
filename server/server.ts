import express = require('express');
import path = require('path');
const app = express();
import topicRouter from './routes/topic';
const PORT = 3000;
//POST Login page details
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//GET Login page details
app.get('/', (req,res)=> res.status(200).sendFile(path.join(__dirname, '../client/index.html')));

console.log('inside server')
app.use('/topic', topicRouter)

//Error Handling & Global error handler
app.get('*', (req, res) => {
    return res.status(404).json();
  });
  
// app.use((err, req, res, next) => {
// const defaultErr = {
//     log: 'Express error handler caught unknown middleware error',
//     status: 500,
//     message: 'An error occurred',
// };
// const error = { ...defaultErr, ...err };
// return res.status(error.status).json(error.message);
// });

//Set up a listener to a specific port here
console.log(PORT)
app.listen(PORT)





