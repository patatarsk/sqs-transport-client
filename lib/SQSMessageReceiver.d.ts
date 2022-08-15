import { SQS } from 'aws-sdk';

export declare class SQSMessageReceiver {
  constructor(queueUrl: string, sqs: SQS);

  listenMessages(): Promise<void>;
  sqsMessagesToArray(messages: SQS.Message[]): [];
  deleteProcessedMessageFromQueue(message: SQS.Message): Promise<void>;
}