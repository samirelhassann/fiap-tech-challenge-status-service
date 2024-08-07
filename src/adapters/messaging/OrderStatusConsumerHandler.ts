/* eslint-disable no-console */
import { ConsumeMessage } from "amqplib";

import { OrderStatusEnum } from "@/core/domain/enums/OrderStatusEnum";
import { IMessageQueueService } from "@/core/interfaces/messaging/IMessageQueueService";
import { IOrderStatusUseCase } from "@/core/useCases/orderStatus/IOrderStatusUseCase";

import { pendingPaymentOrderMessageSchema } from "./schema/PendingPaymentOrderMessageSchema";

export class OrderStatusConsumerHandler {
  constructor(
    private messageQueueService: IMessageQueueService,
    private orderStatusUseCase: IOrderStatusUseCase
  ) {}

  async handlePendingPaymentOrderMessage(message: ConsumeMessage | null) {
    if (!message) {
      return;
    }

    try {
      const { orderId } = pendingPaymentOrderMessageSchema.parse(
        JSON.parse(message.content.toString())
      );

      await this.orderStatusUseCase.updateOrderStatus({
        id: orderId,
        status: OrderStatusEnum.PENDING_PAYMENT,
      });
    } finally {
      this.messageQueueService.acknowledgeMessage(message);
    }
  }

  async handlePaidPaymentOrderMessage(message: ConsumeMessage | null) {
    if (!message) {
      return;
    }

    try {
      const { orderId } = pendingPaymentOrderMessageSchema.parse(
        JSON.parse(message.content.toString())
      );

      await this.orderStatusUseCase.updateOrderStatus({
        id: orderId,
        status: OrderStatusEnum.IN_PREPARATION,
      });
    } finally {
      this.messageQueueService.acknowledgeMessage(message);
    }
  }
}
