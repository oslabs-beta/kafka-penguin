"use strict";
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
            console.log(`FailFast stopped producer after ${this.retry + 1} times!`);
            this.innerProducer.disconnect();
        });
    }
}
module.exports = {
    FailFast,
};
