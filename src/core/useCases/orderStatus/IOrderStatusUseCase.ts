import {
  GetOrdersQueueFormatedUseCaseRequestDTO,
  GetOrdersQueueFormatedUseCaseResponseDTO,
} from "./dto/GetOrdersQueueFormatedUseCaseDTO";
import {
  UpdateOrderStatusUseCaseRequestDTO,
  UpdateOrderStatusUseCaseResponseDTO,
} from "./dto/UpdateOrderStatusUseCaseDTO";

export interface IOrderStatusUseCase {
  getOrdersQueueFormated(
    props: GetOrdersQueueFormatedUseCaseRequestDTO
  ): Promise<GetOrdersQueueFormatedUseCaseResponseDTO>;

  updateOrderStatus(
    props: UpdateOrderStatusUseCaseRequestDTO
  ): Promise<UpdateOrderStatusUseCaseResponseDTO>;

  // orderWebhook(props: OrderWebHookUseCaseRequestDTO): Promise<void>;
}
