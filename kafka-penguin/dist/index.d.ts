interface messageValue {
    topic: string;
    messages: object[];
}
interface input {
    eachMessage: ({ topic, partitions, message }: {
        topic: string;
        partitions: number;
        message: any;
    }) => void;
}
export declare class DeadLetterQueue {
    client: any;
    topic: string;
    callback?: (message: any) => boolean;
    innerConsumer: any;
    admin: any;
    innerProducer: any;
    constructor(client: any, topic: string, callback?: any);
    producer(): {
        connect(): any;
        disconnect(): any;
        send(message: messageValue): any;
    };
    consumer(groupId: {
        groupId: string;
    }): {
        connect(): any;
        disconnect(): any;
        subscribe(): any;
        run(input: input): any;
    };
    createDLQ(): Promise<any>;
}
interface messageValue {
    topic: string;
    messages: object[];
}
export declare class FailFast {
    retry: number;
    client: any;
    innerProducer: any;
    constructor(num: number, kafkaJSClient: any);
    producer(): this;
    connect(): any;
    disconnect(): any;
    send(message: messageValue): any;
}
export {};
