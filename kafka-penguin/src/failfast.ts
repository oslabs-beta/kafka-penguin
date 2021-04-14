import FailFastError from './failfasterror';

interface messageValue {
  topic: string,
  messages: object[],
}
export default class FailFast {
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
        { retries: this.retry },
    };
    // Create a producer from client passing in retry options
    // Save to FailFast class
    this.innerProducer = this.client.producer(options);
    // Return curr FailFast instance instead of a producer
    return this;
  }

  connect() {
    return this.innerProducer.connect();
  }

  disconnect() {
    return this.innerProducer.disconnect();
  }

  send(message: messageValue) {
    return this.innerProducer.send(message)
      .catch((e: any) => {
        this.innerProducer.disconnect();
        const newError = new FailFastError(e);
        // eslint-disable-next-line no-console
        console.log(newError);
      });
  }
}
