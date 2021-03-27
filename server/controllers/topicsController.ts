import { RequestHandler } from 'express'

const getTopics: RequestHandler = async (req, res, next) => {
  const kafka = res.locals.kafka;
  const admin = kafka.admin();
  await admin.connect();
  const topicsData = await admin.fetchTopicMetadata();
  await admin.disconnect()
  res.locals.topicsData = topicsData;
  return next()

}

export default {
  getTopics,
}