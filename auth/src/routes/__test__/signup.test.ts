import request from "supertest";
import app from "../../app";
import { response } from "express";

it("returns a 201 on successful signup", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({ email: "amrit@gmail.com", password: "123455" })
    .expect(201);
});

it("returns 400 with an invalid email", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({ email: "mail.com", password: "123455" })
    .expect(400);
});
it("returns 400 with an invalid password", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({ email: "mail@mail.com", password: "15" })
    .expect(400);
});
it("returns 400 with an invalid password", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({ email: "mail@mail.com", password: "15" })
    .expect(400);
});
it("returns 400 with missing email and password", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "email@gmail.com" })
    .expect(400);
  await request(app)
    .post("/api/users/signup")
    .send({ password: "sdlfkajf" })
    .expect(400);
});

it("disallows duplicate emails", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "amrit@gmail.com", password: "123455" })
    .expect(201);
  await request(app)
    .post("/api/users/signup")
    .send({ email: "amrit@gmail.com", password: "123455" })
    .expect(400);
});

it("sets a cookie after successful signup", async () => {
  let res = await request(app)
    .post("/api/users/signup")
    .send({ email: "amrit@gmail.com", password: "123455" });

  expect(res.get("Set-Cookie")).toBeDefined();
});
