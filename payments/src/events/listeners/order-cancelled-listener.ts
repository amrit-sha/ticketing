import {
  Listener,
  OrderCancelledEvent,
  OrderStatus,
  Subjects,
} from "@amritorg/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import Order from "../../models/order";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  queueGroupName: string = queueGroupName;
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;

  async onMessage(
    data: { orderId: string; version: number; ticket: { id: string } },
    msg: Message
  ) {
    let order = await Order.findOne({
      _id: data.orderId,
      version: data.version - 1,
    });

    if (!order) {
      throw new Error("order not found");
    }

    order.set({
      status: OrderStatus.Cancelled,
    });

    await order.save();

    msg.ack();
  }
}
