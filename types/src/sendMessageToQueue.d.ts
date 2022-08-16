import { SendMessageResult } from 'aws-sdk/clients/sqs';
import { SQS } from 'aws-sdk';
export declare function sendMessageToQueue(message: any, sqs: SQS, queueUrl: string): Promise<SendMessageResult>;
