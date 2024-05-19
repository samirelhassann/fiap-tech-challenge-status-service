/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */

import { IOrderStatusRepository } from "@/core/interfaces/repositories/IOrderStatusRepository";
import { IOrderService } from "@/core/interfaces/services/IOrderService";

import {
  GetOrdersQueueFormatedUseCaseRequestDTO,
  GetOrdersQueueFormatedUseCaseResponseDTO,
} from "./dto/GetOrdersQueueFormatedUseCaseDTO";
import {
  UpdateOrderStatusUseCaseRequestDTO,
  UpdateOrderStatusUseCaseResponseDTO,
} from "./dto/UpdateOrderStatusUseCaseDTO";
import { GetOrderQueueUseCase } from "./implementations/GetOrderQueueUseCase";
import { UpdateOrderStatusUseCase } from "./implementations/UpdateOrderStatusUseCase";
import { IOrderStatusUseCase } from "./IOrderStatusUseCase";

export class OrderStatusUseCase implements IOrderStatusUseCase {
  private updateOrderStatusUseCase: UpdateOrderStatusUseCase;

  private getOrderQueueUseCase: GetOrderQueueUseCase;

  constructor(
    private orderStatusRepository: IOrderStatusRepository,
    private orderService: IOrderService
  ) {
    this.updateOrderStatusUseCase = new UpdateOrderStatusUseCase(
      orderStatusRepository,
      orderService
    );

    this.getOrderQueueUseCase = new GetOrderQueueUseCase(
      orderStatusRepository,
      orderService
    );
  }

  async getOrdersQueueFormated(
    props: GetOrdersQueueFormatedUseCaseRequestDTO
  ): Promise<GetOrdersQueueFormatedUseCaseResponseDTO> {
    return this.getOrderQueueUseCase.execute(props);
  }

  async updateOrderStatus(
    props: UpdateOrderStatusUseCaseRequestDTO
  ): Promise<UpdateOrderStatusUseCaseResponseDTO> {
    return this.updateOrderStatusUseCase.execute(props);
  }
}
