interface messageValue {
  topic: string,
  messages: object[],
}

class OldDLQ extends Error {
  message: any;
  reference: any;
  name: any;
  retryCount: number;
  strategy: string;
  originalError: any;
  constructor(e: any) {
    super(e);
    Error.captureStackTrace(this, this.constructor)
    this.strategy = 'Dead Letter Queue';
    this.reference = `This error was executed as part of the kafka-penguin Dead Letter Queue message reprocessing strategy. Your producer attempted to deliver a message ${e.retryCount + 1} times but was unsuccessful. As a result, the message was sent to a Dead Letter Queue. Refer to the original error for further information`;
    this.name = e.name;
    this.message = e.message;
    this.originalError = e.originalError;
    this.retryCount = e.retryCount;
  }
}
class DeadLetterQueue {
  retry: number;
  client: any;
  innerProducer: any;
  innerAdmin: any;
  constructor(num: number, kafkaJSClient: any) {
    this.retry = num;
    this.client = kafkaJSClient;
    this.innerProducer = null;
    this.innerAdmin = null;
  }

  producer() {
    const options = {
      retry:
        { retries: this.retry }
    }
    // Create a producer from client passing in retry options
    // Save to FailFast class
    this.innerProducer = this.client.producer(options);
    this.innerAdmin = this.client.admin();
    // Return curr FailFast instance instead of a producer
    return this;

  }

  connect() {
    return this.innerProducer.connect()
      .then(() => {
        this.innerAdmin.connect();
      })
  }
  disconnect() {
    return this.innerProducer.disconnect()
  }
  send(message: messageValue) {
    return this.innerProducer.send(message)
      .catch((e: any) => {
        this.innerAdmin.createTopics({
          topics: [{
            topic: `${message.topic}.dlq`,
            replicationFactor: 1,
            replicaAssignment: 1,
            configEntries: [
              {
                name: 'cleanup.policy',
                value: 'compact'
              }
            ]
          }]
        })
          .then(() => {
            this.innerProducer.send({
              ...message,
              topic: `${message.topic}.dlq`,
            })

          })
        // produce to dlq topic failed message
        const newError = new DeadLetterQueueError(e)
        console.log(newError)
      })
  }
}

module.exports = {
  DeadLetterQueue,
};
