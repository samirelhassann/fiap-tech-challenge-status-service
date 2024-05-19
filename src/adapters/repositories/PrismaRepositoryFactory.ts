import { PrismaOrderNotificationsPrismaRepository } from "./PrismaOrderNotificationsRepository";
import { PrismaOrderStatusRepository } from "./PrismaOrderStatusRepository";

let orderNotificationsRepository: PrismaOrderNotificationsPrismaRepository;
let orderStatusRepository: PrismaOrderStatusRepository;

export function makeOrderNotificationRepository() {
  if (!orderNotificationsRepository) {
    orderNotificationsRepository =
      new PrismaOrderNotificationsPrismaRepository();
  }
  return orderNotificationsRepository;
}

export function makeOrderStatusRepository() {
  if (!orderStatusRepository) {
    orderStatusRepository = new PrismaOrderStatusRepository();
  }
  return orderStatusRepository;
}
