import { SQSMessageReceiver } from './SQSMessageReceiver';
import { ClientProxy, ReadPacket, WritePacket } from '@nestjs/microservices';
import { ClientConfiguration, Message } from 'aws-sdk/clients/sqs';
import { SQS } from 'aws-sdk';
import { sendMessageToQueue } from './sendMessageToQueue';
import { createQueue } from './createQueue';

export class SQSClient extends ClientProxy {
  options: ClientConfiguration;
  sqs: SQS;
  receiver: SQSMessageReceiver;
  queueName: string;
  queueUrl: string;

  constructor(configuration: ClientConfiguration, queueName: string) {
    super();
    this.options = configuration;
    this.sqs = new SQS(this.options);
    this.queueName = queueName;
  }

  async initReceiver() {
    this.queueUrl = await createQueue(this.queueName, this.sqs);

    this.receiver = new SQSMessageReceiver(this.queueUrl, this.sqs);
    this.receiver.on('message', async (messagesArray: Partial<Message[]>) => {
      for (const message of messagesArray) {
        const { receiverId, response } = message.Body as any;

        await this.receiver.deleteProcessedMessageFromQueue(message);
        this.receiver.emit(receiverId, response);
      }
    });
  }

  async getQueueUrlByPattern(cmd: string) {
    const { QueueUrls } = await this.sqs.listQueues().promise();
    const url = QueueUrls.find((url) => url.split('/').reverse()[0] === cmd);

    if (!url) {
      throw new Error(`Queue ${cmd} not found`);
    }

    return url;
  }

  async listenForResponceOnce(receiverId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.receiver.on(receiverId, async (response) => {
        this.receiver.removeAllListeners(receiverId);
        resolve(response);
      });
    });
  }

  async connect(): Promise<any> {
    console.log('conected');
  }

  async close() {
    console.log('closed');
  }

  async dispatchEvent(packet: ReadPacket<any>): Promise<any> {
    const { pattern, data } = packet;
    const queueUrl = await this.getQueueUrlByPattern(pattern.cmd);

    sendMessageToQueue({ pattern, ...data }, this.sqs, queueUrl);
  }

  async awaitForResponce(
    packet: ReadPacket<any>,
    callback: (packet: WritePacket<any>) => void,
  ) {
    const { pattern, data } = packet;
    const queueUrl = await this.getQueueUrlByPattern(pattern.cmd);
    const { MessageId } = await sendMessageToQueue(
      { pattern, ...data, receiverUrl: this.queueUrl },
      this.sqs,
      queueUrl,
    );
    const response = await this.listenForResponceOnce(MessageId);

    callback({
      response,
      isDisposed: true,
    });
  }

  publish(
    packet: ReadPacket<any>,
    callback: (packet: WritePacket<any>) => void,
  ): () => void {
    this.awaitForResponce(packet, callback);

    return () => console.log('teardown');
  }
}
