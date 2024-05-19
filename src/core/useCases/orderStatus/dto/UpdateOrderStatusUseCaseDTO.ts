import { OrderStatus } from "@/core/domain/entities/OrderStatus";
import { OrderStatusEnum } from "@/core/domain/enums/OrderStatusEnum";

export interface UpdateOrderStatusUseCaseRequestDTO {
  id: string;
  status: OrderStatusEnum;
}

export interface UpdateOrderStatusUseCaseResponseDTO {
  orderStatus: OrderStatus;
}
