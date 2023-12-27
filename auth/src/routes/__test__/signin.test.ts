import request from "supertest";
import app from "../../app";
import { response } from "express";

// describe("sign in route", () => {
//   beforeEach(async () => {
//     await request(app)
//       .post("/api/users/signup")
//       .send({ email: "amrit@gmail.com", password: "123455" })
//       .expect(201);
//   });

it("returns a 201 on successful sign in", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "amrit@gmail.com", password: "123455" })
    .expect(201);
  await request(app)
    .post("/api/users/signin")
    .send({ email: "amrit@gmail.com", password: "123455" })
    .expect(200);
});

it("returns 400 with an invalid email", async () => {
  return request(app)
    .post("/api/users/signin")
    .send({ email: "mail@mea.com", password: "123455" })
    .expect(400);
});

it("returns 400 with an invalid password", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "amrit@gmail.com", password: "123455" })
    .expect(201);

  await request(app)
    .post("/api/users/signin")
    .send({ email: "amrit@gmail.com", password: "1sdfaf5" })
    .expect(400);
});
it("returns 400 with missing email and password", async () => {
  await request(app)
    .post("/api/users/signin")
    .send({ email: "email@gmail.com" })
    .expect(400);
  await request(app)
    .post("/api/users/signin")
    .send({ password: "sdlfkajf" })
    .expect(400);
});

it("sets a cookie after successful signin", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "amrit@gmail.com", password: "123455" })
    .expect(201);
  let res = await request(app)
    .post("/api/users/signin")
    .send({ email: "amrit@gmail.com", password: "123455" });

  expect(res.get("Set-Cookie")).toBeDefined();
});
