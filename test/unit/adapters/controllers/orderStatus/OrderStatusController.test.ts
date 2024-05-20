import { FastifyReply, FastifyRequest } from "fastify";
import { describe, expect, it, beforeEach, vi } from "vitest";

import { OrderStatusController } from "@/adapters/controllers/orderStatus/OrderStatusController";
import { GetOrdersQueueFormatedPresenter } from "@/adapters/presenters/order/GetOrdersQueueFormatedPresenter";
import { UpdateOrderStatusPresenter } from "@/adapters/presenters/order/UpdateOrderStatusPresenter";
import { UniqueEntityId } from "@/core/domain/base/entities/UniqueEntityId";
import { PaginationParams } from "@/core/domain/base/PaginationParams";
import { PaginationResponse } from "@/core/domain/base/PaginationResponse";
import { OrderStatusEnum } from "@/core/domain/enums/OrderStatusEnum";
import {
  GetOrdersQueueFormatedUseCaseRequestDTO,
  GetOrdersQueueFormatedUseCaseResponseDTO,
  OrderQueue,
} from "@/core/useCases/orderStatus/dto/GetOrdersQueueFormatedUseCaseDTO";
import {
  UpdateOrderStatusUseCaseRequestDTO,
  UpdateOrderStatusUseCaseResponseDTO,
} from "@/core/useCases/orderStatus/dto/UpdateOrderStatusUseCaseDTO";
import { IOrderStatusUseCase } from "@/core/useCases/orderStatus/IOrderStatusUseCase";
import { faker } from "@faker-js/faker";
import { makeOrderStatus } from "@test/unit/factories/MakeOrderStatus";

let req: FastifyRequest;
let res: FastifyReply;
let orderStatusController: OrderStatusController;
let orderStatusUseCase: IOrderStatusUseCase;
let getOrdersQueueFormatedPresenter: GetOrdersQueueFormatedPresenter;
let updateOrderStatusPresenter: UpdateOrderStatusPresenter;

beforeEach(() => {
  orderStatusUseCase = {
    getOrdersQueueFormated: vi.fn(),
    updateOrderStatus: vi.fn(),
  } as unknown as IOrderStatusUseCase;

  getOrdersQueueFormatedPresenter = {
    convertToViewModel: vi.fn(),
    convertToUseCaseDTO: vi.fn(),
    sendResponse: vi.fn(),
    convertErrorResponse: vi.fn(),
  } as unknown as GetOrdersQueueFormatedPresenter;

  updateOrderStatusPresenter = {
    convertToViewModel: vi.fn(),
    convertToUseCaseDTO: vi.fn(),
    sendResponse: vi.fn(),
    convertErrorResponse: vi.fn(),
  } as unknown as UpdateOrderStatusPresenter;

  orderStatusController = new OrderStatusController(
    orderStatusUseCase,
    getOrdersQueueFormatedPresenter,
    updateOrderStatusPresenter
  );

  req = {} as FastifyRequest;
  res = {
    code: vi.fn().mockReturnThis(),
    send: vi.fn().mockReturnThis(),
  } as unknown as FastifyReply;
});

describe("OrderStatusController", () => {
  describe("getOrdersQueueFormated", () => {
    it("should call getOrdersQueueFormated use case and send response", async () => {
      const useCaseRequest: GetOrdersQueueFormatedUseCaseRequestDTO = {
        params: new PaginationParams(1, 10),
      };

      const orderQueuMock: OrderQueue = {
        number: faker.string.uuid(),
        status: faker.lorem.sentence(),
        userName: faker.lorem.word(),
      };

      const useCaseResponse: GetOrdersQueueFormatedUseCaseResponseDTO = {
        paginationResponse: new PaginationResponse<OrderQueue>({
          currentPage: faker.number.int(),
          data: [orderQueuMock],
          pageSize: faker.number.int(),
          totalItems: faker.number.int(),
          totalPages: faker.number.int(),
        }),
      };

      vi.spyOn(
        getOrdersQueueFormatedPresenter,
        "convertToUseCaseDTO"
      ).mockReturnValueOnce(useCaseRequest);
      vi.spyOn(
        orderStatusUseCase,
        "getOrdersQueueFormated"
      ).mockResolvedValueOnce(useCaseResponse);

      await orderStatusController.getOrdersQueueFormated(req, res);

      expect(orderStatusUseCase.getOrdersQueueFormated).toHaveBeenCalledWith(
        useCaseRequest
      );
      expect(getOrdersQueueFormatedPresenter.sendResponse).toHaveBeenCalledWith(
        res,
        useCaseResponse
      );
    });

    it("should handle errors and send error response", async () => {
      const error = new Error("GetOrdersQueueFormated error");
      vi.spyOn(
        orderStatusUseCase,
        "getOrdersQueueFormated"
      ).mockRejectedValueOnce(error);

      await orderStatusController.getOrdersQueueFormated(req, res);

      expect(
        getOrdersQueueFormatedPresenter.convertErrorResponse
      ).toHaveBeenCalledWith(error, res);
    });
  });

  describe("updateOrderStatus", () => {
    it("should call updateOrderStatus use case and send response", async () => {
      const useCaseRequest: UpdateOrderStatusUseCaseRequestDTO = {
        id: faker.string.uuid(),
        status: OrderStatusEnum.IN_PREPARATION,
      };

      const orderStatusMock = makeOrderStatus(
        {},
        new UniqueEntityId(useCaseRequest.id)
      );
      const useCaseResponse: UpdateOrderStatusUseCaseResponseDTO = {
        orderStatus: orderStatusMock,
      };

      vi.spyOn(
        updateOrderStatusPresenter,
        "convertToUseCaseDTO"
      ).mockReturnValueOnce(useCaseRequest);
      vi.spyOn(orderStatusUseCase, "updateOrderStatus").mockResolvedValueOnce(
        useCaseResponse
      );

      await orderStatusController.updateOrderStatus(req, res);

      expect(orderStatusUseCase.updateOrderStatus).toHaveBeenCalledWith(
        useCaseRequest
      );
      expect(updateOrderStatusPresenter.sendResponse).toHaveBeenCalledWith(
        res,
        useCaseResponse
      );
    });

    it("should handle errors and send error response", async () => {
      const error = new Error("UpdateOrderStatus error");
      vi.spyOn(orderStatusUseCase, "updateOrderStatus").mockRejectedValueOnce(
        error
      );

      await orderStatusController.updateOrderStatus(req, res);

      expect(
        updateOrderStatusPresenter.convertErrorResponse
      ).toHaveBeenCalledWith(error, res);
    });
  });
});
