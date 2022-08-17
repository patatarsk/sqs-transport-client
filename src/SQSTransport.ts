import { SQSMessageReceiver } from './SQSMessageReceiver';
import {
  CustomTransportStrategy,
  MessageHandler,
  Server,
} from '@nestjs/microservices';
import { EventEmitter } from 'events';
import { SQS } from 'aws-sdk';
import { ClientConfiguration, GetQueueUrlResult } from 'aws-sdk/clients/sqs';
import { sendMessageToQueue } from './sendMessageToQueue';
import { createQueue } from './createQueue';

export class TransportStrategy
  extends Server
  implements CustomTransportStrategy
{
  options: ClientConfiguration;
  emitter: EventEmitter;
  sqs: SQS;
  queueName: string;

  constructor(configuration: ClientConfiguration) {
    super();
    this.options = configuration;
    this.emitter = new EventEmitter();
    this.sqs = new SQS(this.options);
  }

  async listen(callback: () => void) {
    for (const messageHandler of this.messageHandlers) {
      const [pattern, handler] = messageHandler;

      this.addHandlerOnMessage(pattern, handler);
      const queueUrl = await createQueue(JSON.parse(pattern)['cmd'], this.sqs);
      const receiver = new SQSMessageReceiver(queueUrl, this.sqs);

      receiver.on('message', async (messagesArray) => {
        for (const message of messagesArray) {
          const { pattern, ...data } = message.Body;

          if (pattern) {
            this.emitter.emit(JSON.stringify(pattern), data, message.MessageId);

            await receiver.deleteProcessedMessageFromQueue(message);
          }
        }
      });
    }

    callback();
  }

  addHandlerOnMessage(pattern: string, handler: MessageHandler) {
    this.emitter.on(pattern, async (data: any, messageId: string) => {
      if (handler.isEventHandler === true) {
        handler(data);
      } else {
        const { receiverUrl, ...handlerData } = data;
        const response = await handler(handlerData);

        sendMessageToQueue(
          { response, receiverId: messageId },
          this.sqs,
          receiverUrl,
        );
      }
    });
  }

  close() {
    return;
  }
}
