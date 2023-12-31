import {
  OrderCancelledEvent,
  OrderCreatedEvent,
  OrderStatus,
} from "@amritorg/common";
import Ticket from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedListener } from "../order-created-listener";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { OrderCancelledListener } from "../order-cancelled-listener";

const setup = async () => {
  // Create an instance of the listener

  const listener = new OrderCancelledListener(natsWrapper.client);

  // create and save a ticket

  const orderId = new mongoose.Types.ObjectId().toHexString();
  const ticket = Ticket.build({ title: "concert", price: 8, userId: "asdfa" });
  ticket.set({ orderId });
  await ticket.save();

  // create the fake data event

  const data: OrderCancelledEvent["data"] = {
    orderId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    ticket: {
      id: ticket.id,
    },
  };

  //@ts-ignore
  let msg: Message = {
    ack: jest.fn(),
  };

  return { listener, ticket, data, msg, orderId };
};

it("updates the ticket, publishes an event, and acks the message", async () => {
  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);
  expect(updatedTicket!.orderId).not.toBeDefined();
  expect(natsWrapper.client.publish).toHaveBeenCalled();
  expect(msg.ack).toHaveBeenCalled();
});
