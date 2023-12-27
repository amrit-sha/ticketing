import request from "supertest";
import app from "../../app";
import Ticket from "../../models/ticket";
import mongoose from "mongoose";
import { natsWrapper } from "../../nats-wrapper";

afterEach(() => jest.clearAllMocks());

it("returns 404 if ticket is not found", async () => {
  let res = await request(app)
    .get(`/api/tickets/${new mongoose.Types.ObjectId().toHexString()}`)
    .expect(404);
  // console.log(res.body);
});
it("returns 401 if user is not authenticated", async () => {
  await request(app)
    .patch(`/api/tickets/${new mongoose.Types.ObjectId().toHexString()}`)
    .expect(401);
  // console.log(res.body);
});
it("returns 404 if ticket is not found", async () => {});
it("returns 401 if the user does not own the ticket", async () => {
  let ticketPayload = {
    title: "sdfasd",
    price: 32,
  };
  let otherUser = global.signup();
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signup())
    .send(ticketPayload)
    .expect(201);

  await request(app)
    .patch(`/api/tickets/${response.body.id}`)
    .set("Cookie", otherUser)
    .send({
      title: "other title",
      price: 323,
    })
    .expect(401);

  //   const ticketResponse = await request(app)
  //     .get(`/api/tickets/${response.body.id}`)
  //     .expect(200);
  //   expect(ticketResponse.body.title).toEqual(ticketPayload.title);
  //   expect(ticketResponse.body.price).toEqual(ticketPayload.price);
});

it("gives 400 with invalid inputs", async () => {
  let ticketPayload = {
    title: "sdfasd",
    price: 32,
  };
  let cookie = global.signup();

  const ticket = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send(ticketPayload)
    .expect(201);

  const res = await request(app)
    .patch(`/api/tickets/${ticket.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "",
      price: -44,
    })
    .expect(400);
});

it("updates a tickets with valid user and inputs", async () => {
  let ticketPayload = {
    title: "sdfasd",
    price: 32,
  };
  let cookie = global.signup();

  const ticket = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send(ticketPayload)
    .expect(201);

  const res = await request(app)
    .patch(`/api/tickets/${ticket.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "erwwr",
      price: 3221,
    })
    .expect(200);

  expect(res.body.title).toEqual("erwwr");
  expect(res.body.price).toEqual(3221);
});

it("publishes an event", async () => {
  let ticketPayload = {
    title: "sdfasd",
    price: 32,
  };
  let cookie = global.signup();

  const ticket = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send(ticketPayload)
    .expect(201);

  const res = await request(app)
    .patch(`/api/tickets/${ticket.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "erwwr",
      price: 3221,
    })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it("rejects update if ticket is reserved", async () => {
  let ticketPayload = {
    title: "sdfasd",
    price: 32,
  };
  let cookie = global.signup();

  const ticket = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send(ticketPayload)
    .expect(201);

  const t = await Ticket.findById(ticket.body.id);

  t!.set({ orderId: new mongoose.Types.ObjectId().toHexString() });

  await t?.save();

  const res = await request(app)
    .patch(`/api/tickets/${ticket.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "erwwr",
      price: 3221,
    })
    .expect(400);
});
