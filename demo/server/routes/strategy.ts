import * as express from 'express';
import kafkaController from '../controllers/kafkaController';
import failfastController from '../controllers/failfastController';
import DLQController from '../controllers/DLQController'
const router = express.Router();

router.post('/failfast', 
  failfastController.failfast,  
  (req, res) => {
    return res.status(200).json(res.locals.error);
});

router.post(
  '/dlq',
  kafkaController.makeClient,
  DLQController.dlqProduce,
  DLQController.dlqConsume,
  (req, res) => {
    // return res.status(200).json(res.locals.messages);
  }
);

export default router;
