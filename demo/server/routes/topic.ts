import * as express from 'express';
import topicsController from '../controllers/topicsController';
import kafkaController from '../controllers/kafkaController';

const router = express.Router();

router.post('/getTopics',
  kafkaController.makeClient,
  topicsController.getTopics,
  (req, res) => res.status(200).json(res.locals.topicsData));

export default router;
