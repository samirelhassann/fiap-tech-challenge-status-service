export interface OrderQueue {
  id: string;
  number: string;
  status: string;
  userName?: string;
}

export interface GetOrdersQueueViewModel {
  data: OrderQueue[];
  pagination: {
    totalItems: number;
    currentPage: number;
    pageSize: number;
    totalPages: number;
  };
}
