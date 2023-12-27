import Ticket from "../../models/ticket";
import request from "supertest";
import app from "../../app";
import mongoose from "mongoose";
import Order from "../../models/order";
import { OrderStatus } from "@amritorg/common";

export const buildTicket = async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),

    price: 500,
    title: "concert",
  });

  return ticket.save();
};

it("fetches the orders", async () => {
  let ticket1 = await buildTicket();
  let ticket2 = await buildTicket();
  let ticket3 = await buildTicket();

  let cookie = global.signup();
  const { body: order1 } = await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({ ticketId: ticket1.id })
    .expect(201);

  const { body: order2 } = await request(app)
    .post("/api/orders")
    .set("Cookie", global.signup())
    .send({ ticketId: ticket2.id })
    .expect(201);
  const { body: order3 } = await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({ ticketId: ticket3.id })
    .expect(201);

  const orders = await request(app)
    .get("/api/orders")
    .set("Cookie", cookie)
    .expect(200);

  expect(orders.body.length).toEqual(2);
  expect(orders.body[0].id).toEqual(order1.id);
  expect(orders.body[1].id).toEqual(order3.id);
  expect(orders.body[0].ticket.id).toEqual(ticket1.id);
});
