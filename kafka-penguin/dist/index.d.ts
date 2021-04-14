import { CompressionTypes } from 'kafkajs';
interface messageValue {
    topic: string;
    messages: object[];
}
export declare class FailFastError extends Error {
    message: any;
    reference: any;
    name: any;
    retryCount: number;
    strategy: string;
    originalError: any;
    constructor(e: any);
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
export declare class DeadLetterQueueErrorConsumer extends Error {
    message: any;
    reference: any;
    name: any;
    retryCount: number;
    strategy: string;
    originalError: any;
    constructor(e: any);
}
export declare class DeadLetterQueueErrorProducer extends Error {
    message: any;
    reference: any;
    name: any;
    retryCount: number;
    strategy: string;
    originalError: any;
    constructor(e: any);
}
export declare class DeadLetterQueue {
    client: any;
    topic: string;
    callback?: (message: any) => boolean;
    innerConsumer: any;
    admin: any;
    innerProducer: any;
    constructor(client: any, topic: string, callback?: any);
    producer(): any;
    consumer(groupId: {
        groupId: string;
    }): any;
    createDLQ(): Promise<any>;
}
export declare class IgnoreErrorProducer extends Error {
    message: any;
    reference: any;
    name: any;
    retryCount: number;
    strategy: string;
    originalError: any;
    constructor(e: any);
}
export declare class IgnoreErrorConsumer extends Error {
    message: any;
    reference: any;
    name: any;
    retryCount: number;
    strategy: string;
    originalError: any;
    constructor(e: any);
}
interface messageValue {
    acks?: Number;
    timeout?: Number;
    compression?: CompressionTypes;
    topic: string;
    messages: object[];
}
export default class Ignore {
    client: any;
    topic: string;
    callback?: (message: any) => boolean;
    innerConsumer: any;
    admin: any;
    innerProducer: any;
    constructor(client: any, topic: string, callback?: any);
    producer(): any;
    consumer(groupId: {
        groupId: string;
    }): any;
}
export {};
