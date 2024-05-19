import { UniqueEntityId } from "@/core/domain/base/entities/UniqueEntityId";
import { OrderStatus } from "@/core/domain/entities/OrderStatus";
import { OrderStatusEnum } from "@/core/domain/enums/OrderStatusEnum";
import { OrderStatusValue } from "@/core/domain/valueObjects/OrderStatusValue";
import { OrderStatus as PrismaOrderStatus } from "@prisma/client";

export class PrismaOrderStatusToDomainConverter {
  static convert(prismaOrderStatus: PrismaOrderStatus): OrderStatus {
    return new OrderStatus(
      {
        orderId: new UniqueEntityId(prismaOrderStatus.order_id),
        actual: prismaOrderStatus.actual,
        userId: prismaOrderStatus.user_id
          ? new UniqueEntityId(prismaOrderStatus.user_id)
          : undefined,
        status: new OrderStatusValue({
          name: prismaOrderStatus.status as OrderStatusEnum,
        }),
        createdAt: prismaOrderStatus.created_at,
        updatedAt: prismaOrderStatus.updated_at ?? undefined,
      },
      new UniqueEntityId(prismaOrderStatus.id)
    );
  }
}
