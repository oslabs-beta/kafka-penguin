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
    this.strategy = 'Fail Fast';
    this.reference = `This error was executed as part of the kafka-penguin Fail Fast message reprocessing strategy. Your producer attempted to deliver a message ${e.retryCount + 1} times but was unsuccessful. As a result, the producer successfully executed a disconnect operation. Refer to the original error for further information`;
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
    // Return curr FailFast instance instead of a producer
    return this;

  }

  connect() { 
    return () => {
      this.innerProducer.connect();
      this.innerAdmin.connect();
    }
  }
  disconnect() {
    return this.innerProducer.disconnect()
  }
  send(message: messageValue) {
    return this.innerProducer.send(message)
      .catch(async (e: any) => {

    
        this.innerProducer.send({
          ...message,
          topic: `${message.topic}.dlq`,
        })

        // produce to dlq topic failed message
        const newError = new FailFastError(e)
        console.log(newError)       
      })
  } 
}

module.exports = {
  DeadLetterQueue,
};

