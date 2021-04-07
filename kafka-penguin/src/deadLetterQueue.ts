interface input {
 eachMessage: ({
    topic, 
    partitions, 
    message
  } : { 
    topic: string,
    partitions: number,
    message: any
  }) => void
}

class DLQ {
  client: any;
  topic: string;
  callback?: (message: any) => boolean;
  innerConsumer: any;
  admin: any;
  producer: any;

  constructor (client: any, topic: string, callback?: (message: any) => boolean) {
    this.topic = topic;
    this.client = client;
    this.callback = callback;
    this.admin = this.client.admin();
    this.innerConsumer = null;
    this.producer = this.client.producer();
  }

  consumer(groupId: {
    groupId: string
  }) {
    this.innerConsumer = this.client.consumer(groupId);
    return this;
  }

  connect () {
    return this.innerConsumer.connect();
  }

  disconnect () {
    return this.innerConsumer.disconnect();
  }
  // createDLQ will create a topic
  async createDLQ () {

    const adminCreateDLQ = await this.admin.connect()
      .then( async () => {
        const topics = await this.admin.createTopics({
          topics: [{
            topic: `${this.topic}.deadLetterQueue`,
            numPartitions: 1,
            replicationFactor: 1,
            replicaAssignment: [{ partition: 0, replicas: [0, 1, 2] }],
          }],
        });
      })
      .then(() => this.admin.disconnect())
      .catch((err:any) => console.log('Error in createDLQ', err));
      return adminCreateDLQ;
  }

  subscribe() {
    return this.innerConsumer.subscribe({ topic: this.topic, fromBeginning: false });
  }

  run (input: input) {
    const { eachMessage } = input;
    return this.innerConsumer.run({
      eachMessage: ({ topic, partitions, message }: { topic: string, partitions: number, message: any}) => {
        try {
          //If user doesn't pass in callback, we'll simply listen
          //to and return errors
          if (this.callback) this.callback(message);
          eachMessage({ topic, partitions, message });

        } catch (e) {

          console.error('kafka-penguin: is sending invalid message to DLQ');
          this.producer.connect()
            .then(() => console.log('kafka-penguin: Connected to DLQ topic'))
            .then(() => this.producer.send({
              topic: `${this.topic}.deadLetterQueue`,
              messages: [
                message,
              ],
            }))
            .then(() => console.log('kafka-penguin: Message published to DLQ'))
            .then(() => this.producer.disconnect())
            .then(() => console.log('kafka-penguin: Producer disconnected'))
            .catch((e:any) => console.log('ERROR WITH PRODUCING TO DLQ: ', e));
        }
      },
    });
  }
}

module.exports = DLQ;
