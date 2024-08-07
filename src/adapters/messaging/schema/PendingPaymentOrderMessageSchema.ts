import { z } from "zod";

export const pendingPaymentOrderMessageSchema = z.object({
  orderId: z.string(),
});
