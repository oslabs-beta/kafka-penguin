import { RequestHandler } from 'express'




const getTopics: RequestHandler = async (req, res, next) => {

  // console.log('Inside of getTopics')
  const kafka = res.locals.kafka;
  const admin = kafka.admin();

  await admin.connect();

  const topicsData = await admin.fetchTopicMetadata();
  await admin.disconnect()
  console.log('TopicsData is', topicsData);
  res.locals.topicsData = topicsData;

  return next()

}


export default {
  getTopics,
}