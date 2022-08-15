import { SQS } from 'aws-sdk';
import { CreateQueueRequest } from 'aws-sdk/clients/sqs';

export async function createQueue(queueName: string, sqs: SQS) {
  const params: CreateQueueRequest = {
    QueueName: queueName,
  };
  const { QueueUrl } = await sqs.createQueue(params).promise();

  return QueueUrl;
}
