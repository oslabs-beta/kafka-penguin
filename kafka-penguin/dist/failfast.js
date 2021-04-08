"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class FailFastError extends Error {
    constructor(e) {
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
class FailFast {
    constructor(num, kafkaJSClient) {
        this.retry = num;
        this.client = kafkaJSClient;
        this.innerProducer = null;
    }
    producer() {
        const options = {
            retry: { retries: this.retry }
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
    send(message) {
        return this.innerProducer.send(message)
            .catch((e) => {
            this.innerProducer.disconnect();
            const newError = new FailFastError(e);
            console.log(newError);
        });
    }
}
exports.default = FailFast;
