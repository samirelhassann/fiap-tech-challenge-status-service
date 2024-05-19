import { PaginationResponse } from "@/core/domain/base/PaginationResponse";
import { OrderStatusEnum } from "@/core/domain/enums/OrderStatusEnum";
import { OrderStatusValue } from "@/core/domain/valueObjects/OrderStatusValue";
import { IOrderStatusRepository } from "@/core/interfaces/repositories/IOrderStatusRepository";
import { IOrderService } from "@/core/interfaces/services/IOrderService";

import {
  GetOrdersQueueFormatedUseCaseRequestDTO,
  GetOrdersQueueFormatedUseCaseResponseDTO,
  OrderQueue,
} from "../dto/GetOrdersQueueFormatedUseCaseDTO";

export class GetOrderQueueUseCase {
  constructor(
    private orderStatusRepository: IOrderStatusRepository,
    private orderService: IOrderService
  ) {}

  async execute({
    params,
  }: GetOrdersQueueFormatedUseCaseRequestDTO): Promise<GetOrdersQueueFormatedUseCaseResponseDTO> {
    const statusesToSearch = [
      new OrderStatusValue({ name: OrderStatusEnum.READY }),
      new OrderStatusValue({ name: OrderStatusEnum.IN_PREPARATION }),
      new OrderStatusValue({ name: OrderStatusEnum.RECEIVED }),
    ];

    const orderStatuses =
      await this.orderStatusRepository.findManyByStatuses(statusesToSearch);

    const orderOfStatuses = statusesToSearch.map((status) => status.name);

    const orderedOrders = orderStatuses
      .sort((a, b) => {
        const indexA = orderOfStatuses.indexOf(a.status.name);
        const indexB = orderOfStatuses.indexOf(b.status.name);

        if (indexA - indexB !== 0) {
          return indexA - indexB;
        }

        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();

        return dateA - dateB;
      })
      .slice((params.page - 1) * params.size, params.page * params.size);

    const orderDetails: OrderQueue[] = await Promise.all(
      orderedOrders.map(async (order) => {
        const details = await this.orderService.getOrderById(
          order.orderId.toString()
        );

        return {
          number: details.number,
          status: order.status.name,
          userName: details.user.name,
        };
      })
    );

    const paginationResponse = new PaginationResponse<OrderQueue>({
      data: orderDetails,
      totalItems: orderStatuses.length,
      currentPage: params.page,
      pageSize: params.size,
      totalPages: Math.ceil(orderStatuses.length / params.size),
    });

    return {
      paginationResponse,
    };
  }
}
