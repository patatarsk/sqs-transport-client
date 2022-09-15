import { SQSMessageReceiver } from './SQSMessageReceiver';
import { ClientProxy, ReadPacket, WritePacket } from '@nestjs/microservices';
import { ClientConfiguration } from 'aws-sdk/clients/sqs';
import { SQS } from 'aws-sdk';
export declare class SQSClient extends ClientProxy {
    options: ClientConfiguration;
    sqs: SQS;
    receiver: SQSMessageReceiver;
    queueName: string;
    queueUrl: string;
    constructor(configuration: ClientConfiguration, queueName: string);
    initReceiver(): Promise<void>;
    getQueueUrlByPattern(cmd: string): Promise<string>;
    listenForResponceOnce(receiverId: string): Promise<any>;
    connect(): Promise<any>;
    close(): Promise<void>;
    dispatchEvent(packet: ReadPacket<any>): Promise<any>;
    awaitForResponce(packet: ReadPacket<any>, callback: (packet: WritePacket<any>) => void): Promise<void>;
    publish(packet: ReadPacket<any>, callback: (packet: WritePacket<any>) => void): () => void;
}
