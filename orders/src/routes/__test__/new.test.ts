import request from "supertest";
import app from "../../app";
import mongoose from "mongoose";
import Ticket from "../../models/ticket";
import Order from "../../models/order";
import { OrderStatus } from "@amritorg/common";
import { natsWrapper } from "../../nats-wrapper";
it("returns an error if ticket does not exists", async () => {
  const ticketId = new mongoose.Types.ObjectId();

  const res = await request(app)
    .post("/api/orders")
    .set("Cookie", global.signup())
    .send({
      ticketId,
    })
    .expect(404);
});

it("returns an error if ticket is already reserved", async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),

    price: 500,
    title: "concert",
  });

  await ticket.save();

  const order = Order.build({
    userId: "sldfjsdf",
    ticket,
    status: OrderStatus.Created,
    expiresAt: new Date(),
  });

  await order.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signup())
    .send({ ticketId: ticket.id })
    .expect(400);
});

it("reserves a ticket", async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),

    price: 500,
    title: "concert",
  });

  await ticket.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signup())
    .send({ ticketId: ticket.id })
    .expect(201);
});

it("emits an order created event", async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 500,
    title: "concert",
  });

  await ticket.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signup())
    .send({ ticketId: ticket.id })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
