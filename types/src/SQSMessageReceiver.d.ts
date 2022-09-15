import { EventEmitter } from 'events';
import { SQS } from 'aws-sdk';
import { ReceiveMessageRequest } from 'aws-sdk/clients/sqs';
export declare class SQSMessageReceiver extends EventEmitter {
    sqs: SQS;
    params: ReceiveMessageRequest;
    queueUrl: string;
    constructor(queueUrl: string, sqs: SQS);
    listenMessages(): Promise<void>;
    sqsMessagesToArray(messages: any): any;
    deleteProcessedMessageFromQueue(messageData: any): Promise<void>;
}
