import { FastifyReply, FastifyRequest } from "fastify";

import { GetOrdersQueueFormatedPresenter } from "@/adapters/presenters/order/GetOrdersQueueFormatedPresenter";
import { UpdateOrderStatusPresenter } from "@/adapters/presenters/order/UpdateOrderStatusPresenter";
import { IOrderStatusUseCase } from "@/core/useCases/orderStatus/IOrderStatusUseCase";

import { GetOrdersQueueViewModel } from "./viewModel/GetOrdersQueueViewModel";
import { UpdateOrderStatusViewModel } from "./viewModel/UpdateOrderStatusViewModel";

export class OrderStatusController {
  constructor(
    private orderStatusUseCase: IOrderStatusUseCase,
    private getOrdersQueueFormatedPresenter: GetOrdersQueueFormatedPresenter,
    private updateOrderStatusPresenter: UpdateOrderStatusPresenter // private orderWebHookPresenter: OrderWebHookPresenter
  ) {}

  async getOrdersQueueFormated(
    req: FastifyRequest,
    res: FastifyReply
  ): Promise<GetOrdersQueueViewModel> {
    return this.orderStatusUseCase
      .getOrdersQueueFormated(
        this.getOrdersQueueFormatedPresenter.convertToUseCaseDTO(req)
      )
      .then((response) =>
        this.getOrdersQueueFormatedPresenter.sendResponse(res, response)
      )
      .catch((error) =>
        this.getOrdersQueueFormatedPresenter.convertErrorResponse(error, res)
      );
  }

  async updateOrderStatus(
    req: FastifyRequest,
    res: FastifyReply
  ): Promise<UpdateOrderStatusViewModel> {
    return this.orderStatusUseCase
      .updateOrderStatus(
        this.updateOrderStatusPresenter.convertToUseCaseDTO(req)
      )
      .then((response) =>
        this.updateOrderStatusPresenter.sendResponse(res, response)
      )
      .catch((error) =>
        this.updateOrderStatusPresenter.convertErrorResponse(error, res)
      );
  }

  // async webhook(req: FastifyRequest, res: FastifyReply): Promise<void> {
  //   return this.orderUseCase
  //     .orderWebhook(this.orderWebHookPresenter.convertToUseCaseDTO(req))
  //     .then(() => this.orderWebHookPresenter.sendResponse(res))
  //     .catch((error) =>
  //       this.orderWebHookPresenter.convertErrorResponse(error, res)
  //     );
  // }
}
