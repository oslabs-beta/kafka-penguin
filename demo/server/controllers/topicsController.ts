import { RequestHandler } from 'express';

const getTopics: RequestHandler = (req, res, next) => {
  const { kafka } = res.locals;
  const admin = kafka.admin();
  admin.connect()
    .then(() => console.log('Connected'))
    .then(() => admin.fetchTopicMetadata())
    .then((data: {
      name: string,
      partitions: Array<number>
    }) => { res.locals.topicsData = data; })
    .then(() => admin.disconnect())
    .then(() => next())
    .catch((e) => next({
      message: `Error getting topics in topicsController.getTopics ${e.message}`,
      error: e,
    }));
};

export default {
  getTopics,
};
