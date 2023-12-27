import {
  OrderCreatedEvent,
  OrderStatus,
  TicketUpdatedEvent,
} from "@amritorg/common";
import Ticket from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedListener } from "../order-created-listener";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";

const setup = async () => {
  // Create an instance of the listener
  const listener = new OrderCreatedListener(natsWrapper.client);

  // create and save a ticket

  const ticket = Ticket.build({ title: "concert", price: 8, userId: "asdfa" });

  await ticket.save();

  // create the fake data event

  const data: OrderCreatedEvent["data"] = {
    userId: "adsf",
    orderId: new mongoose.Types.ObjectId().toHexString(),
    expiresAt: "asdfa",
    status: OrderStatus.Created,
    version: 0,
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };

  //@ts-ignore
  let msg: Message = {
    ack: jest.fn(),
  };

  return { listener, ticket, data, msg };
};

it("sets the userId of the ticket", async () => {
  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).toEqual(data.orderId);
});

it("acks the message", async () => {
  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it("publishes ticket updated event", async () => {
  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
  expect(msg.ack).toHaveBeenCalled();

  let ticketUpdatedData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );

  expect(data.orderId).toEqual(ticketUpdatedData.orderId);
});

afterEach(() => jest.clearAllMocks());
