import request from "supertest";
import app from "../../app";
import { response } from "express";
import mongoose from "mongoose";
import User from "../../models/user";

it("gives details of currentuser", async () => {
  const cookie = await global.signup();

  let dbuser = await User.findOne({ email: "amrit@gmail.com" });

  let res = await request(app)
    .get("/api/users/currentuser")
    .set("Cookie", cookie)
    .expect(200);
  expect(res.body.currentUser.email).toEqual("amrit@gmail.com");
});
it("gives null as currentuser if not logged in", async () => {
  let res = await request(app).get("/api/users/currentuser").expect(200);

  expect(res.body).toEqual({
    currentUser: null,
  });
});
