import request from "supertest";
import app from "../../app";
import Ticket from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";

it("has a route handler listening to /api/tickets for post requests", async () => {
  const response = await request(app).post("/api/tickets").send({});

  expect(response.status).not.toEqual(404);
});
it("can only be accessed if the user is signed in", async () => {
  const response = await request(app).post("/api/tickets").send({});
  expect(response.status).toEqual(401);
});
it("returns status other than 401 if the user is signed in", async () => {
  const cookie = global.signup();
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({});
  expect(response.status).not.toEqual(401);
});
it("returns an error in if an invalid title is provided", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signup())
    .send({
      title: "",
      price: 32,
    })
    .expect(400);
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signup())
    .send({
      price: 32,
    })
    .expect(400);

  // expect(response.body).toContain({});
});
it("returns an error if an invalid price is provided", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signup())
    .send({
      title: "sdfasd",
      price: -32,
    })
    .expect(400);
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signup())
    .send({
      title: "sdfasd",
      price: "sadfas",
    })
    .expect(400);
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signup())
    .send({
      title: "sdfasd",
    })
    .expect(400);
});
it("creates a tickets with valid inputs", async () => {
  let ticketPayload = {
    title: "sdfasd",
    price: 32,
  };
  let tickets = await Ticket.find({});

  expect(tickets.length).toEqual(0);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signup())
    .send(ticketPayload)
    .expect(201);

  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
  expect(tickets[0].price).toEqual(ticketPayload.price);
  expect(tickets[0].title).toEqual(ticketPayload.title);
});

it("publishes an event", async () => {
  let ticketPayload = {
    title: "sdfasd",
    price: 32,
  };
  let tickets = await Ticket.find({});

  expect(tickets.length).toEqual(0);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signup())
    .send(ticketPayload)
    .expect(201);

  tickets = await Ticket.find({});

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
