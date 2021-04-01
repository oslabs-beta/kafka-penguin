interface messageValue {
    topic: string;
    messages: object[];
}
declare class FailFastError extends Error {
    message: any;
    reference: any;
    name: any;
    retryCount: number;
    strategy: string;
    originalError: any;
    constructor(e: any);
}
declare class FailFast {
    retry: number;
    client: any;
    innerProducer: any;
    constructor(num: number, kafkaJSClient: any);
    producer(): this;
    connect(): any;
    disconnect(): any;
    send(message: messageValue): any;
}
