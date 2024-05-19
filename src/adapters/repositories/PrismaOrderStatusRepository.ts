import { OrderStatus } from "@/core/domain/entities/OrderStatus";
import { OrderStatusValue } from "@/core/domain/valueObjects/OrderStatusValue";
import { IOrderStatusRepository } from "@/core/interfaces/repositories/IOrderStatusRepository";
import { prisma } from "@/drivers/db/prisma/config/prisma";

import { PrismaOrderStatusToDomainConverter } from "./converters/PrismaOrderStatusToDomainConverter";

export class PrismaOrderStatusRepository implements IOrderStatusRepository {
  async findManyByStatuses(
    statuses: OrderStatusValue[]
  ): Promise<OrderStatus[]> {
    const data = await prisma.orderStatus.findMany({
      where: {
        status: {
          in: statuses.map((status) => status.name),
        },
        actual: true,
      },
    });

    return data.map((c) => PrismaOrderStatusToDomainConverter.convert(c));
  }

  async findManyByUserId(userId: string): Promise<OrderStatus[]> {
    const data = await prisma.orderStatus.findMany({
      where: {
        user_id: userId,
      },
    });

    return data.map((c) => PrismaOrderStatusToDomainConverter.convert(c));
  }

  async findManyByOrderId(orderId: string): Promise<OrderStatus[]> {
    const data = await prisma.orderStatus.findMany({
      where: {
        order_id: orderId,
      },
    });

    return data.map((c) => PrismaOrderStatusToDomainConverter.convert(c));
  }

  async create(order: OrderStatus): Promise<OrderStatus> {
    const createdOrderStatus = await prisma.orderStatus.create({
      data: {
        user_id: order.userId?.toString(),
        order_id: order.orderId.toString(),
        status: order.status.name,
        actual: order.actual,
      },
    });

    return PrismaOrderStatusToDomainConverter.convert(createdOrderStatus);
  }

  async update(order: OrderStatus): Promise<OrderStatus> {
    const updatedOrderStatus = await prisma.orderStatus.update({
      where: {
        id: order.id.toString(),
      },
      data: {
        actual: order.actual,
      },
    });

    return PrismaOrderStatusToDomainConverter.convert(updatedOrderStatus);
  }
}
