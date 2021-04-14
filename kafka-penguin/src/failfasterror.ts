export default class FailFastError extends Error {
  message: any;

  reference: any;

  name: any;

  retryCount: number;

  strategy: string;

  originalError: any;

  constructor(e: any) {
    super(e);
    Error.captureStackTrace(this, this.constructor);
    this.strategy = 'Fail Fast';
    this.reference = `This error was executed as part of the kafka-penguin Fail Fast message reprocessing strategy. Your producer attempted to deliver a message ${e.retryCount + 1} times but was unsuccessful. As a result, the producer successfully executed a disconnect operation. Refer to the original error for further information`;
    this.name = e.name;
    this.message = e.message;
    this.originalError = e.originalError;
    this.retryCount = e.retryCount;
  }
}
