/* eslint-disable default-param-last */

import { UniqueEntityId } from "@/core/domain/base/entities/UniqueEntityId";
import {
  OrderNotification,
  OrderNotificationProps,
} from "@/core/domain/entities/OrderNotification";
import { NotificationStatusEnum } from "@/core/domain/enums/NotificationStatusEnum";
import { NotificationStatus } from "@/core/domain/valueObjects/NotificationStatus";
import { faker } from "@faker-js/faker";

export function makeOrderNotification(
  override: Partial<OrderNotificationProps> = {},
  id?: UniqueEntityId
): OrderNotification {
  const orderNotification = new OrderNotification(
    {
      userId: new UniqueEntityId(faker.string.uuid()),
      orderId: new UniqueEntityId(faker.string.uuid()),
      status: new NotificationStatus({
        name: NotificationStatusEnum.PENDING,
      }),
      message: faker.string.uuid(),
      createdAt: faker.date.recent(),
      updatedAt: faker.date.recent(),
      ...override,
    },
    id
  );

  return orderNotification;
}
