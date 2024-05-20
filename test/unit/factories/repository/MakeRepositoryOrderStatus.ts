/* eslint-disable default-param-last */

import { faker } from "@faker-js/faker";
import { OrderStatus } from "@prisma/client";

export function makeRepositoryOrderStatus(
  override: Partial<OrderStatus> = {}
): OrderStatus {
  const orderstatus = {
    actual: faker.datatype.boolean(),
    created_at: faker.date.recent(),
    id: faker.string.uuid(),
    order_id: faker.string.uuid(),
    status: "PENDING",
    updated_at: faker.date.recent(),
    user_id: faker.string.uuid(),
    ...override,
  } as OrderStatus;

  return orderstatus;
}
