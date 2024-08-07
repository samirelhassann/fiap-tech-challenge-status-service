// src/adapters/consumers/OrderConsumer.ts

import { OrderStatusConsumerHandler } from "@/adapters/messaging/OrderStatusConsumerHandler";
import { RabbitMQService } from "@/adapters/messaging/rabbitmq/RabbitMQService";
import { makeOrderStatusRepository } from "@/adapters/repositories/PrismaRepositoryFactory";
import { OrderService } from "@/adapters/services/orderService";
import { env } from "@/config/env";
import { OrderStatusUseCase } from "@/core/useCases/orderStatus/OderStatusUseCase";

export async function OrderStatusMessaging() {
  const rabbitMQService = RabbitMQService.getInstance();
  const paymentUseCase = new OrderStatusUseCase(
    makeOrderStatusRepository(),
    new OrderService()
  );

  const orderStatusConsumerHandler = new OrderStatusConsumerHandler(
    rabbitMQService,
    paymentUseCase
  );

  await rabbitMQService.connect();

  rabbitMQService.consume(
    env.RABBITMQ_PENDING_PAYMENT_QUEUE,
    orderStatusConsumerHandler.handlePendingPaymentOrderMessage.bind(
      orderStatusConsumerHandler
    )
  );
}
