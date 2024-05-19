import { FastifyInstance } from "fastify";

import identifyRequest from "@/adapters/middlewares/identifyRequest";

import { HealhCheckRoutes } from "../routes/HealhCheckRoutes";
import { OrderNotificationRoutes } from "../routes/OrderNotificationRoutes";
import { OrderStatusRoutes } from "../routes/OrderStatusRoutes";

const SERVICE_PREFIX = "/status-service";

export function routes(app: FastifyInstance) {
  app.addHook("preHandler", identifyRequest);

  app.register(HealhCheckRoutes);

  app.register(OrderStatusRoutes, { prefix: `${SERVICE_PREFIX}` });
  app.register(OrderNotificationRoutes, {
    prefix: `${SERVICE_PREFIX}/order-notifications`,
  });
}
