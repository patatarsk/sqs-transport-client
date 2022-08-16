import { MessageHandler } from '@nestjs/microservices';
import { ClientConfiguration, GetQueueUrlResult } from 'aws-sdk/clients/sqs';

export declare class TransportStrategy {
  constructor(configuration: ClientConfiguration);
  getQueueUrl(queueName: string): Promise<GetQueueUrlResult>;
  listen(callback: any): any;
  addHandlerOnMessage(pattern: string, handler: MessageHandler): void;
  close(): void;
}