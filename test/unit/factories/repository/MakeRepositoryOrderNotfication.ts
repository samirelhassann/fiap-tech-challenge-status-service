/* eslint-disable default-param-last */

import { faker } from "@faker-js/faker";
import { OrderNotification } from "@prisma/client";

export function makeRepositoryOrderNotificationNotification(
  override: Partial<OrderNotification> = {}
): OrderNotification {
  const ordernotification = {
    created_at: faker.date.recent(),
    id: faker.string.uuid(),
    message: faker.string.uuid(),
    order_id: faker.string.uuid(),
    status: "PENDING",
    updated_at: faker.date.recent(),
    user_id: faker.string.uuid(),
    ...override,
  } as OrderNotification;

  return ordernotification;
}
