import { CustomTransportStrategy, MessageHandler, Server } from '@nestjs/microservices';
import { EventEmitter } from 'events';
import { SQS } from 'aws-sdk';
import { ClientConfiguration } from 'aws-sdk/clients/sqs';
export declare class TransportStrategy extends Server implements CustomTransportStrategy {
    options: ClientConfiguration;
    emitter: EventEmitter;
    sqs: SQS;
    queueName: string;
    constructor(configuration: ClientConfiguration);
    getQueueUrl(queueName: string): Promise<import("aws-sdk/lib/request").PromiseResult<SQS.GetQueueUrlResult, import("aws-sdk").AWSError>>;
    listen(callback: () => void): Promise<void>;
    addHandlerOnMessage(pattern: string, handler: MessageHandler): void;
    close(): void;
}
