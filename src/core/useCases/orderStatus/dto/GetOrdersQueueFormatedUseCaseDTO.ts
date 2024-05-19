import { PaginationParams } from "@/core/domain/base/PaginationParams";
import { PaginationResponse } from "@/core/domain/base/PaginationResponse";

export interface GetOrdersQueueFormatedUseCaseRequestDTO {
  params: PaginationParams;
}

export interface OrderQueue {
  number: string;
  status: string;
  userName: string;
}

export interface GetOrdersQueueFormatedUseCaseResponseDTO {
  paginationResponse: PaginationResponse<OrderQueue>;
}
