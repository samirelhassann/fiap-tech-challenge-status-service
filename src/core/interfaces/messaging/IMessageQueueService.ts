import { ConsumeMessage, Message } from "amqplib";

export interface IMessageQueueService {
  connect(): Promise<void>;
  close(): Promise<void>;

  consume(
    queue: string,
    onMessage: (message: ConsumeMessage | null) => void
  ): Promise<void>;
  publish(queue: string, message: string): Promise<void>;

  acknowledgeMessage(message: Message): void;
  rejectMessage(message: Message, requeue: boolean): void;
}
