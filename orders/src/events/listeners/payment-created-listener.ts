import {
  Listener,
  OrderStatus,
  PaymentCreatedEvent,
  Subjects,
} from "@amritorg/common";
import { queueGroupname } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import Order from "../../models/order";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
  queueGroupName = queueGroupname;
  async onMessage(
    data: { id: string; orderId: string; stripeId: string },
    msg: Message
  ) {
    const order = await Order.findById(data.orderId);

    if (!order) {
      throw new Error("order not found");
    }

    order.set({
      status: OrderStatus.Complete,
    });

    await order.save();

    msg.ack();
  }
}
