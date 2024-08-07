import { FastifyInstance } from "fastify";

import { OrderStatusMessaging } from "../messaging/OrderStatusMessaging";

export function messaging(app: FastifyInstance) {
  app.register(OrderStatusMessaging);
}
