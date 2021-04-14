import * as express from 'express';
import kafkaController from '../controllers/kafkaController';
import failfastController from '../controllers/failfastController';
import DLQController from '../controllers/DLQController';
// import ignoreController from '../controllers/ignoreController';

const router = express.Router();

router.post('/failfast',
  failfastController.failfast,
  (req, res) => res.status(200).json(res.locals.error));

router.post(
  '/dlq',
  kafkaController.makeClient,
  DLQController.dlqProduce,
  DLQController.dlqConsume,
  (req, res) => res.status(200).json(res.locals.error),
);

// router.post(
//   '/ignore',
//   kafkaController.makeClient,
//   ignoreController.ignoreProduce,
//   ignoreController.ignoreConsume,
//   (req, res) => res.status(200).json(res.locals.error),
// );

export default router;
