import { FastifyReply, FastifyRequest } from "fastify";

import { getOrdersQueueFormatedQueryParamsSchema } from "@/adapters/controllers/orderStatus/schema/GetOrdersQueueFormatedSchema";
import { GetOrdersQueueFormatedViewModel } from "@/adapters/controllers/orderStatus/viewModel/GetOrdersQueueFormatedViewModel";
import { PaginationParams } from "@/core/domain/base/PaginationParams";
import {
  GetOrdersQueueFormatedUseCaseRequestDTO,
  GetOrdersQueueFormatedUseCaseResponseDTO,
} from "@/core/useCases/orderStatus/dto/GetOrdersQueueFormatedUseCaseDTO";

import { ErrorHandlingPresenter } from "../base/ErrorHandlingPresenter";
import { IControllerPresenter } from "../base/IControllerPresenter";

export class GetOrdersQueueFormatedPresenter
  extends ErrorHandlingPresenter
  implements
    IControllerPresenter<
      GetOrdersQueueFormatedUseCaseRequestDTO,
      GetOrdersQueueFormatedUseCaseResponseDTO,
      GetOrdersQueueFormatedViewModel
    >
{
  convertToUseCaseDTO(
    req: FastifyRequest
  ): GetOrdersQueueFormatedUseCaseRequestDTO {
    const { page, pageSize } = getOrdersQueueFormatedQueryParamsSchema.parse(
      req.query
    );

    const params = new PaginationParams(page, pageSize);

    return {
      params,
    };
  }

  convertToViewModel(
    model: GetOrdersQueueFormatedUseCaseResponseDTO
  ): GetOrdersQueueFormatedViewModel {
    return model.paginationResponse.toResponse((order) => ({
      number: order.number.toString(),
      status: order.status,
      userName: order.userName,
    }));
  }

  async sendResponse(
    res: FastifyReply,
    response: GetOrdersQueueFormatedUseCaseResponseDTO
  ) {
    return res.status(200).send(this.convertToViewModel(response));
  }
}
