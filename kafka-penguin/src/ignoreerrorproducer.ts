export default class IgnoreErrorProducer extends Error {
  message: any;

  reference: any;

  name: any;

  retryCount: number;

  strategy: string;

  originalError: any;

  constructor(e: any) {
    super(e);
    Error.captureStackTrace(this, this.constructor);
    this.strategy = 'Ignore';
    this.reference = `This error was executed as part of the kafka-penguin Ignore message reprocessing strategy. Your producer attempted to deliver a message ${e.retryCount + 1} times but was unsuccessful.`;
    this.name = `${e.name} (Producer Side)`;
    this.message = e.message;
    this.originalError = e.originalError;
    this.retryCount = e.retryCount;
  }
}
