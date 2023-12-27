import request from "supertest";
import app from "../../app";
import Ticket from "../../models/ticket";
import mongoose from "mongoose";

it("returns 404 if ticket is not found", async () => {
  let res = await request(app)
    .get(`/api/tickets/${new mongoose.Types.ObjectId().toHexString()}`)
    .expect(404);
  // console.log(res.body);
});
it("returns ticket if ticket is found", async () => {
  let ticketPayload = {
    title: "sdfasd",
    price: 32,
  };
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signup())
    .send(ticketPayload)
    .expect(201);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .expect(200);

  expect(ticketResponse.body.title).toEqual(ticketPayload.title);
  expect(ticketResponse.body.price).toEqual(ticketPayload.price);
});
