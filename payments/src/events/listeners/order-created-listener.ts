import {
  Listener,
  OrderCreatedEvent,
  OrderStatus,
  Subjects,
} from "@amritorg/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import Order from "../../models/order";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName: string = queueGroupName;
  async onMessage(
    data: {
      orderId: string;
      version: number;
      status: OrderStatus;
      userId: string;
      expiresAt: string;
      ticket: { id: string; price: number };
    },
    msg: Message
  ) {
    const order = Order.build({
      id: data.orderId,
      version: data.version,
      price: data.ticket.price,
      status: data.status,
      userId: data.userId,
    });

    await order.save();

    msg.ack();
  }
}
