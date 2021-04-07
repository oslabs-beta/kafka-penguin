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
  }) => voids
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
              if (dlqInstance.callback) dlqInstance.callback(message);
              eachMessage({ topic, partitions, message });

            } catch (e) {

              console.error('kafka-penguin: is sending invalid message to DLQ');
              dlqInstance.innerConsumer.connect()
                .then(() => console.log('kafka-penguin: Connected to DLQ topic'))
                .then(() => dlqInstance.innerProducer.send({
                  topic: `${dlqInstance.topic}.deadLetterQueue`,
                  messages: [
                    message,
                  ],
                }))
                .then(() => console.log('kafka-penguin: Message published to DLQ'))
                .then(() => dlqInstance.innerProducer.disconnect())
                .then(() => console.log('kafka-penguin: Producer disconnected'))
                .catch((e: any) => console.log('ERROR WITH PRODUCING TO DLQ: ', e));
            }
          },
        });
      }
    }
  }
  producer() {
    return {
        connect() {
          // create new client
          const innerProducer = new Kafka(this.client);
          
          // connect to broker
         
          return producer.connect()
      },
      disconnect(producer = this.innerProducer) {
        return producer.disconnect();
      },
        send(message: any, producer = this.innerProducer) {
          return producer.send(message: message)
            .catch((e: any) => {
              this.innerProducer.disconnect();
                const newError = new FailFastError(e)   
             })
          
        }
      }

      
      
    }
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

  

  
}

module.exports = DLQ;