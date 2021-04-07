import client from './clientConfig';

const admin = client.admin();

admin.connect()
  .then(() => admin.listTopics())
  .then((data) => console.log(data))
  // .then(admin.disconnect())

  .then(async () => {
    await admin.createTopics({
    topics: [
      {
        topic: 'heidi',
        numPartitions: 1,
        replicationFactor: 1,
        replicaAssignment: [{ partition: 0, replicas: [0, 1, 2] }],
      },
    ],
  })})
  .then(() => admin.disconnect())
  .catch((e) => console.log(e));
