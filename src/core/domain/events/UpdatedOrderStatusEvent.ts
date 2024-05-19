/* eslint-disable import/no-cycle */
import { UniqueEntityId } from "../base/entities/UniqueEntityId";
import { DomainEvent } from "../base/events/DomainEvent";
import { OrderStatus } from "../entities/OrderStatus";

export class UpdatedOrderStatusEvent implements DomainEvent {
  public ocurredAt: Date;

  public orderStatus: OrderStatus;

  constructor(orderStatus: OrderStatus) {
    this.orderStatus = orderStatus;
    this.ocurredAt = new Date();
  }

  getAggregateId(): UniqueEntityId {
    return this.orderStatus.id;
  }
}
