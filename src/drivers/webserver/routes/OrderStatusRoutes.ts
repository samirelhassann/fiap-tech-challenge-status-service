import { FastifyInstance } from "fastify";

import { OrderStatusController } from "@/adapters/controllers/orderStatus/OrderStatusController";
import { getOrdersQueueFormatedDocSchema } from "@/adapters/controllers/orderStatus/schema/GetOrdersQueueFormatedSchema";
import { updateOrderStatusDocSchema } from "@/adapters/controllers/orderStatus/schema/UpdateOrderStatusSchema";
import { GetOrdersQueueFormatedPresenter } from "@/adapters/presenters/order/GetOrdersQueueFormatedPresenter";
import { UpdateOrderStatusPresenter } from "@/adapters/presenters/order/UpdateOrderStatusPresenter";
import { makeOrderStatusRepository } from "@/adapters/repositories/PrismaRepositoryFactory";
import { OrderService } from "@/adapters/services/orderService";
import { OrderStatusUseCase } from "@/core/useCases/orderStatus/OderStatusUseCase";

export async function OrderStatusRoutes(app: FastifyInstance) {
  const orderStatusController = new OrderStatusController(
    new OrderStatusUseCase(makeOrderStatusRepository(), new OrderService()),

    new GetOrdersQueueFormatedPresenter(),
    new UpdateOrderStatusPresenter()
  );

  app.get("/queue", {
    schema: getOrdersQueueFormatedDocSchema,
    handler: orderStatusController.getOrdersQueueFormated.bind(
      orderStatusController
    ),
  });

  app.patch("/:id", {
    schema: updateOrderStatusDocSchema,
    handler: orderStatusController.updateOrderStatus.bind(
      orderStatusController
    ),
  });
}
