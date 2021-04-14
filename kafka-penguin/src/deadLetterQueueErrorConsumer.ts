export default class DeadLetterQueueErrorConsumer extends Error {
  message: any;

  reference: any;

  name: any;

  retryCount: number;

  strategy: string;

  originalError: any;

  constructor(e: any) {
    super(e);
    Error.captureStackTrace(this, this.constructor);
    this.strategy = 'Dead Letter Queue';
    this.reference = `This error was executed as part of the kafka-penguin Dead Letter Queue message reprocessing strategy. Your consumer attempted to receive a message ${e.retryCount + 1} times but was unsuccessful. As a result, the message was sent to a Dead Letter Queue. Refer to the original error for further information`;
    this.name = `${e.name}(Consumer Side)`;
    this.message = e.message;
    this.originalError = e.originalError;
    this.retryCount = e.retryCount;
  }
}
