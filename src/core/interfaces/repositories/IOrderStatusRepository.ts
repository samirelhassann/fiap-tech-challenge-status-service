import { OrderStatus } from "@/core/domain/entities/OrderStatus";
import { OrderStatusValue } from "@/core/domain/valueObjects/OrderStatusValue";

export interface IOrderStatusRepository {
  findManyByStatuses(statuses: OrderStatusValue[]): Promise<OrderStatus[]>;

  findManyByUserId(userId: string): Promise<OrderStatus[]>;

  findManyByOrderId(orderId: string): Promise<OrderStatus[]>;

  create(order: OrderStatus): Promise<OrderStatus>;

  update(order: OrderStatus): Promise<OrderStatus>;
}
