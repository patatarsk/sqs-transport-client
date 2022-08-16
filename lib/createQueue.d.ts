import SQS, { CreateQueueRequest } from 'aws-sdk/clients/sqs';

export declare const createQueue: (
  createQueueRequest: CreateQueueRequest,
  sqs: SQS,
) => Promise<SQS.CreateQueueResult>;
