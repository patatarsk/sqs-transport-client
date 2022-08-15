import { SendMessageRequest } from 'aws-sdk/clients/sqs';
import { SQS } from 'aws-sdk';

export async function sendMessageToQueue(
  message: any,
  sqs: SQS,
  queueUrl: string,
): Promise<any> {
  const params: SendMessageRequest = {
    MessageBody: JSON.stringify(message),
    QueueUrl: queueUrl,
  };

  return sqs.sendMessage(params).promise();
}
