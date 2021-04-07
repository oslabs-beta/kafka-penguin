interface messageValue {
  topic: string,
  messages: object[],
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
              const catchLogic = async () => {
               await dlqInstance.innerConsumer.connect()
                  .then(() => console.log('kafka-penguin: Connected to DLQ topic'))
                  .then(() => {
                    console.log("DLQ message", message)
                    dlqInstance.innerProducer.send({
                      topic: `${dlqInstance.topic}.deadLetterQueue`,
                      messages: [
                        {
                          key: message.key,
                          value: message.value
                        },
                      ],
                    })
                  })
                  .then(() => console.log('kafka-penguin: Message published to DLQ'))
                  // .then(() => dlqInstance.innerProducer.disconnect())
                  .then(() => console.log('kafka-penguin: Producer disconnected'))
                  .catch((e: any) => console.log('ERROR WITH PRODUCING TO DLQ: ', e));
              }
              catchLogic();
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
      .catch((err:any) => console.log('Error in createDLQ', err));
      return adminCreateDLQ;
  }

  

  
}

module.exports = DLQ;