import request from "supertest";
import app from "../../app";
import { response } from "express";

it("cookie should be cleared after signout", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "amrit@gmail.com", password: "123455" })
    .expect(201);
  let res = await request(app)
    .post("/api/users/signin")
    .send({ email: "amrit@gmail.com", password: "123455" });

  expect(res.get("Set-Cookie")).toBeDefined();

  let res1 = await request(app).get("/api/users/signout").send({}).expect(200);
  expect(res1.get("Set-Cookie")[0]).toEqual(
    "session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly"
  );
});
