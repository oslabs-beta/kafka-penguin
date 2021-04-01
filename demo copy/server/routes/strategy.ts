import * as express from 'express';
import kafkaController from '../controllers/kafkaController'
import strategyController from '../controllers/strategyController'
const router = express.Router();

router.post('/failfast', 
  kafkaController.makeClient,
  strategyController.failfast,
  (req, res) => {
    return res.status(200).json(res.locals.error)
  }
)

export default router