interface messageValue {
    topic: string;
    messages: object[];
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
