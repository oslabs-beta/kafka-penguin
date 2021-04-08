interface messageValue {
  topic: string,
  messages: object[],
}
class DeadLetterQueueError extends Error {
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
  innerProducer: any;

  constructor (client: any, topic: string, callback?: (message: any) => boolean) {
    this.topic = topic;
    this.client = client;
    this.callback = callback;
    this.admin = this.client.admin();
    this.innerConsumer = null;
    this.innerProducer = this.client.producer();
  }

  consumer(groupId: {
    groupId: string
  }) {
    this.innerConsumer = this.client.consumer(groupId);
    const dlqInstance = this;
    // return consumer object;
    return {
      createDLQ() {
        return dlqInstance.createDLQ();
      },
      connect() { 
        return dlqInstance.innerConsumer.connect();
      },
      disconnect () {
        return dlqInstance.innerConsumer.disconnect();
      },
      subscribe() {
        return dlqInstance.innerConsumer.subscribe({ topic: dlqInstance.topic, fromBeginning: false });
      },
      run(input: input) {
        const { eachMessage } = input;
        return dlqInstance.innerConsumer.run({
          eachMessage: ({ topic, partitions, message }: { topic: string, partitions: number, message: any }) => {
            try {
              //If user doesn't pass in callback, we'll simply listen
              //to and return errors
              // if (dlqInstance.callback)
              if (dlqInstance.callback && dlqInstance.callback(message)) {
                dlqInstance.callback(message)
              }
              eachMessage({ topic, partitions, message });

            } catch (e) {

              console.error('kafka-penguin: is sending invalid message to DLQ');
              
               dlqInstance.innerProducer.connect()
                  .then(() => console.log('kafka-penguin: Connected to DLQ topic'))
                  .then(() => {
                   
                    dlqInstance.innerProducer.send({
                      topic: `${dlqInstance.topic}.deadLetterQueue`,
                      messages: [message],
                    })
                  })
                  .then(() => console.log('kafka-penguin: Message published to DLQ'))
                  .then(() => dlqInstance.innerProducer.disconnect())
                  .then(() => console.log('kafka-penguin: Producer disconnected'))
                  .catch((e: Error) => console.log('ERROR WITH PRODUCING TO DLQ: ', e));
            }
          },
        });
      }
    }
  }
  
  
  // createDLQ will create a topic
  async createDLQ () {

    const adminCreateDLQ = await this.admin.connect()
      .then( async () => {
        await this.admin.createTopics({
          topics: [{
            topic: `${this.topic}.deadLetterQueue`,
            numPartitions: 1,
            replicationFactor: 1,
            replicaAssignment: [{ partition: 0, replicas: [0, 1, 2] }],
          }],
        });
      })
      .then(() => this.admin.disconnect())
      .catch((err: Error) => console.log('Error in createDLQ', err));
      return adminCreateDLQ;
  }

  

  
}

module.exports = DLQ;