

interface messageValue {
  topic: string,
  messages: object[],
}
class FailFast {
  retry: number;
  client: any; 
  innerProducer: any;
  constructor(num: number, kafkaJSClient: any) {
    this.retry = num;
    this.client = kafkaJSClient;
    this.innerProducer = null;
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
    return this.innerProducer.connect()
  }

  send(message: messageValue) {
    return this.innerProducer.send(message)
    .catch((e: { retryCount?: any }) => {
      console.log(`FailFast stopped producer after ${this.retry + 1} times!`);
      this.innerProducer.disconnect();
    })
  } 
}

module.exports = {
  FailFast,
};