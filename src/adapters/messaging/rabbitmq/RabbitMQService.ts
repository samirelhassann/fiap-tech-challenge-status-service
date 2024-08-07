/* eslint-disable @typescript-eslint/no-empty-function */
// src/adapters/messaging/rabbitmq/RabbitMQService.ts
import amqp, { Channel, Connection, ConsumeMessage } from "amqplib";

import { env } from "@/config/env";
import { IMessageQueueService } from "@/core/interfaces/messaging/IMessageQueueService";

export class RabbitMQService implements IMessageQueueService {
  private static instance: RabbitMQService;

  private connection: Connection | null = null;

  private channel: Channel | null = null;

  private constructor() {}

  public static getInstance(): RabbitMQService {
    if (!RabbitMQService.instance) {
      RabbitMQService.instance = new RabbitMQService();
      RabbitMQService.instance.connect();
    }
    return RabbitMQService.instance;
  }

  public async connect(): Promise<void> {
    if (this.connection && this.channel) {
      return;
    }

    const uri = `amqp://${env.RABBITMQ_USER}:${env.RABBITMQ_PASSWORD}@${env.RABBITMQ_URL}:${env.RABBITMQ_PORT}`;

    this.connection = await amqp.connect(uri);
    this.channel = await this.connection.createChannel();
  }

  public async close(): Promise<void> {
    await this.channel?.close();
    await this.connection?.close();
  }

  public async consume(
    queueName: string,
    onMessage: (msg: ConsumeMessage | null) => void
  ): Promise<void> {
    if (!this.channel) {
      throw new Error("RabbitMQ channel is not available");
    }

    await this.channel.assertQueue(queueName, { durable: true });
    this.channel.consume(queueName, onMessage);
  }

  public async publish(queueName: string, message: string): Promise<void> {
    await this.connect();

    if (!this.channel) {
      throw new Error("RabbitMQ channel is not available");
    }

    await this.channel.assertQueue(queueName, { durable: true });
    this.channel.sendToQueue(queueName, Buffer.from(message));
  }

  public acknowledgeMessage(message: ConsumeMessage): void {
    if (!this.channel) {
      throw new Error("RabbitMQ channel is not available");
    }

    this.channel.ack(message);
  }

  public rejectMessage(message: ConsumeMessage, requeue = false): void {
    if (!this.channel) {
      throw new Error("RabbitMQ channel is not available");
    }

    this.channel.nack(message, false, requeue);
  }
}
