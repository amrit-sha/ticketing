import request from "supertest";
import app from "../../app";
import Ticket from "../../models/ticket";

let ticketPayload = {
  title: "sdfasd",
  price: 32,
};
const createTicket = async () =>
  request(app)
    .post("/api/tickets")
    .set("Cookie", global.signup())
    .send(ticketPayload);

it("can fetch a list of tickets", async () => {
  await createTicket();
  await createTicket();
  await createTicket();

  const response = await request(app).get("/api/tickets").send().expect(200);

  expect(response.body.length).toBe(3);
});
