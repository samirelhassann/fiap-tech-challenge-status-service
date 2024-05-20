import { FastifyReply, FastifyRequest } from "fastify";
import { describe, expect, it, beforeEach, vi } from "vitest";

import { OrderNotificationController } from "@/adapters/controllers/orderNotification/OrderNotificationsController";
import { GetOrderNotificationsPresenter } from "@/adapters/presenters/orderNotification/GetOrderNotificationsPresenter";
import { PaginationParams } from "@/core/domain/base/PaginationParams";
import { PaginationResponse } from "@/core/domain/base/PaginationResponse";
import {
  GetOrderNotificationsUseCaseRequestDTO,
  GetOrderNotificationsUseCaseResponseDTO,
} from "@/core/useCases/orderNotification/dto/GetOrderNotificationsUseCaseDTO";
import { IOrderNotificationUseCase } from "@/core/useCases/orderNotification/IOrderNotificationUseCase";
import { faker } from "@faker-js/faker";
import { makeOrderNotification } from "@test/unit/factories/MakeOrderNotification";

let req: FastifyRequest;
let res: FastifyReply;
let orderNotificationController: OrderNotificationController;
let orderNotificationUseCase: IOrderNotificationUseCase;
let getOrderNotificationsPresenter: GetOrderNotificationsPresenter;

beforeEach(() => {
  orderNotificationUseCase = {
    createOrderNotification: vi.fn(),
    getNotifications: vi.fn(),
  };

  getOrderNotificationsPresenter = {
    convertToViewModel: vi.fn(),
    convertToUseCaseDTO: vi.fn(),
    sendResponse: vi.fn(),
    convertErrorResponse: vi.fn(),
  };

  orderNotificationController = new OrderNotificationController(
    orderNotificationUseCase,
    getOrderNotificationsPresenter
  );

  req = {} as FastifyRequest;
  res = {
    code: vi.fn().mockReturnThis(),
    send: vi.fn().mockReturnThis(),
  } as unknown as FastifyReply;
});

describe("OrderNotificationController", () => {
  describe("getOrderNotifications", () => {
    it("should call getNotifications use case and send response", async () => {
      const useCaseRequest: GetOrderNotificationsUseCaseRequestDTO = {
        params: new PaginationParams(1, 10),
      };

      const orderNotificationMock = makeOrderNotification();
      const useCaseResponse: GetOrderNotificationsUseCaseResponseDTO = {
        paginationResponse: new PaginationResponse({
          currentPage: faker.number.int(),
          data: [orderNotificationMock],
          pageSize: faker.number.int(),
          totalItems: faker.number.int(),
          totalPages: faker.number.int(),
        }),
      };

      vi.spyOn(
        getOrderNotificationsPresenter,
        "convertToUseCaseDTO"
      ).mockReturnValueOnce(useCaseRequest);
      vi.spyOn(
        orderNotificationUseCase,
        "getNotifications"
      ).mockResolvedValueOnce(useCaseResponse);

      await orderNotificationController.getOrderNotifications(req, res);

      expect(orderNotificationUseCase.getNotifications).toHaveBeenCalledWith(
        useCaseRequest
      );
      expect(getOrderNotificationsPresenter.sendResponse).toHaveBeenCalledWith(
        res,
        useCaseResponse
      );
    });

    it("should handle errors and send error response", async () => {
      const error = new Error("GetOrderNotifications error");
      vi.spyOn(
        orderNotificationUseCase,
        "getNotifications"
      ).mockRejectedValueOnce(error);

      await orderNotificationController.getOrderNotifications(req, res);

      expect(
        getOrderNotificationsPresenter.convertErrorResponse
      ).toHaveBeenCalledWith(error, res);
    });
  });
});
