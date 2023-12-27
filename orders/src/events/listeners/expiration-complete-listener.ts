import {
  Listener,
  ExpirationCompleteEvent,
  Subjects,
  OrderStatus,
} from "@amritorg/common";
import { queueGroupname } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import Order from "../../models/order";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  queueGroupName = queueGroupname;
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;

  async onMessage(data: { orderId: string }, msg: Message) {
    const order = await Order.findById(data.orderId).populate("ticket");
    if (!order) {
      throw new Error("Order not found");
    }

    if (order.status === OrderStatus.Complete) {
      return msg.ack();
    }

    order.set({
      status: OrderStatus.Cancelled,
    });
    await order.save();

    await new OrderCancelledPublisher(this.client).publish({
      orderId: order.id,
      version: order.version,
      ticket: { id: order.ticket._id },
    });

    msg.ack();
  }
}
