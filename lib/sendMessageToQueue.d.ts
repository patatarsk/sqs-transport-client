import { SendMessageRequest } from 'aws-sdk/clients/sqs';
import { SQS } from 'aws-sdk';

export declare const sendMessageToQueue : (
  sendMessageRequest: SendMessageRequest,
  sqs: SQS,
  queueUrl: string,
) => Promise<SQS.SendMessageResult>;