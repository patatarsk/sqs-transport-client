import { SQS } from 'aws-sdk';
declare function createQueue(queueName: string, sqs: SQS): Promise<string>;
export { createQueue };
