import * as express from 'express';
import kafkaController from '../controllers/kafkaController'
import strategyController from '../controllers/strategyController'
const router = express.Router();

router.post('/failfast',
  strategyController.failfast,
  (req, res) => {
    return res.status(200).json(res.locals.error)
  }
)

router.post('/dlq',
  kafkaController.makeClient,
  strategyController.dlq,
  (req, res) => {
    return res.status(200).json(res.locals.DLQClients)
  }
)

export default router