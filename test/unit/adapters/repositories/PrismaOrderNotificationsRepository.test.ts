import { describe, it, expect, beforeEach, vi } from "vitest";

import { PrismaOrderNotificationToDomainConverter } from "@/adapters/repositories/converters/PrismaOrderNotificationToDomainConverter";
import { PrismaOrderNotificationsPrismaRepository } from "@/adapters/repositories/PrismaOrderNotificationsRepository";
import { PaginationParams } from "@/core/domain/base/PaginationParams";
import { PaginationResponse } from "@/core/domain/base/PaginationResponse";
import { prisma } from "@/drivers/db/prisma/config/prisma";
import { OrderNotification as RepositoryOrderNotification } from "@prisma/client";
import { makeOrderNotification } from "@test/unit/factories/MakeOrderNotification";
import { makeRepositoryOrderNotificationNotification } from "@test/unit/factories/repository/MakeRepositoryOrderNotfication";

vi.mock("@/drivers/db/prisma/config/prisma", () => ({
  prisma: {
    orderNotification: {
      findUnique: vi.fn(),
      count: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
  },
}));

let repository: PrismaOrderNotificationsPrismaRepository;
let orderNotification: RepositoryOrderNotification;

beforeEach(() => {
  repository = new PrismaOrderNotificationsPrismaRepository();
  orderNotification = makeRepositoryOrderNotificationNotification();
});

describe("PrismaOrderNotificationsPrismaRepository", () => {
  describe("findMany", () => {
    it("should find many order notifications with pagination", async () => {
      const notifications = [orderNotification];
      const totalItems = notifications.length;
      const paginationParams = new PaginationParams(1, 10);

      vi.mocked(prisma.orderNotification.count).mockResolvedValueOnce(
        totalItems
      );
      vi.mocked(prisma.orderNotification.findMany).mockResolvedValueOnce(
        notifications
      );

      const result = await repository.findMany(paginationParams);

      expect(prisma.orderNotification.count).toHaveBeenCalled();
      expect(prisma.orderNotification.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
      });

      expect(result).toEqual(
        new PaginationResponse<RepositoryOrderNotification>({
          data: notifications.map((c) =>
            PrismaOrderNotificationToDomainConverter.convert(c)
          ),
          totalItems,
          currentPage: paginationParams.page,
          pageSize: paginationParams.size,
          totalPages: Math.ceil(totalItems / paginationParams.size),
        })
      );
    });
  });

  describe("create", () => {
    it("should create a new order notification", async () => {
      const orderNotificationToCreate = makeOrderNotification();
      vi.mocked(prisma.orderNotification.create).mockResolvedValueOnce(
        orderNotification
      );

      const result = await repository.create(orderNotificationToCreate);

      expect(prisma.orderNotification.create).toHaveBeenCalledWith({
        data: {
          user_id: orderNotificationToCreate.userId.toString(),
          order_id: orderNotificationToCreate.orderId.toString(),
          message: orderNotificationToCreate.message,
          status: orderNotificationToCreate.status.name,
        },
      });
      expect(result).toEqual(
        PrismaOrderNotificationToDomainConverter.convert(orderNotification)
      );
    });
  });

  describe("findById", () => {
    it("should find order notification by id", async () => {
      vi.mocked(prisma.orderNotification.findUnique).mockResolvedValueOnce(
        orderNotification
      );

      const result = await repository.findById(orderNotification.id);

      expect(prisma.orderNotification.findUnique).toHaveBeenCalledWith({
        where: { id: orderNotification.id },
      });
      expect(result).toEqual(
        PrismaOrderNotificationToDomainConverter.convert(orderNotification)
      );
    });

    it("should return null if order notification not found", async () => {
      vi.mocked(prisma.orderNotification.findUnique).mockResolvedValueOnce(
        null
      );

      const result = await repository.findById(orderNotification.id);

      expect(result).toBeNull();
    });
  });

  describe("update", () => {
    it("should update an existing order notification", async () => {
      const orderNotificationToUpdate = makeOrderNotification();
      vi.mocked(prisma.orderNotification.update).mockResolvedValueOnce(
        orderNotification
      );

      const result = await repository.update(orderNotificationToUpdate);

      expect(prisma.orderNotification.update).toHaveBeenCalledWith({
        where: { id: orderNotificationToUpdate.id.toString() },
        data: {
          status: orderNotificationToUpdate.status.name,
        },
      });
      expect(result).toEqual(
        PrismaOrderNotificationToDomainConverter.convert(orderNotification)
      );
    });
  });
});
