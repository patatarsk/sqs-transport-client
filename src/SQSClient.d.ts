import { ReadPacket, WritePacket } from "@nestjs/microservices";
import { ClientConfiguration } from 'aws-sdk/clients/sqs';

export declare class SQSClient {
  constructor(configuration: ClientConfiguration, queueName: string);
  initReceiver(): Promise<void>;
  getQueueUrlByPattern(pattern: string): Promise<string>;
  listenForResponceOnce(receiverId: string): Promise<any>;
  connect(): Promise<void>;
  close(): Promise<void>;
  dispatchEvent(packet: ReadPacket<any>): Promise<any>;
  awaitForResponce(packet: ReadPacket<any>, callback: (packet: WritePacket<any>) => void): Promise<void>;
  publish(packet: ReadPacket<any>, callback: (packet: WritePacket<any>) => void): () => void;
}