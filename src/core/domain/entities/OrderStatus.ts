/* eslint-disable import/no-cycle */

import { AggregateRoot } from "../base/entities/AggregateRoot";
import { UniqueEntityId } from "../base/entities/UniqueEntityId";
import { Optional } from "../base/types/Optional";
import { UpdatedOrderStatusEvent } from "../events/UpdatedOrderStatusEvent";
import { OrderStatusValue } from "../valueObjects/OrderStatusValue";

export interface OrderStatusProps {
  orderId: UniqueEntityId;
  userId?: UniqueEntityId;
  status: OrderStatusValue;
  actual: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

export class OrderStatus extends AggregateRoot<OrderStatusProps> {
  constructor(
    props: Optional<OrderStatusProps, "createdAt" | "actual">,
    id?: UniqueEntityId
  ) {
    super(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        actual: props.actual ?? true,
      },
      id
    );

    const isNewAnswer = !id;

    if (isNewAnswer) {
      this.addDomainEvent(new UpdatedOrderStatusEvent(this));
    }
  }

  get actual() {
    return this.props.actual;
  }

  set actual(value: boolean) {
    this.props.actual = value;

    this.touch();
  }

  get status() {
    return this.props.status;
  }

  set status(value: OrderStatusValue) {
    this.props.status.name = value.name;

    this.addDomainEvent(new UpdatedOrderStatusEvent(this));

    this.touch();
  }

  get userId() {
    return this.props.userId;
  }

  get orderId() {
    return this.props.orderId;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  private touch() {
    this.props.updatedAt = new Date();
  }
}
