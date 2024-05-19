import { ValueObject } from "../base/entities/ValueObject";
import { UnsupportedArgumentValueError } from "../base/errors/entities/UnsupportedArgumentValueError";
import { ValueObjectValidationError } from "../base/errors/valueObjects/ValueObjectValidationError";
import { OrderStatusEnum } from "../enums/OrderStatusEnum";

export interface OrderStatusValueProps {
  name: OrderStatusEnum;
}

export class OrderStatusValue extends ValueObject<OrderStatusValueProps> {
  constructor(props: OrderStatusValueProps) {
    super({
      ...props,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!Object.values(OrderStatusEnum).includes(props.name as any)) {
      throw new UnsupportedArgumentValueError(OrderStatusValue.name);
    }
  }

  get name() {
    return this.props.name;
  }

  set name(value: OrderStatusEnum) {
    this.isValidStatusTransition(this.name, value);

    this.props.name = value;
  }

  isValidStatusTransition(
    currentStatus: OrderStatusEnum,
    newStatus: OrderStatusEnum
  ): void {
    const orderStatusOrder: OrderStatusEnum[] = [
      OrderStatusEnum.PENDING_PAYMENT,
      OrderStatusEnum.RECEIVED,
      OrderStatusEnum.IN_PREPARATION,
      OrderStatusEnum.READY,
      OrderStatusEnum.DELIVERED,
      OrderStatusEnum.COMPLETED,
      OrderStatusEnum.CANCELLED,
    ];

    if (currentStatus === newStatus) {
      throw new ValueObjectValidationError(OrderStatusValue.name, [
        "The order status is already the same",
      ]);
    }

    const currentIndex = orderStatusOrder.indexOf(currentStatus);
    const newIndex = orderStatusOrder.indexOf(newStatus);

    if (currentIndex === -1 || newIndex === -1) {
      throw new ValueObjectValidationError(OrderStatusValue.name, [
        "Invalid status transition",
      ]);
    }

    if (newIndex < currentIndex) {
      throw new ValueObjectValidationError(OrderStatusValue.name, [
        "Invalid status transition",
      ]);
    }
  }
}
