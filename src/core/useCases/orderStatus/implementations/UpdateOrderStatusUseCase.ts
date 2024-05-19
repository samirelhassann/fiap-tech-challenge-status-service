import { UniqueEntityId } from "@/core/domain/base/entities/UniqueEntityId";
import { ResourceNotFoundError } from "@/core/domain/base/errors/useCases/ResourceNotFoundError";
import { OrderStatus } from "@/core/domain/entities/OrderStatus";
import { OrderStatusValue } from "@/core/domain/valueObjects/OrderStatusValue";
import { IOrderStatusRepository } from "@/core/interfaces/repositories/IOrderStatusRepository";
import { IOrderService } from "@/core/interfaces/services/IOrderService";

import {
  UpdateOrderStatusUseCaseRequestDTO,
  UpdateOrderStatusUseCaseResponseDTO,
} from "../dto/UpdateOrderStatusUseCaseDTO";

export class UpdateOrderStatusUseCase {
  constructor(
    private orderStatusRepository: IOrderStatusRepository,
    private orderService: IOrderService
  ) {}

  async execute(
    props: UpdateOrderStatusUseCaseRequestDTO
  ): Promise<UpdateOrderStatusUseCaseResponseDTO> {
    const { id, status } = props;

    const order = await this.orderService.getOrderById(id);

    if (!order) {
      throw new ResourceNotFoundError("Order");
    }

    const statuses = await this.orderStatusRepository.findManyByOrderId(id);

    if (statuses.length === 0) {
      const orderStatus = new OrderStatus({
        orderId: new UniqueEntityId(order.id),
        userId: order.user ? new UniqueEntityId(order.user.id) : undefined,
        status: new OrderStatusValue({
          name: status,
        }),
      });

      const createdOrderStatus =
        await this.orderStatusRepository.create(orderStatus);

      return {
        orderStatus: createdOrderStatus,
      };
    }

    const actualStatus = statuses.find((s) => s.actual);

    if (!actualStatus) {
      throw new ResourceNotFoundError("Actual Order Status");
    }

    actualStatus.actual = false;

    const newStatus = new OrderStatus({
      orderId: actualStatus.orderId,
      userId: actualStatus.userId,
      status: actualStatus.status,
    });
    newStatus.status = new OrderStatusValue({
      name: status,
    });

    await this.orderStatusRepository.update(actualStatus);

    const updatedOrderStatus =
      await this.orderStatusRepository.create(newStatus);

    return {
      orderStatus: updatedOrderStatus,
    };
  }
}
