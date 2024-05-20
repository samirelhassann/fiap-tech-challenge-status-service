/* eslint-disable default-param-last */

import { UniqueEntityId } from "@/core/domain/base/entities/UniqueEntityId";
import {
  OrderStatus,
  OrderStatusProps,
} from "@/core/domain/entities/OrderStatus";
import { OrderStatusEnum } from "@/core/domain/enums/OrderStatusEnum";
import { OrderStatusValue } from "@/core/domain/valueObjects/OrderStatusValue";
import { faker } from "@faker-js/faker";

export function makeOrderStatus(
  override: Partial<OrderStatusProps> = {},
  id?: UniqueEntityId
): OrderStatus {
  const orderStatus = new OrderStatus(
    {
      userId: new UniqueEntityId(faker.string.uuid()),
      orderId: new UniqueEntityId(faker.string.uuid()),
      status: new OrderStatusValue({
        name: OrderStatusEnum.PENDING_PAYMENT,
      }),
      actual: faker.datatype.boolean(),
      createdAt: faker.date.recent(),
      updatedAt: faker.date.recent(),
      ...override,
    },
    id
  );

  return orderStatus;
}
