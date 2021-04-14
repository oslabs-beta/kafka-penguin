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
declare class DeadLetterQueueErrorProducer extends Error {
    message: any;
    reference: any;
    name: any;
    retryCount: number;
    strategy: string;
    originalError: any;
    constructor(e: any);
}
declare class DeadLetterQueueErrorConsumer extends Error {
    message: any;
    reference: any;
    name: any;
    retryCount: number;
    strategy: string;
    originalError: any;
    constructor(e: any);
}
declare class DeadLetterQueue {
    client: any;
    topic: string;
    callback?: (message: any) => boolean;
    innerConsumer: any;
    admin: any;
    innerProducer: any;
    constructor(client: any, topic: string, callback?: (message: any) => boolean);
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
