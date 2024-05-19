import { GetOrderByIdResponse } from "@/adapters/services/orderService/model/GetOrderByIdResponse";

export interface IOrderService {
  getOrderById(id: string): Promise<GetOrderByIdResponse>;
}
