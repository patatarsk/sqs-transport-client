import { EventEmitter } from 'events';
import { SQS } from 'aws-sdk';
import {
  DeleteMessageRequest,
  Message,
  ReceiveMessageRequest,
} from 'aws-sdk/clients/sqs';

export class SQSMessageReceiver extends EventEmitter {
  sqs: SQS;
  params: ReceiveMessageRequest;
  queueUrl: string;

  constructor(queueUrl: string, sqs: SQS) {
    super();
    this.sqs = sqs;
    this.queueUrl = queueUrl;
    this.params = {
      WaitTimeSeconds: 0,
      QueueUrl: this.queueUrl,
      MaxNumberOfMessages: 10,
    };

    this.listenMessages();
  }

  async listenMessages() {
    try {
      const messages = await this.sqs.receiveMessage(this.params).promise();
      const messagesArray = this.sqsMessagesToArray(messages);

      if (messagesArray) {
        this.emit('message', messagesArray);
      }

      this.listenMessages();
    } catch (error) {
      console.log(error);
    }
  }

  sqsMessagesToArray(messages) {
    if (messages && messages.Messages) {
      const { Messages: messagesArray } = messages;
      const messagesData = messagesArray.map(
        ({ MessageId, Body, ReceiptHandle }: Message) => ({
          MessageId,
          Body: JSON.parse(Body),
          ReceiptHandle,
        }),
      );

      return messagesData;
    }

    return null;
  }

  async deleteProcessedMessageFromQueue(messageData) {
    try {
      const { ReceiptHandle } = messageData;
      const params: DeleteMessageRequest = {
        QueueUrl: this.queueUrl,
        ReceiptHandle,
      };

      await this.sqs.deleteMessage(params).promise();
    } catch (error) {
      console.log(error);
    }
  }
}
