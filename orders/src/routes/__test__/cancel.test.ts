import Ticket from "../../models/ticket";
import request from "supertest";
import app from "../../app";
import mongoose from "mongoose";
import Order from "../../models/order";
import { OrderStatus } from "@amritorg/common";
import { buildTicket } from "./index.test";
import { natsWrapper } from "../../nats-wrapper";

it("gives 204 if ticket cancelled", async () => {
  const ticket = await buildTicket();

  let cookie = global.signup();
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", cookie)
    .send()
    .expect(204);

  let updatedOrder = await Order.findById(order.id);

  expect(updatedOrder?.status).toEqual(OrderStatus.Cancelled);
});
it("gives 401 if order does not belong to user", async () => {
  const ticket = await buildTicket();

  let cookie = global.signup();
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({ ticketId: ticket.id })
    .expect(201);

  let res = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", global.signup())
    .send()
    .expect(401);
});
it("gives 404 if order not found", async () => {
  const ticket = await buildTicket();

  let cookie = global.signup();
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({ ticketId: ticket.id })
    .expect(201);

  let res = await request(app)
    .get(`/api/orders/${new mongoose.Types.ObjectId()}`)
    .set("Cookie", global.signup())
    .send()
    .expect(404);
});

it("publishes event after cancelling order", async () => {
  const ticket = await buildTicket();

  let cookie = global.signup();
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", cookie)
    .send()
    .expect(204);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
